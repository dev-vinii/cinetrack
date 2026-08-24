import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebouncedValue } from "./use-debounced-value";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("hello", 400));
    expect(result.current).toBe("hello");
  });

  it("updates value after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "a", delay: 400 } }
    );

    rerender({ value: "b", delay: 400 });

    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe("b");
  });

  it("cancels pending update when value changes again", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 400),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "b" });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: "c" });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe("c");
  });
});
