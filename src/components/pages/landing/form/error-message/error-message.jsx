import PropTypes from 'prop-types';

const ErrorMessage = ({ text }) => (
  <span
    className="absolute left-7 right-7 top-full mt-2.5 text-sm leading-none tracking-[-0.02em] text-secondary-1 sm:left-4 sm:right-4 sm:text-xs sm:leading-tight [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:no-underline"
    dangerouslySetInnerHTML={{ __html: text }}
  />
);

ErrorMessage.propTypes = {
  text: PropTypes.string,
};

export default ErrorMessage;
