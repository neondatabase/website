import clsx from 'clsx';
import PropTypes from 'prop-types';

import ExampleIcon from '../images/example.inline.svg';
import UserIcon from '../images/user.inline.svg';

const Message = ({ message }) => (
  <div
    className={clsx(
      'flex items-start px-5 py-2.5',
      message.role === 'user' ? ' bg-gray-new-15/40 text-gray-new-60' : 'text-white'
    )}
  >
    <span
      className={clsx(
        'mr-3 flex h-7 w-7 items-center justify-center rounded-full',
        message.role === 'user' ? 'bg-gray-new-15' : 'bg-primary-1/10'
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
