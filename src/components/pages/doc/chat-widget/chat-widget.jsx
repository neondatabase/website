'use client';

import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { ChatContext } from 'app/chat-provider';
import Button from 'components/shared/button/button';
import useAbortController from 'hooks/use-abort-controller';
import useDocsAIChatStream from 'hooks/use-docs-ai-chat-stream';
import sendGtagEvent from 'utils/send-gtag-event';

import ChatInput from './chat-input';
import AttentionIcon from './images/attention.inline.svg';
import CheckIcon from './images/check.inline.svg';
import CloseIcon from './images/close.inline.svg';
import ExampleIcon from './images/example.inline.svg';
import ExperimentalIcon from './images/experimental.inline.svg';
import ReloadIcon from './images/reload.inline.svg';
import SendIcon from './images/send.inline.svg';
import SparksIcon from './images/sparks.inline.svg';
import StopIcon from './images/stop.inline.svg';
import Message from './message';

const items = [
  'What’s Neon?',
  'How do I sign up for Neon?',
  'How to create a project?',
  'How to get started with the Neon API?',
];

const ChatWidget = () => {
  // context
  const { isOpen, setIsOpen } = useContext(ChatContext);
  // aux refs
  const messagesEndRef = useRef(null);
  const isMountedRef = useRef(false);
  const getValueRef = useRef(null);
  // hooks
  const [isStopped, setIsStopped] = useState(false);
  const { getSignal, resetAbortController } = useAbortController();

  const {
    inputText,
    setInputText,
    messages,
    setMessages,
    isLoading,
    error,
    setError,
    shouldTryAgain,
    setShouldTryAgain,
    isAnswerGenerating,
  } = useDocsAIChatStream({
    isMountedRef,
    signal: getSignal(),
  });

  const handleExampleClick = (e) => {
    setInputText(e.target.textContent);
    sendGtagEvent('chat_widget_example_click', {
      value: e.target.textContent,
    });
  };

  useEffect(() => {
    if (isOpen) {
      isMountedRef.current = true;
    } else {
      isMountedRef.current = false;
    }
    return () => (isMountedRef.current = false);
  }, [isOpen]);

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();
      setIsStopped(false);
      // do not let user submit another
      // query while the previous one is getting processed
      const inputText = getValueRef.current();

      if (!isLoading && inputText) {
        setMessages((prevMessages) => prevMessages.concat([{ role: 'user', content: inputText }]));
        setInputText('');
        sendGtagEvent('chat_widget_submit', {
          value: inputText,
        });
      }

      if (shouldTryAgain) {
        setShouldTryAgain(false);
      }
    },
    [isLoading, setMessages, setShouldTryAgain, shouldTryAgain, setInputText]
  );

  // @NOTE:
  // fires only once on close!
  // to fire twice we need to add trigger
  // section to Dialog again
  const handleOpenChange = () => {
    // reset the state completely
    resetAbortController();
    setError(null);
    setMessages([]);
    setIsOpen(false);
    setShouldTryAgain(false);
    setIsStopped(false);
  };

  const stopGeneratingAnswers = () => {
    resetAbortController();
    setIsStopped(true);
    const lastMessage = messages.findLast((message) => message.role === 'user');
    sendGtagEvent('chat_widget_stop_generating_answer', {
      value: lastMessage?.content,
    });
  };

  useEffect(() => {
    // make sure chat is always scrolled to the bottom
    messagesEndRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [messages]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[150] bg-[rgba(12,13,13,0.2)] data-[state=closed]:animate-fade-out-overlay data-[state=open]:animate-fade-in-overlay dark:bg-black/80" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[150] mx-auto max-h-[85vh] w-full max-w-[756px] -translate-x-1/2 -translate-y-1/2 lg:h-full lg:max-h-full lg:max-w-full">
          <div className="relative flex h-full max-h-[85vh] flex-col rounded-[10px] border border-gray-new-90 bg-gray-new-98 pt-4 data-[state=closed]:animate-dialog-hide data-[state=open]:animate-dialog-show dark:border-gray-new-20 dark:bg-gray-new-8 dark:text-white dark:shadow-[4px_4px_10px_rgba(0,0,0,0.5)] lg:h-full lg:max-h-screen lg:rounded-none">
            <Dialog.Title className="text-20 flex items-center space-x-5 px-5 leading-tight xs:space-x-4">
              <span>Ask Neon AI a question</span>
              <div className="flex items-center rounded-[24px] border border-gray-new-94 bg-[rgba(239,239,240,0.4)] px-3 py-1.5 text-gray-new-30 dark:border-gray-new-15 dark:bg-gray-new-15/40 dark:text-gray-new-80 xs:px-2">
                <ExperimentalIcon className="mr-1.5 h-3.5 w-3.5 xs:h-3 xs:w-3" />
                <span className="text-sm leading-none">Experimental</span>
              </div>
            </Dialog.Title>

            {messages.length > 0 ? (
              <div className="mt-6 flex h-full max-h-[calc(100vh_-_62px)] flex-col overflow-y-auto pb-12">
                {messages.map((message, index) => (
                  <Message {...message} key={index} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="pb-12">
                <Dialog.Description className="mt-7 px-5 leading-none text-gray-new-60 dark:text-gray-new-50">
                  Examples
                </Dialog.Description>
                <ul className="mt-3 px-2.5">
                  {items.map((title, index) => (
                    <li className="flex" key={index}>
                      <button
                        className="flex w-full items-center justify-start rounded px-2.5 py-2 transition-colors duration-200 hover:bg-[rgba(36,38,40,0.06)] focus:bg-[rgba(36,38,40,0.06)] focus:outline-none dark:hover:bg-gray-new-15/60 dark:focus:bg-gray-new-15/60"
                        type="button"
                        onClick={handleExampleClick}
                      >
                        <span className="mr-3 flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(0,204,136,0.1)]">
                          <ExampleIcon className="h-4 w-4 text-primary-1" />
                        </span>
                        <span>{title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {error ? (
              <div className="flex items-center px-5 pb-5 pt-2.5">
                <span className="mr-3 flex h-7 w-7 items-center justify-center rounded-full bg-secondary-1/10">
                  <AttentionIcon className="h-auto w-3.5" />
                </span>
                <span>
                  <span className="text-secondary-1">Attention:</span> {error}
                </span>
              </div>
            ) : (
              <form className="group relative w-full px-5 pb-5 lg:mt-auto" onSubmit={handleSubmit}>
                <ChatInput
                  externalValue={inputText}
                  valueGetter={(fn) => {
                    getValueRef.current = fn;
                  }}
                  onSubmit={handleSubmit}
                />
                <div className="mt-2.5 flex flex-col space-y-1 text-center text-xs font-light leading-dense text-gray-new-30 dark:text-gray-new-80">
                  <span>Neon Docs AI has a cap of 1 message every 5 seconds.</span>
                  <span>
                    Neon Docs AI may produce inaccurate information. Evaluate answers carefully
                    before implementing.
                  </span>
                </div>
                {!isLoading &&
                  (!shouldTryAgain ? (
                    <button
                      className="absolute right-5 top-0 flex h-[42px] w-[42px] items-center justify-center opacity-0 transition-opacity duration-200 peer-focus:opacity-100"
                      type="submit"
                    >
                      <SendIcon className="h-5 w-5 text-gray-new-20 dark:text-gray-new-90" />
                    </button>
                  ) : (
                    <Button
                      className="absolute -top-8 left-1/2 flex -translate-x-1/2 items-center justify-center gap-x-1.5 border border-gray-new-94 bg-gray-new-94/40 font-normal normal-case text-gray-new-30 hover:bg-gray-new-94/80 dark:border-gray-new-15 dark:bg-gray-new-15/40 dark:text-gray-new-80 dark:hover:bg-gray-new-15/80"
                      size="xxs"
                      type="submit"
                    >
                      <ReloadIcon className="h-3 w-3 shrink-0" />
                      <span>Try again</span>
                    </Button>
                  ))}
                {isAnswerGenerating && (
                  <Button
                    className="absolute -top-8 left-1/2 flex -translate-x-1/2 items-center justify-center gap-x-1.5 border border-gray-new-94 bg-gray-new-94/40 font-normal normal-case text-gray-new-30 hover:bg-gray-new-94/80 dark:border-gray-new-15 dark:bg-gray-new-15/40 dark:text-gray-new-80 dark:hover:bg-gray-new-15/80"
                    size="xxs"
                    type="submit"
                    onClick={stopGeneratingAnswers}
                  >
                    <StopIcon className="h-3 w-3 shrink-0" />
                    <span>Stop generating</span>
                  </Button>
                )}
                {isStopped && (
                  <span className="absolute -top-8 left-1/2 flex w-[142px] -translate-x-1/2 items-center justify-center gap-x-1.5 rounded-full border border-gray-new-94 bg-gray-new-94/40 py-1.5 text-xs font-normal normal-case leading-none text-gray-new-30 dark:border-gray-new-15 dark:bg-gray-new-15/40 dark:text-gray-new-80">
                    <CheckIcon className="h-3 w-3" />
                    <span>Stopped</span>
                  </span>
                )}
              </form>
            )}

            <Dialog.Close asChild>
              <button
                className="absolute right-5 top-4 flex h-6 w-6 items-center justify-center"
                aria-label="Close"
                type="button"
              >
                <CloseIcon className="h-4 w-4 text-gray-new-60 dark:text-gray-new-50" />
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

ChatWidget.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  abortControllerSignal: PropTypes.object,
  abortStream: PropTypes.func,
  isChatWidgetOpen: PropTypes.bool,
  setIsChatWidgetOpen: PropTypes.func,
};

// eslint-disable-next-line react/prop-types
const ChatWidgetTrigger = ({ className, isSidebar }) => {
  const { setIsOpen } = useContext(ChatContext);

  const onClickHandler = () => {
    setIsOpen(true);
    sendGtagEvent('chat_widget_open');
  };

  return (
    <button
      className={clsx(
        'chat-widget group flex text-sm focus:outline-none',
        isSidebar
          ? 'items-center space-x-3'
          : 'flex-col xl:flex-row xl:items-center xl:space-x-1.5',
        className
      )}
      type="button"
      aria-label="Open Neon Docs AI"
      onClick={onClickHandler}
    >
      {isSidebar ? (
        <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[linear-gradient(180deg,#EFEFF0_100%,#E4E5E7_100%)] before:absolute before:inset-px before:rounded-[3px] before:bg-[linear-gradient(180deg,#FFF_100%,#FAFAFA_100%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_31.25%,rgba(255,255,255,0.05)_100%)] dark:before:bg-[linear-gradient(180deg,#242628_31.25%,#1D1E20_100%)]">
          <SparksIcon className="relative z-10 h-3 w-3 text-gray-new-30 dark:text-gray-new-80" />
        </span>
      ) : (
        <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#00CC88] dark:bg-[rgba(0,229,153,0.1)] xl:h-6 xl:w-6 xl:shrink-0 xl:rounded">
          <ExampleIcon className="h-[26px] w-[26px] text-white dark:text-green-45 xl:h-4 xl:w-4" />
        </span>
      )}
      <div
        className={clsx('flex min-h-[22px] w-full items-center justify-between xl:mt-0 lg:w-auto', {
          'mt-2.5': !isSidebar,
        })}
      >
        <h3
          className={clsx(
            'leading-none xl:text-sm',
            isSidebar
              ? 'text-sm font-medium transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-green-45'
              : 'font-semibold'
          )}
        >
          <span
            className={clsx({
              'lg:hidden': !isSidebar,
            })}
          >
            Neon Docs AI
          </span>
          <span
            className={clsx('hidden text-gray-new-20 dark:text-gray-new-90 ', {
              'lg:inline': !isSidebar,
            })}
            aria-hidden
          >
            Try Neon Docs AI instead
          </span>
        </h3>
      </div>
    </button>
  );
};

export default ChatWidget;
export { ChatWidgetTrigger };
