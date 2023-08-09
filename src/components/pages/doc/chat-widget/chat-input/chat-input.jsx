import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const ChatInput = forwardRef(({ onEnterPress }, ref) => {
  const onInput = (evt) => {
    if (evt.key === 'Enter') {
      onEnterPress();
    }
  };

  return (
    <input
      className="peer w-full appearance-none rounded border border-gray-new-90 px-2.5 py-2 text-base leading-normal transition-colors duration-200 placeholder:text-gray-new-80 focus:outline-none dark:border-gray-new-20 dark:bg-black dark:placeholder:text-gray-new-30"
      ref={ref}
      type="text"
      placeholder="How can I help you?"
      autoFocus
      onInput={onInput}
    />
  );
});

ChatInput.propTypes = {
  onEnterPress: PropTypes.func.isRequired,
};

export default ChatInput;
