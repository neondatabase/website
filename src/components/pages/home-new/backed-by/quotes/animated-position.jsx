import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import useTextStaggeredAnimation from 'hooks/use-text-staggered-animation';

const DURATION = 0.3;
const START_DELAY = 1.45;

const AnimatedPosition = ({ author, position }) => {
  const textString = [author, position].join('');

  const { groupIndices, staggeredDelays } = useTextStaggeredAnimation({
    duration: DURATION,
    textString,
  });

  let currentIndex = 0;

  const result = [author, position].map((part, index) => {
    if (index === 0) {
      return (
        <span className="block font-medium" key={`author-part-${currentIndex}`}>
          {part.split('').map((char) => {
            const charIndex = currentIndex;
            currentIndex += 1;
            return (
              <m.span
                key={charIndex}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0,
                  delay: START_DELAY + staggeredDelays[groupIndices[charIndex]],
                }}
              >
                {char}
              </m.span>
            );
          })}
        </span>
      );
    }

    return part.split('').map((char) => {
      const charIndex = currentIndex;
      currentIndex += 1;

      return (
        <m.span
          key={charIndex}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0,
            delay: START_DELAY + staggeredDelays[groupIndices[charIndex]],
          }}
        >
          {char}
        </m.span>
      );
    });
  });

  return result;
};

AnimatedPosition.propTypes = {
  author: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
};

export default AnimatedPosition;
