import clsx from 'clsx';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';

const CHAR_DELAY = 0.01;

const AnimatedText = ({
  text,
  startDelay = 0,
  isHighlighted,
  highlightStart,
  highlightEnd,
  skipAnimation = false,
  fadeDelay = 0.3,
}) =>
  text.split('').map((char, index) => {
    const isHighlightedChar = isHighlighted && index >= highlightStart && index < highlightEnd;
    const isHighlightStart = isHighlightedChar && index === highlightStart;
    const isHighlightEnd = isHighlightedChar && index === highlightEnd - 1;

    return (
      <m.span
        key={index}
        className={
          isHighlightedChar &&
          clsx(
            'relative before:absolute before:inset-0 before:-z-10 before:bg-[#39A57D]/60',
            isHighlightStart && 'before:-left-1',
            isHighlightEnd && 'before:-right-1'
          )
        }
        initial={{ opacity: skipAnimation ? 1 : 0 }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0,
          delay: skipAnimation ? 0 : fadeDelay + (startDelay + index) * CHAR_DELAY,
        }}
      >
        {char}
      </m.span>
    );
  });

AnimatedText.propTypes = {
  text: PropTypes.string.isRequired,
  startDelay: PropTypes.number,
  isHighlighted: PropTypes.bool,
  highlightStart: PropTypes.number,
  highlightEnd: PropTypes.number,
  skipAnimation: PropTypes.bool,
  fadeDelay: PropTypes.number,
};

export default AnimatedText;
