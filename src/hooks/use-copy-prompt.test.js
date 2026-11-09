import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useCopyPrompt from './use-copy-prompt';

describe('useCopyPrompt', () => {
  let writeText;

  beforeEach(() => {
    vi.useFakeTimers();
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('copies plain text, flips isCopied, and fires the optional callback', async () => {
    const onCopied = vi.fn();
    const { result } = renderHook(() => useCopyPrompt());

    await act(async () => {
      await result.current.copy('hello prompt', onCopied);
    });

    expect(writeText).toHaveBeenCalledWith('hello prompt');
    expect(typeof writeText.mock.calls[0][0]).toBe('string');
    expect(result.current.isCopied).toBe(true);
    expect(onCopied).toHaveBeenCalledTimes(1);
  });

  it('works without a callback and resets isCopied after the timer', async () => {
    const { result } = renderHook(() => useCopyPrompt(1400));

    await act(async () => {
      await result.current.copy('x');
    });
    expect(result.current.isCopied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1400);
    });
    expect(result.current.isCopied).toBe(false);
  });

  it('falls back to a textarea when the async clipboard API is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    const execCommand = vi.fn();
    document.execCommand = execCommand;

    const { result } = renderHook(() => useCopyPrompt());

    await act(async () => {
      await result.current.copy('fallback text');
    });

    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(result.current.isCopied).toBe(true);
  });
});
