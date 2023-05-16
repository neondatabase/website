import { useState, useEffect } from 'react';

const useDocsAIChatStream = (isMounted) => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const response = await fetch('/api/open-ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messages[messages.length - 1],
          }),
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

            // Update the messages state with the received data
            setMessages((prevMessages) => {
              const lastMsg = prevMessages[prevMessages.length - 1];
              if (lastMsg.role === 'assistant') {
                return [
                  ...prevMessages.slice(0, -1),
                  {
                    role: 'assistant',
                    content: (lastMsg.content += parsedChunk),
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
          }
        } else {
          throw Error('Something went wrong. Please try again!');
        }
      } catch (error) {
        console.error(error);
        setError(error?.message || error || 'Something went wrong. Please try again!');
      }
      setIsLoading(false);
    };
    if (messages.length && messages[messages.length - 1].role === 'user') {
      fetchData();
    }
  }, [messages, isMounted]);

  return { messages, setMessages, error, setError, isLoading };
};

export default useDocsAIChatStream;
