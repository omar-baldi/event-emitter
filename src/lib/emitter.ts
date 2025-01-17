import { v4 as v4UUID } from "uuid";

type FN = (...args: unknown[]) => void;

export class Emitter {
  private subscriptions = new Map<string, Map<string, FN>>();

  private generateFunctionWithUniqueId(fn: FN) {
    return {
      id: v4UUID(),
      fn,
    };
  }

  private release(functionName: string, ids: string[]) {
    const updatedFunctionsMap = this.subscriptions.get(functionName)!;
    ids.forEach((id) => updatedFunctionsMap.delete(id));

    if (updatedFunctionsMap.size > 0) {
      this.subscriptions.set(functionName, updatedFunctionsMap);
    } else {
      this.subscriptions.delete(functionName);
    }
  }

  subscribe(functionName: string, ...fns: FN[]) {
    const functionsWithIds = fns.map(this.generateFunctionWithUniqueId);

    const m = this.subscriptions.has(functionName)
      ? this.subscriptions.get(functionName)!
      : new Map<string, FN>();

    functionsWithIds.forEach((v) => m.set(v.id, v.fn));
    this.subscriptions.set(functionName, m);

    return {
      release: () => {
        const ids = functionsWithIds.map((v) => v.id);
        this.release(functionName, ids);
      },
    };
  }

  emit(functionName: string, ...args: unknown[]) {
    const functionsMap = this.subscriptions.get(functionName);

    if (functionsMap) {
      [...functionsMap.values()].forEach((fn) => fn(args));
    }
  }
}
