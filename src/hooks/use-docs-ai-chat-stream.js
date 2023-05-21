import { useState, useEffect } from 'react';
// import { flushSync } from 'react-dom';

const useDocsAIChatStream = ({ isMounted, signal }) => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
        while (isMounted) {
          const { done, value } = await reader.read();
          if (done) break;

          // Process the received chunk value
          const chunk = new TextDecoder().decode(value);
          let parsedChunk;
          try {
            parsedChunk = JSON.parse(chunk);
          } catch (e) {
            parsedChunk = chunk;
          }
          // eslint-disable-next-line no-console
          console.log('in the loop', parsedChunk);
          // Update the messages state with the received data
          // flushSync(() => {
          setMessages((prevMessages) => {
            // eslint-disable-next-line no-console
            console.log('inside updater', parsedChunk);

            // this prevents leak if user has
            // bailed out early
            if (!prevMessages.length) return prevMessages;
            const { role, content } = prevMessages[prevMessages.length - 1];
            if (role === 'assistant') {
              return [
                ...prevMessages.slice(0, -1),
                {
                  role: 'assistant',
                  content: content.concat(parsedChunk),
                },
              ];
            }
            return [
              ...prevMessages,
              {
                role: 'assistant',
                content: parsedChunk,
              },
            ];
          });
          // });
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
  //   [isMounted, signal]
  // );

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
