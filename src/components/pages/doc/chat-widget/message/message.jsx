import clsx from 'clsx';
import PropTypes from 'prop-types';

import ExampleIcon from '../images/example.inline.svg';
import UserIcon from '../images/user.inline.svg';

const Message = ({ message }) => (
  <div
    className={clsx(
      'flex items-start px-5 py-2.5',
      message.role === 'user'
        ? ' bg-[rgba(36,38,40,0.04)] text-gray-new-50 dark:bg-gray-new-15/40 dark:text-gray-new-60'
        : 'text-black dark:text-white'
    )}
  >
    <span
      className={clsx(
        'mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
        message.role === 'user'
          ? 'bg-gray-new-90 text-gray-new-50 dark:bg-gray-new-15 dark:text-gray-new-60'
          : 'bg-secondary-8/10 text-secondary-8 dark:bg-primary-1/10 dark:text-primary-1'
      )}
    >
      {message.role === 'user' ? <UserIcon /> : <ExampleIcon />}
    </span>
    <div className="pt-0.5">{message.content}</div>
  </div>
);

Message.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.string,
    content: PropTypes.string,
  }),
};

export default Message;
