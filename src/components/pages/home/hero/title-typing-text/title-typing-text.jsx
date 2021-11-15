import { motion, useAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';

const words = ['Serverless', 'Fault-tolerant', 'Branchable', 'Bottomless'];

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

const TitleTypingText = ({ shouldAnimationStart }) => {
  const [activeTitleWordIndex, setActiveTitleWordIndex] = useState(0);

  const controls = useAnimation();

  const animate = useCallback(() => {
    controls.set('hidden');

    controls.start('shown').then(() => {
      controls.start('hidden').then(() => {
        setActiveTitleWordIndex((currentATitleWordIndex) =>
          currentATitleWordIndex === words.length - 1 ? 0 : currentATitleWordIndex + 1
        );

        animate();
      });
    });
  }, [controls]);

  useEffect(() => {
    if (shouldAnimationStart) {
      controls.start('hidden').then(() => {
        setActiveTitleWordIndex((currentATitleWordIndex) => currentATitleWordIndex + 1);
        animate();
      });
    }
  }, [controls, animate, shouldAnimationStart]);

  return (
    <motion.span initial="shown" animate={controls} variants={wrapperVariants}>
      {words[activeTitleWordIndex].split('').map((letter, index) => (
        <motion.span
          className="animate-text-blink"
          variants={wordVariants}
          style={activeTitleWordIndex === 0 && { animationPlayState: 'paused' }}
          key={index}
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

TitleTypingText.propTypes = {
  shouldAnimationStart: PropTypes.bool,
};

TitleTypingText.defaultProps = {
  shouldAnimationStart: false,
};

export default TitleTypingText;
