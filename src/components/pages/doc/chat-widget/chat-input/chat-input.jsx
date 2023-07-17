import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

const ChatInput = ({ externalValue = null, onSubmit, valueGetter }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    setValue(externalValue);
    inputRef.current.focus();
  }, [externalValue]);

  useEffect(() => {
    valueGetter(() => inputRef.current.value);
  }, [valueGetter]);

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit(e);
    }
  };

  return (
    <input
      className="peer w-full appearance-none rounded border border-gray-new-90 px-2.5 py-2 text-base leading-normal transition-colors duration-200 placeholder:text-gray-new-80 focus:outline-none dark:border-gray-new-20 dark:bg-black dark:placeholder:text-gray-new-30"
      value={value}
      ref={inputRef}
      type="text"
      placeholder="How can I help you?"
      autoFocus
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleInputKeyDown}
    />
  );
};

ChatInput.propTypes = {
  externalValue: PropTypes.string,
  onSubmit: PropTypes.func,
  valueGetter: PropTypes.func,
};

export default ChatInput;
