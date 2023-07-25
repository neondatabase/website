import PropTypes from 'prop-types';
import { useEffect } from 'react';

const ChatInput = ({ defaultValue = null, onSubmit, inputRef }) => {
  useEffect(() => {
    if (defaultValue) {
      inputRef.current.value = defaultValue;
      inputRef.current.focus();
    }
  }, [defaultValue, inputRef]);

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit(e);
    }
  };

  return (
    <input
      className="peer w-full appearance-none rounded border border-gray-new-90 px-2.5 py-2 text-base leading-normal transition-colors duration-200 placeholder:text-gray-new-80 focus:outline-none dark:border-gray-new-20 dark:bg-black dark:placeholder:text-gray-new-30"
      defaultValue={inputRef.current?.value}
      ref={inputRef}
      type="text"
      placeholder="How can I help you?"
      autoFocus
      onKeyDown={handleInputKeyDown}
    />
  );
};

ChatInput.propTypes = {
  defaultValue: PropTypes.string,
  onSubmit: PropTypes.func,
  inputRef: PropTypes.object,
};

export default ChatInput;
