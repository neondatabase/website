import PropTypes from 'prop-types';

import useTextStaggeredAnimation from 'hooks/use-text-staggered-animation';

import CharAnimation from './char-animation';

const DURATION = 0.3;
const START_DELAY = 1.45;

const AnimatedPosition = ({ author, position }) => {
  const textString = [author, position].join('');

  const { groupIndices, staggeredDelays } = useTextStaggeredAnimation({
    duration: DURATION,
    textString,
  });

  // Calculate character indices for each part
  const authorChars = author.split('').map((char, index) => {
    const globalCharIndex = index;
    return (
      <CharAnimation
        key={globalCharIndex}
        char={char}
        delay={START_DELAY + staggeredDelays[groupIndices[globalCharIndex]]}
      />
    );
  });

  const positionChars = position.split('').map((char, index) => {
    const globalCharIndex = author.length + index;
    return (
      <CharAnimation
        key={globalCharIndex}
        char={char}
        delay={START_DELAY + staggeredDelays[groupIndices[globalCharIndex]]}
      />
    );
  });

  return (
    <>
      <span className="block font-medium" key="author-part">
        {authorChars}
      </span>
      {positionChars}
    </>
  );
};

AnimatedPosition.propTypes = {
  author: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
};

export default AnimatedPosition;
