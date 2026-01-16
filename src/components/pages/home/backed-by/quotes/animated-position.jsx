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

  // Helper function to create character animation array
  const createCharArray = (text, startIndex) =>
    text.split('').map((char, index) => {
      const globalCharIndex = startIndex + index;
      return (
        <CharAnimation
          key={globalCharIndex}
          char={char}
          delay={START_DELAY + staggeredDelays[groupIndices[globalCharIndex]]}
        />
      );
    });

  const authorChars = createCharArray(author, 0);
  const positionChars = createCharArray(position, author.length);

  return (
    <>
      <span className="sr-only">
        {author} {position}
      </span>
      <span className="block font-medium" aria-hidden="true">
        {authorChars}
      </span>
      <span aria-hidden="true">{positionChars}</span>
    </>
  );
};

AnimatedPosition.propTypes = {
  author: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
};

export default AnimatedPosition;
