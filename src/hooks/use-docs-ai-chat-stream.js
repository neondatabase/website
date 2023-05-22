import { useState, useEffect } from 'react';

const decoder = new TextDecoder();

const useDocsAIChatStream = ({ isMountedRef, signal }) => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
          message: messages[messages.length - 1],
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

  return { messages, setMessages, error, setError, isLoading };
};

export default useDocsAIChatStream;
