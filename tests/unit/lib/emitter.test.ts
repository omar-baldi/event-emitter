import { Emitter } from "@/lib/emitter";
import { vi } from "vitest";

describe("Emitter", () => {
  it("should call all subscribed functions with the correct arguments when event is emitted", () => {
    const emitter = new Emitter();
    const fn1 = vi.fn((...args: unknown[]) => undefined);
    const fn2 = vi.fn((...args: unknown[]) => undefined);

    emitter.subscribe("function_name", fn1, fn2);
    emitter.emit("function_name", 1, "another", 2);

    expect(fn1).toHaveBeenCalled();
    expect(fn1).toHaveBeenCalledWith([1, "another", 2]);

    expect(fn2).toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledWith([1, "another", 2]);
  });
});