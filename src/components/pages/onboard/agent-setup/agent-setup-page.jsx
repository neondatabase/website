'use client';

import * as Toast from '@radix-ui/react-toast';
import { useCallback, useEffect, useRef, useState } from 'react';

import CheckIcon from 'components/shared/logo/images/check.inline.svg';
import CloseIcon from 'icons/close-small.inline.svg';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

// The prompt emails send people here to copy. Kept as plain text so the agent
// receives the URL exactly as written.
export const PROMPT =
  'Set up my agent to work with Neon by following the instructions at https://neon.com/get-started/prompt.md';

// Unlike the shared useCopyPrompt hook, this reports whether the copy worked:
// browsers usually block clipboard writes that don't follow a click or key
// press, and the page needs to know so it can fall back to the button.
async function writePlainText(text) {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

const AgentSetupPage = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const removeGestureListenersRef = useRef(() => {});

  const copy = useCallback(async (method) => {
    const ok = await writePlainText(PROMPT);
    if (!ok) return false;
    removeGestureListenersRef.current();
    setIsCopied(true);
    setIsToastOpen(true);
    sendGtagEvent('prompt_copied', { source: 'onboard_agent_setup_page', method });
    return true;
  }, []);

  // Copy as soon as the page loads. If the browser blocks that, copy on the
  // first click or key press anywhere on the page instead.
  useEffect(() => {
    let isActive = true;

    const onGesture = () => copy('first_interaction');
    const removeListeners = () => {
      document.removeEventListener('pointerdown', onGesture);
      document.removeEventListener('keydown', onGesture);
    };
    removeGestureListenersRef.current = removeListeners;

    copy('auto').then((ok) => {
      if (!ok && isActive) {
        document.addEventListener('pointerdown', onGesture, { once: true });
        document.addEventListener('keydown', onGesture, { once: true });
      }
    });

    return () => {
      isActive = false;
      removeListeners();
    };
  }, [copy]);

  return (
    <Toast.Provider swipeDirection="down" duration={Infinity}>
      <main className="flex min-h-svh items-center justify-center bg-white px-5 py-16 dark:bg-black">
        <div
          className={cn(
            'w-full max-w-[560px] rounded-xl border border-gray-new-90 bg-gray-new-98 p-6 md:p-8',
            'dark:border-gray-new-15 dark:bg-gray-new-8'
          )}
        >
          <h1 className="text-xl leading-snug font-medium tracking-extra-tight text-black-pure dark:text-white">
            Paste this into your coding agent
          </h1>
          <p className="mt-2 text-[15px] leading-normal text-gray-new-40 dark:text-gray-new-60">
            It sets your agent up to work with Neon.
          </p>

          <pre
            id="agent-prompt"
            className={cn(
              'mt-6 rounded-lg border border-gray-new-90 bg-white p-4 font-mono text-sm leading-relaxed',
              'break-words whitespace-pre-wrap text-black-pure',
              'dark:border-gray-new-20 dark:bg-black dark:text-gray-new-94'
            )}
          >
            {PROMPT}
          </pre>

          <button
            type="button"
            className={cn(
              'mt-4 inline-flex w-full items-center justify-center gap-x-2 rounded-full px-5 py-3 md:w-auto',
              'bg-green-52 text-[15px] font-medium text-black-pure transition-colors duration-200 hover:bg-[#5ADFAE]',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-52'
            )}
            aria-describedby="agent-prompt"
            onClick={() => copy('button')}
          >
            {isCopied && <CheckIcon aria-hidden="true" />}
            {isCopied ? 'Copied' : 'Copy prompt'}
          </button>
        </div>
      </main>

      <Toast.Root
        className={cn(
          'flex items-start gap-x-3 rounded-lg border border-gray-new-90 bg-white px-4 py-3.5',
          'shadow-[rgba(14,18,22,0.35)_0px_10px_38px_-10px,_rgba(14,18,22,0.2)_0px_10px_20px_-15px]',
          'dark:border-gray-new-20 dark:bg-[#0B0C0F] dark:shadow-[0px_14px_20px_0px_rgba(0,0,0,0.50)]'
        )}
        open={isToastOpen}
        onOpenChange={setIsToastOpen}
      >
        <CheckIcon className="mt-0.5 shrink-0 text-green-52" aria-hidden="true" />
        <div className="flex-1">
          <Toast.Title className="text-[15px] leading-snug font-medium text-black-pure dark:text-white">
            Prompt copied
          </Toast.Title>
          <Toast.Description className="mt-1 text-sm leading-normal text-gray-new-40 dark:text-gray-new-70">
            You can close this window. Paste the prompt into your coding agent to get it onboarded
            on Neon.
          </Toast.Description>
        </div>
        <Toast.Close
          className="shrink-0 text-gray-new-50 transition-colors hover:text-black-pure dark:hover:text-white"
          aria-label="Dismiss"
        >
          <CloseIcon width={16} height={16} aria-hidden="true" />
        </Toast.Close>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 left-1/2 z-[2147483647] m-0 flex w-[420px] max-w-[100vw] -translate-x-1/2 list-none flex-col p-5 outline-hidden" />
    </Toast.Provider>
  );
};

export default AgentSetupPage;
