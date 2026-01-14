import { m } from 'framer-motion';
import PropTypes from 'prop-types';

const CharAnimation = ({ char, delay }) => (
  <m.span
    aria-hidden="true"
    initial={{ opacity: 0 }}
    animate={{
      opacity: 1,
    }}
    transition={{
      duration: 0,
      delay,
    }}
  >
    {char}
  </m.span>
);

CharAnimation.propTypes = {
  char: PropTypes.string.isRequired,
  delay: PropTypes.number.isRequired,
};

export default CharAnimation;
