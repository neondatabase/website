import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import useTextStaggeredAnimation from 'hooks/use-text-staggered-animation';

import CharAnimation from './char-animation';

const DURATION = 1.1;
const START_DELAY = 0.2;

const AnimatedText = ({ text, highlight }) => {
  const textString = text.join('');

  const { groupIndices, staggeredDelays } = useTextStaggeredAnimation({
    duration: DURATION,
    textString,
  });

  const highlightedPartIndex = text.findIndex((part) => part === highlight);

  // Calculate character offset for each part using prefix sum
  const partOffsets = [];
  let runningOffset = 0;
  for (let i = 0; i < text.length; i += 1) {
    partOffsets.push(runningOffset);
    runningOffset += text[i].length;
  }

  const result = text.map((part, index) => {
    const firstCharIndex = partOffsets[index];

    if (index === highlightedPartIndex) {
      return (
        <m.span
          className="-mx-1 bg-[linear-gradient(90deg,rgba(57,165,125,0.6)_50%,transparent_50%)] bg-[size:200%_100%] bg-no-repeat px-1"
          key={`highlighted-part-${index}`}
          initial={{ backgroundPositionX: '100%', backgroundPositionY: '0' }}
          animate={{
            backgroundPositionX: '0%',
            transition: {
              duration: 0.6,
              delay: START_DELAY + staggeredDelays[groupIndices[firstCharIndex]] + 0.2,
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
          {part.split('').map((char, charIndexInPart) => {
            const globalCharIndex = firstCharIndex + charIndexInPart;

            return (
              <CharAnimation
                key={globalCharIndex}
                char={char}
                delay={START_DELAY + staggeredDelays[groupIndices[globalCharIndex]]}
              />
            );
          })}
        </m.span>
      );
    }

    return part.split('').map((char, charIndexInPart) => {
      const globalCharIndex = firstCharIndex + charIndexInPart;

      return (
        <CharAnimation
          key={globalCharIndex}
          char={char}
          delay={START_DELAY + staggeredDelays[groupIndices[globalCharIndex]]}
        />
      );
    });
  });

  // Provide accessible text for screen readers
  const accessibleText = text.join('');

  return (
    <>
      <span className="sr-only">{accessibleText}</span>
      {result}
    </>
  );
};

AnimatedText.propTypes = {
  text: PropTypes.arrayOf(PropTypes.string).isRequired,
  highlight: PropTypes.string.isRequired,
};

export default AnimatedText;
