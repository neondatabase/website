import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import useTextStaggeredAnimation from 'hooks/use-text-staggered-animation';

const DURATION = 1.1;
const START_DELAY = 0.2;

const AnimatedText = ({ text, highlight }) => {
  const textString = text.join('');

  const { groupIndices, staggeredDelays } = useTextStaggeredAnimation({
    duration: DURATION,
    textString,
  });

  const highlightedPartIndex = text.findIndex((part) => part === highlight);

  let currentIndex = 0;

  const result = text.map((part, index) => {
    if (index === highlightedPartIndex) {
      return (
        <m.span
          className="-mx-1 bg-[linear-gradient(90deg,rgba(57,165,125,0.6)_50%,transparent_50%)] bg-[size:200%_100%] bg-no-repeat px-1"
          initial={{ backgroundPositionX: '100%', backgroundPositionY: '0' }}
          animate={{
            backgroundPositionX: '0%',
            transition: {
              duration: 0.6,
              delay: START_DELAY + staggeredDelays[groupIndices[currentIndex]] + 0.2,
              ease: [0.17, 0.17, 0.1, 1],
            },
          }}
          exit={{
            backgroundPositionX: '100%',
            transition: {
              duration: 0.3,
              ease: [0.17, 0.17, 0.83, 0.83],
            },
          }}
        >
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
        </m.span>
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

AnimatedText.propTypes = {
  text: PropTypes.arrayOf(PropTypes.string).isRequired,
  highlight: PropTypes.string.isRequired,
};

export default AnimatedText;
