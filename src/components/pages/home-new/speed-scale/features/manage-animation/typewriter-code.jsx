import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

const TypewriterCode = ({ targetText, isActive, duration, className }) => {
  // Split by words but preserve line breaks
  const words = useMemo(() => targetText.split(/(\s+)/), [targetText]);

  const visibleWords = words.filter((word) => word.trim().length > 0);
  const totalWords = visibleWords.length;

  // Calculate delay per word based on duration
  const delayPerWord = duration / totalWords;

  return (
    <span className={className} style={{ whiteSpace: 'pre-wrap' }}>
      {words.map((word, index) => {
        // If it's whitespace render it instantly
        if (word.trim().length === 0) {
          return <span key={index}>{word}</span>;
        }

        return (
          <m.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{
              opacity: isActive ? 1 : 0,
            }}
            transition={{
              duration: 0.1,
              delay: isActive ? index * delayPerWord : 0,
            }}
          >
            {word}
          </m.span>
        );
      })}
    </span>
  );
};

TypewriterCode.propTypes = {
  targetText: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  duration: PropTypes.number.isRequired,
  ease: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.number)]).isRequired,
  className: PropTypes.string,
};

TypewriterCode.defaultProps = {
  className: '',
};

export default TypewriterCode;
