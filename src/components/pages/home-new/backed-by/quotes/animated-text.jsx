import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import cubicBezierEasing from 'utils/cubic-bezier-easing';

const DURATION = 1.1;
const START_DELAY = 0.3;

/**
 * Creates an array mapping each character index to its group index.
 * @param {string} text - The text to break into groups
 * @param {function} easingFunction - Easing function that takes progress (0-1) and returns eased value (0-1)
 * @param {number} numGroups - Number of groups to create (default: calculated based on text length)
 * @returns {{groupIndices: Array<number>, numGroups: number}} Object with group indices array and number of groups
 */
const getGroupIndices = (text, easingFunction, numGroups = null) => {
  if (!text || text.length === 0) {
    return { groupIndices: [], numGroups: 0 };
  }

  const textLength = text.length;

  // Calculate number of groups if not provided (doubled from original)
  const defaultNumGroups = Math.max(3, Math.min(40, Math.floor(textLength / 4) * 2));
  const groups = numGroups || defaultNumGroups;

  if (groups <= 1) {
    // All characters belong to group 0
    return { groupIndices: new Array(textLength).fill(0), numGroups: 1 };
  }

  // Calculate cumulative positions using the easing function
  const positions = [];
  for (let i = 0; i <= groups; i += 1) {
    const progress = i / groups;
    const easedValue = easingFunction(progress);
    const position = Math.round(easedValue * textLength);
    positions.push(Math.max(0, Math.min(textLength, position)));
  }

  // Ensure first is 0 and last is textLength
  positions[0] = 0;
  positions[positions.length - 1] = textLength;

  // Check if we have accelerating (small to large) instead of decelerating (large to small)
  if (positions.length > 2) {
    const firstGroupSize = positions[1] - positions[0];
    const lastGroupSize = positions[positions.length - 1] - positions[positions.length - 2];
    if (firstGroupSize < lastGroupSize) {
      // Reverse positions: create decelerating from accelerating
      const reversed = [];
      for (let i = 0; i < positions.length; i += 1) {
        reversed[i] = textLength - positions[positions.length - 1 - i];
      }
      positions.length = 0;
      positions.push(...reversed);
      positions[0] = 0;
      positions[positions.length - 1] = textLength;
    }
  }

  // Create mapping array: for each character index, determine which group it belongs to
  const groupIndices = new Array(textLength);
  for (let charIndex = 0; charIndex < textLength; charIndex += 1) {
    // Find which group this character belongs to
    for (let groupIndex = 0; groupIndex < groups; groupIndex += 1) {
      const groupStart = positions[groupIndex];
      const groupEnd = positions[groupIndex + 1];
      if (charIndex >= groupStart && charIndex < groupEnd) {
        groupIndices[charIndex] = groupIndex;
        break;
      }
    }
    // Fallback: if character wasn't assigned (shouldn't happen), assign to last group
    if (groupIndices[charIndex] === undefined) {
      groupIndices[charIndex] = groups - 1;
    }
  }

  // Count actual number of groups (some groups might be empty)
  const actualNumGroups = Math.max(...groupIndices) + 1;

  return { groupIndices, numGroups: actualNumGroups };
};

/**
 * Creates an array of delays based on duration, easing function, and number of elements.
 * @param {number} duration - Total duration in seconds
 * @param {function} easingFunction - Easing function that takes progress (0-1) and returns eased value (0-1)
 * @param {number} amountOfElements - Number of elements to create delays for
 * @returns {Array<number>} Array of delays in seconds for each element
 */
const computeStaggerDelays = (duration, easingFunction, amountOfElements) => {
  if (amountOfElements <= 0 || duration <= 0) {
    return [];
  }

  if (amountOfElements === 1) {
    return [0];
  }

  const delays = [];

  for (let i = 0; i < amountOfElements; i += 1) {
    // Calculate progress from 0 to 1
    const progress = i / (amountOfElements - 1);
    // Apply easing function to get eased progress
    const easedProgress = easingFunction(progress);
    // Calculate delay based on eased progress and duration
    const delay = easedProgress * duration;
    delays.push(delay);
  }

  return delays;
};

const AnimatedText = ({ text }) => {
  const textString = text.join('');

  const { groupIndices, numGroups } = getGroupIndices(
    textString,
    cubicBezierEasing([0.17, 0.17, 0.27, 1])
  );

  const staggeredDelays = computeStaggerDelays(
    DURATION,
    cubicBezierEasing([0.3, 0, 0.83, 1]),
    numGroups
  );

  let currentIndex = 0;

  const result = text.map((part, index) => {
    if (index === 1) {
      return (
        <m.span className="font-bold">
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
  startDelay: PropTypes.number,
  skipAnimation: PropTypes.bool,
  fadeDelay: PropTypes.number,
};

export default AnimatedText;
