'use client';

import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';

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

const COMMAND = '⌘';
const CTRL = 'Ctrl';

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

const ChatWidget = ({ className = null }) => {
  const [commandKey, setCommandKey] = useState(COMMAND);
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // determine what hotkey icon shoould we render
  useEffect(() => {
    const { userAgent } = window.navigator;
    setCommandKey(userAgent.indexOf('Mac') !== -1 ? COMMAND : CTRL);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      setIsOpen(true);
    }
  };

  // attach event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleInputChange = (e) => setInputText(e.target.value);

  const handleExampleClick = (e) => {
    setMessages([...messages, { role: 'user', content: e.target.textContent }]);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setMessages([...messages, { role: 'user', content: inputText }]);
    setInputText('');
  };

  const fetchCompletionStream = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/open-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
        }),
      });

      // @TODO: the endpoints are inconsistent, fix it
      if (response.ok) {
        const data = await response.json();
        // Process the response data here
        const msg = JSON.parse(data)?.completion?.choices?.[0]?.message;
        if (msg) {
          setMessages([...messages, { role: msg.role, content: msg.content }]);
        }
      } else {
        // Handle non-OK response status
        throw new Error('Something went wrong. Please, reopen and try again!');
      }
    } catch (error) {
      // Handle network errors or exceptions
      console.error('Error:', error);
      setError(error.message);
    }
    setIsLoading(false);
  }, [messages]);

  // @TODO: handle onde the endpoint is determined
  // const _fetchCompletionStream = useCallback(async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch('/api/open-ai', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         messages: [...messages, { content: inputText, role: 'user' }],
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(response.statusText);
  //     }

  //     console.log('on client', response.completion);

  //     const data = response.body;
  //     if (!data) {
  //       return;
  //     }

  //     const reader = data.getReader();
  //     console.log({ reader });
  //     const decoder = new TextDecoder();
  //     let done = false;

  //     let completion = '';
  //     const msg = Array.from(messages);
  //     while (!done) {
  //       const { value, done: doneReading } = await reader.read();
  //       console.log({ value, doneReading });
  //       done = doneReading;
  //       const chunkValue = decoder.decode(value);
  //       console.log({ chunkValue });

  //       completion += chunkValue;
  //       setMessages([
  //         ...msg,
  //         {
  //           role: 'assistant',
  //           content: completion,
  //           sender: false,
  //         },
  //       ]);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   setIsLoading(false);
  // }, [inputText, messages]);

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setMessages([]);
      setError('');
    }
    setIsOpen(isOpen);
  };

  useEffect(() => {
    if (messages[messages.length - 1]?.role === 'user') {
      fetchCompletionStream();
    }
    messagesEndRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [fetchCompletionStream, messages]);

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
                {messages.length > 0 ? (
                  <m.div
                    className="mt-6 flex max-h-[400px] flex-col overflow-y-auto"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={animationVariants}
                  >
                    {messages.map((message, index) => (
                      <Message message={message} key={index} />
                    ))}
                    {isLoading && (
                      <div className="flex items-center px-5 py-2.5">
                        <span className="mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary-8/10 dark:bg-primary-1/10">
                          <ExampleIcon className="text-secondary-8 dark:text-primary-1" />
                        </span>
                        <span className="h-4 w-1 animate-pulse bg-gray-new-50" />
                      </div>
                    )}
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
                  onKeyDown={handleInputKeyDown}
                  onChange={handleInputChange}
                />
                <button
                  className="absolute bottom-[30px] right-[30px] h-5 w-5 opacity-0 transition-opacity duration-200 peer-focus:opacity-100"
                  type="submit"
                >
                  <SendIcon className="text-gray-new-20 dark:text-gray-new-90" />
                </button>
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
};

export default ChatWidget;
