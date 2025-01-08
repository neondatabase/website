import PropTypes from 'prop-types';

const NumberedSteps = ({ children }) => (
  <ol
    className="!mt-0 inline-flex w-full flex-col !pl-0"
    style={{
      counterReset: 'section',
    }}
  >
    {children}
  </ol>
);

export default NumberedSteps;

NumberedSteps.propTypes = {
  children: PropTypes.node.isRequired,
};
