import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';

const ChatInput = forwardRef(({ defaultValue = null, onEnterPress }, ref) => {
  useEffect(() => {
    if (defaultValue) {
      ref.current.value = defaultValue;
      ref.current.focus();
    }
  }, [defaultValue, ref]);

  const onInput = (evt) => {
    if (evt.key === 'Enter') {
      onEnterPress();
    }
  };
  return (
    <input
      className="peer w-full appearance-none rounded border border-gray-new-90 px-2.5 py-2 text-base leading-normal transition-colors duration-200 placeholder:text-gray-new-80 focus:outline-none dark:border-gray-new-20 dark:bg-black dark:placeholder:text-gray-new-30"
      defaultValue={ref.current?.value}
      ref={ref}
      type="text"
      placeholder="How can I help you?"
      autoFocus
      onInput={onInput}
    />
  );
});

ChatInput.propTypes = {
  defaultValue: PropTypes.string,
  onEnterPress: PropTypes.func.isRequired,
};

export default ChatInput;
