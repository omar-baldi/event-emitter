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

  it("should not call any subscribed functions after releasing a single subscription", () => {
    const emitter = new Emitter();
    const fn1 = vi.fn((...args: unknown[]) => undefined);
    const fn2 = vi.fn((...args: unknown[]) => undefined);

    const sub = emitter.subscribe("function_name", fn1, fn2);
    sub.release();
    emitter.emit("function_name", 1, 2);

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();
  });

  it("should call remaining subscribed functions after releasing one of multiple subscriptions", () => {
    const emitter = new Emitter();
    const fn1 = vi.fn((...args: unknown[]) => undefined);
    const fn2 = vi.fn((...args: unknown[]) => undefined);
    const fn3 = vi.fn((...args: unknown[]) => undefined);

    const sub_1 = emitter.subscribe("function_name", fn1, fn2);
    const sub_2 = emitter.subscribe("function_name", fn3);

    sub_1.release();
    emitter.emit("function_name", 1, 2);

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();
    expect(fn3).toHaveBeenCalled();
    expect(fn3).toHaveBeenCalledWith([1, 2]);
  });
});
