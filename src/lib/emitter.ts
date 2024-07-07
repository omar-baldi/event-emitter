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

  private release(functionName: string, ids: string[]) {}

  subscribe(functionName: string, ...fns: FN[]) {
    const functionsWithIds = fns.map(this.generateFunctionWithUniqueId);

    if (this.subscriptions.has(functionName)) {
      const m = this.subscriptions.get(functionName)!;
      functionsWithIds.forEach((v) => m.set(v.id, v.fn));
      this.subscriptions.set(functionName, m);
    } else {
      const m = new Map<string, FN>();
      functionsWithIds.forEach((v) => m.set(v.id, v.fn));
      this.subscriptions.set(functionName, m);
    }

    return {
      release: this.release,
    };
  }

  emit(functionName: string, ...args: unknown[]) {}
}
