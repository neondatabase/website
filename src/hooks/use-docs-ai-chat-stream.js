import { useState, useEffect } from 'react';

const decoder = new TextDecoder();

const useDocsAIChatStream = ({ isMountedRef, signal }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldTryAgain, setShouldTryAgain] = useState(false);

  // @TODO: memoize back
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/open-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: messages[messages.length - 1].content,
        }),
        signal,
      });

      if (response.ok) {
        const reader = response.body.getReader();
        while (isMountedRef?.current) {
          const { done, value } = await reader.read();
          if (done) break;

          // Process the received chunk value
          const chunk = decoder.decode(value);

          setMessages((prevMessages) => {
            // this prevents leak if user has
            // bailed out early
            if (!prevMessages.length) return prevMessages;
            const { role, content } = prevMessages[prevMessages.length - 1];
            if (role === 'assistant') {
              return [
                ...prevMessages.slice(0, -1),
                {
                  role: 'assistant',
                  content: content.concat(chunk),
                },
              ];
            }
            return [
              ...prevMessages,
              {
                role: 'assistant',
                content: chunk,
              },
            ];
          });
        }
      } else if (response.status === 429) {
        setShouldTryAgain(true);

        // check if the last message is from assistant
        // if so, replace it with the error message
        setMessages((prevMessages) => {
          if (!prevMessages.length) return prevMessages;
          const { role } = prevMessages[prevMessages.length - 1];
          if (role === 'assistant') {
            return [
              ...prevMessages.slice(0, -1),
              {
                role: 'assistant',
                content: 'Sorry, your query has been rate limited',
              },
            ];
          }
          return [
            ...prevMessages,
            {
              role: 'assistant',
              content: 'Sorry, your query has been rate limited',
            },
          ];
        });
        // set input text to the last message, that user sent
        setInputText(messages[messages.length - 1].content);
      } else {
        throw Error('Something went wrong. Please try again!');
      }
    } catch (error) {
      console.error(error);
      if (error.name === 'AbortError') return;
      setError(error?.message || error || 'Something went wrong. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (messages.length && messages[messages.length - 1].role === 'user') {
      fetchData();
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: '' }]);
    }
  });

  return {
    inputText,
    setInputText,
    messages,
    setMessages,
    error,
    setError,
    isLoading,
    shouldTryAgain,
    setShouldTryAgain,
  };
};

export default useDocsAIChatStream;
