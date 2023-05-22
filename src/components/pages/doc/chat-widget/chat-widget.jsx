'use client';

import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';

import useControlKey from 'hooks/use-control-key';
import useDocsAIChatStream from 'hooks/use-docs-ai-chat-stream';

import AIIcon from './images/ai.inline.svg';
import AttentionIcon from './images/attention.inline.svg';
import CloseIcon from './images/close.inline.svg';
import ExampleIcon from './images/example.inline.svg';
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

const ChatWidget = ({ className = null, abortControllerSignal, abortStream }) => {
  // state
  const isMountedRef = useRef(false);
  const [inputText, setInputText] = useState('');
  // aux flags
  const [isOpen, setIsOpen] = useState(false);
  // aux ref
  const messagesEndRef = useRef(null);

  const [commandKey] = useControlKey();
  const { messages, setMessages, isLoading, error, setError } = useDocsAIChatStream({
    isMountedRef,
    signal: abortControllerSignal,
  });

  // handlers
  const handleInputChange = (e) => setInputText(e.target.value);

  const handleExampleClick = (e) => {
    setMessages([{ role: 'user', content: e.target.textContent }]);
  };

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

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      // reset the state completely
      isMountedRef.current = false;
      abortStream();
      setError(null);
      setMessages([]);
    } else {
      isMountedRef.current = true;
    }
    setIsOpen(isOpen);
  };

  // effects
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown(setIsOpen));
    return () => {
      window.removeEventListener('keydown', handleKeyDown(setIsOpen));
    };
  }, []);

  useEffect(() => {
    // make sure chat is always scrolled to the bottom
    messagesEndRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [messages]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          className={clsx('chat-widget flex flex-col text-sm focus:outline-none', className)}
          type="button"
          aria-label="Open Neon Docs AI"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-gray-new-94 dark:bg-gray-new-8">
            <AIIcon className="h-[26px] w-[26px] text-secondary-8 dark:text-primary-1" />
          </span>
          <div className="mt-2.5 flex min-h-[22px] w-full items-center justify-between">
            <h3 className="font-semibold leading-none">Neon Docs AI</h3>
            {commandKey && (
              <span className="text-gray-20 dark:text-gray-90 rounded-sm bg-gray-new-94 px-1.5 py-1 leading-none dark:bg-gray-new-15">
                {commandKey} + K
              </span>
            )}
          </div>
          <p className="mt-1.5 text-left leading-tight text-gray-3 dark:text-gray-7">
            We brought ChatGPT straight to the docs
          </p>
          <span className="mt-1.5 leading-tight text-secondary-8 dark:text-primary-1">
            Ask a question
          </span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[rgba(12,13,13,0.2)] data-[state=closed]:animate-fade-out-overlay data-[state=open]:animate-fade-in-overlay dark:bg-black/80" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 mx-auto max-h-[85vh] w-full max-w-[756px] -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex flex-col rounded-[10px] border border-gray-new-90 bg-gray-new-98 pt-4 data-[state=open]:animate-dialog-show data-[state=closed]:animate-dialog-hide dark:border-gray-new-20 dark:bg-gray-new-8 dark:text-white dark:shadow-[4px_4px_10px_rgba(0,0,0,0.5)]">
            <Dialog.Title className="text-20 px-5 leading-tight">
              Ask Neon AI a question
            </Dialog.Title>

            <LazyMotion features={domAnimation}>
              <AnimatePresence initial={false} mode="wait">
                {messages.length ? (
                  <m.div
                    className="mt-6 flex max-h-[400px] flex-col overflow-y-auto"
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
                            <ExampleIcon className="mr-3 h-4 w-4 text-secondary-8 dark:text-primary-1" />
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
              <form className="group relative mt-12 w-full px-5 pb-5" onSubmit={handleSubmit}>
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
};

export default ChatWidget;
