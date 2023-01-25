import { motion, useAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';

const wrapperVariants = {
  hidden: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
      delayChildren: 2,
    },
  },
  shown: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.25,
    },
  },
};

const wordVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0,
    },
  },
  shown: {
    opacity: 1,
    transition: {
      duration: 0,
    },
  },
};

const TypingText = ({
  className: additionalClassName = null,
  phrases,
  shouldAnimationStart = false,
}) => {
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);

  const controls = useAnimation();

  const animate = useCallback(() => {
    controls.set('hidden');

    controls.start('shown').then(() => {
      controls.start('hidden').then(() => {
        setActivePhraseIndex((currentActivePhrase) =>
          currentActivePhrase === phrases.length - 1 ? 0 : currentActivePhrase + 1
        );

        animate();
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (shouldAnimationStart) {
      controls
        .start('hidden', {
          ...wrapperVariants.hidden.transition,
          ...wordVariants.hidden.transition,
          delayChildren: 0,
        })
        .then(() => {
          setActivePhraseIndex((currentActivePhrase) => currentActivePhrase + 1);
          animate();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAnimationStart]);

  return (
    <motion.span
      className={additionalClassName}
      initial="shown"
      animate={controls}
      variants={wrapperVariants}
    >
      {phrases[activePhraseIndex].split('').map((letter, index) => (
        <motion.span
          className="animate-text-blink"
          variants={wordVariants}
          style={activePhraseIndex === 0 && { animationPlayState: 'paused' }}
          key={index}
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

TypingText.propTypes = {
  className: PropTypes.string,
  phrases: PropTypes.arrayOf(PropTypes.string).isRequired,
  shouldAnimationStart: PropTypes.bool,
};

export default TypingText;
