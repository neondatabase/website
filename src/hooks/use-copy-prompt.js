import { useCallback, useEffect, useRef, useState } from 'react';

// "Copied" confirmation shows for ~1.4s, then the control reverts to its
// default state. Shared by every agent-prompt copy control so they all flip
// back on the same timer.
const DEFAULT_RESET_MS = 1400;

// Copy as plain text only. navigator.clipboard.writeText writes a text/plain
// payload (no text/html), so the prompt pastes as normal body text rather than
// the styled/monospace markup a DOM-selection copy would carry. The hidden
// textarea execCommand path is a plain-text fallback for contexts without the
// async clipboard API (for example some iframes).
async function writePlainText(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the textarea fallback.
    }
  }
  if (typeof document === 'undefined') return;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
  } catch {
    // Clipboard unavailable; nothing more we can do.
  }
  document.body.removeChild(textarea);
}

/**
 * Shared copy behavior for the agent-prompt controls: plain-text copy with a
 * textarea fallback, a "copied" flag that resets after `resetMs`, and an
 * optional callback fired after the copy so each surface keeps its own
 * analytics event.
 *
 * @param {number} [resetMs=1400] How long the copied state stays on.
 * @returns {{ isCopied: boolean, copy: (text: string, onCopied?: () => void) => Promise<void> }}
 */
export default function useCopyPrompt(resetMs = DEFAULT_RESET_MS) {
  const [isCopied, setIsCopied] = useState(false);
  const resetTimeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(resetTimeoutRef.current), []);

  const copy = useCallback(
    async (text, onCopied) => {
      await writePlainText(text);
      setIsCopied(true);
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = setTimeout(() => setIsCopied(false), resetMs);
      if (typeof onCopied === 'function') onCopied();
    },
    [resetMs]
  );

  return { isCopied, copy };
}
