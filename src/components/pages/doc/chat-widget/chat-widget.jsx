'use client';

import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { ChatContext } from 'app/chat-provider';
import useAbortController from 'hooks/use-abort-controller';
import useControlKey from 'hooks/use-control-key';
import useDocsAIChatStream from 'hooks/use-docs-ai-chat-stream';

import AttentionIcon from './images/attention.inline.svg';
import CloseIcon from './images/close.inline.svg';
import ExampleIcon from './images/example.inline.svg';
import ExperimentalIcon from './images/experimental.inline.svg';
import SendIcon from './images/send.inline.svg';
import Message from './message';

const items = [
  'What’s Neon?',
  'How to sign up for Neon?',
  'How to create a project?',
  'How to get started with the Neon API?',
];

const animationVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

const handleKeyDown = (cb) => (e) => {
  if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
    cb(true);
  }
};

const ChatWidget = () => {
  // state
  const [inputText, setInputText] = useState('');
  // context
  const { isOpen, setIsOpen } = useContext(ChatContext);
  // aux refs
  const messagesEndRef = useRef(null);
  const isMountedRef = useRef(false);
  // hooks
  const { getSignal, resetAbortController } = useAbortController();
  const { messages, setMessages, isLoading, error, setError } = useDocsAIChatStream({
    isMountedRef,
    signal: getSignal(),
  });

  // handlers
  const handleInputChange = (e) => setInputText(e.target.value);

  const handleExampleClick = (e) => {
    setMessages([{ role: 'user', content: e.target.textContent }]);
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
      // do not let user submit another
      // query while the previous one is getting processed
      if (!isLoading) {
        setMessages((prevMessages) => prevMessages.concat([{ role: 'user', content: inputText }]));
        setInputText('');
      }
    },
    [isLoading, inputText, setMessages]
  );

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

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
  };

  // effects
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown(setIsOpen));
    return () => {
      window.removeEventListener('keydown', handleKeyDown(setIsOpen));
    };
  }, [setIsOpen]);

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
          <div className="relative flex flex-col rounded-[10px] border border-gray-new-90 bg-gray-new-98 pt-4 data-[state=open]:animate-dialog-show data-[state=closed]:animate-dialog-hide dark:border-gray-new-20 dark:bg-gray-new-8 dark:text-white dark:shadow-[4px_4px_10px_rgba(0,0,0,0.5)] lg:h-full lg:rounded-none">
            <Dialog.Title className="text-20 flex items-center space-x-5 px-5 leading-tight">
              <span>Ask Neon AI a question</span>
              <div className="flex items-center rounded-[24px] border border-gray-new-94 bg-[rgba(239,239,240,0.4)] py-1.5 px-3 text-gray-new-30 dark:border-gray-new-15 dark:bg-gray-new-15/40 dark:text-gray-new-80">
                <ExperimentalIcon className="mr-1.5 h-3.5 w-3.5" />
                <span className="text-sm leading-none">Experimental</span>
              </div>
            </Dialog.Title>

            <LazyMotion features={domAnimation}>
              <AnimatePresence initial={false} mode="wait">
                {messages.length ? (
                  <m.div
                    className="mt-6 flex max-h-[calc(100vh_-_62px)] flex-col overflow-y-auto"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={animationVariants}
                  >
                    {messages.map((message, index) => (
                      <Message {...message} key={index} />
                    ))}
                    <div ref={messagesEndRef} />
                  </m.div>
                ) : (
                  <m.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={animationVariants}
                  >
                    <Dialog.Description className="mt-7 px-5 leading-none text-gray-new-60 dark:text-gray-new-50">
                      Examples
                    </Dialog.Description>
                    <ul className="mt-3 px-2.5">
                      {items.map((title, index) => (
                        <li className="flex" key={index}>
                          <button
                            className="flex w-full items-center justify-start rounded py-2 px-2.5 transition-colors duration-200 hover:bg-[rgba(36,38,40,0.06)] focus:bg-[rgba(36,38,40,0.06)] focus:outline-none dark:hover:bg-gray-new-15/60 dark:focus:bg-gray-new-15/60"
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
                  </m.div>
                )}
              </AnimatePresence>
            </LazyMotion>
            {error ? (
              <div className="flex px-5 pt-2.5 pb-5">
                <span className="mr-3 flex h-7 w-7 items-center justify-center rounded-full bg-secondary-1/10">
                  <AttentionIcon className="h-auto w-3.5" />
                </span>
                <span>
                  <span className="text-secondary-1">Attention:</span> {error}
                </span>
              </div>
            ) : (
              <form
                className="group relative mt-12 w-full px-5 pb-5 lg:mt-auto"
                onSubmit={handleSubmit}
              >
                <input
                  className="peer w-full appearance-none rounded border border-gray-new-90 py-2 px-2.5 text-base leading-normal transition-colors duration-200 placeholder:text-gray-new-80 focus:outline-none dark:border-gray-new-20 dark:bg-black dark:placeholder:text-gray-new-30"
                  type="text"
                  placeholder="How can I help you?"
                  value={inputText}
                  autoFocus
                  onKeyDown={handleInputKeyDown}
                  onChange={handleInputChange}
                />
                {!isLoading && (
                  <button
                    className="absolute bottom-[30px] right-[30px] h-5 w-5 opacity-0 transition-opacity duration-200 peer-focus:opacity-100"
                    type="submit"
                  >
                    <SendIcon className="text-gray-new-20 dark:text-gray-new-90" />
                  </button>
                )}
              </form>
            )}

            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-5 flex h-6 w-6 items-center justify-center"
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
  className: PropTypes.string,
  abortControllerSignal: PropTypes.object,
  abortStream: PropTypes.func,
  isChatWidgetOpen: PropTypes.bool,
  setIsChatWidgetOpen: PropTypes.func,
};

// eslint-disable-next-line react/prop-types
const ChatWidgetTrigger = ({ className }) => {
  const { setIsOpen } = useContext(ChatContext);
  const [commandKey] = useControlKey();

  const onClickHandler = () => {
    setIsOpen(true);
  };

  return (
    <button
      className={clsx(
        'chat-widget flex flex-col text-sm focus:outline-none xl:flex-row xl:items-center xl:space-x-1.5',
        className
      )}
      type="button"
      aria-label="Open Neon Docs AI"
      onClick={onClickHandler}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#00CC88] dark:bg-[rgba(0,229,153,0.1)] xl:h-6 xl:w-6 xl:shrink-0 xl:rounded">
        <ExampleIcon className="h-[26px] w-[26px] text-white dark:text-green-45 xl:h-4 xl:w-4" />
      </span>
      <div className="mt-2.5 flex min-h-[22px] w-full items-center justify-between xl:mt-0 lg:w-auto">
        <h3 className="font-semibold leading-none xl:text-sm xl:font-normal xl:text-gray-3 dark:xl:text-gray-7">
          <span className="lg:hidden">Neon Docs AI</span>
          <span className="hidden lg:inline" aria-hidden>
            Try Neon Docs AI instead
          </span>
        </h3>
        {commandKey && (
          <span className="text-gray-20 dark:text-gray-90 rounded-sm bg-gray-new-94 px-1.5 py-1 leading-none dark:bg-gray-new-15 xl:hidden">
            {commandKey} + K
          </span>
        )}
      </div>
      <p className="mt-1.5 text-left leading-tight text-gray-3 dark:text-gray-7 xl:hidden">
        We brought ChatGPT straight to the docs
      </p>
      <span className="mt-1.5 leading-tight text-secondary-8 dark:text-primary-1 xl:hidden">
        Ask a question
      </span>
    </button>
  );
};

export default ChatWidget;
export { ChatWidgetTrigger };
