import shuffle from 'lodash.shuffle';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const BlinkingText = ({
  text = '',
  parentElement = null,
  shouldAnimationStart = false,
  children = null,
}) => {
  useEffect(() => {
    if (parentElement && shouldAnimationStart) {
      const letters = parentElement.querySelectorAll('.animate-text-blink');
      const shuffledLetters = shuffle(letters);

      let currentTimeout = 0;
      shuffledLetters.forEach((letter) => {
        setTimeout(() => {
          // eslint-disable-next-line no-param-reassign
          letter.style.cssText = 'animation-play-state: running';
        }, currentTimeout);

        currentTimeout += 10;
      });
    }
  }, [parentElement, shouldAnimationStart]);

  return text
    ? text.split('').map((letter, index) => (
        <span className="animate-text-blink" style={{ animationPlayState: 'paused' }} key={index}>
          {letter}
        </span>
      ))
    : children;
};

BlinkingText.propTypes = {
  text: PropTypes.string,
  parentElement: PropTypes.object,
  shouldAnimationStart: PropTypes.bool,
  children: PropTypes.node,
};

export default BlinkingText;
