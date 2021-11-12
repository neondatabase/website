import { motion, useAnimation } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';

const words = ['Serverless', 'Fault-tolerant', 'Branchable', 'Bottomless'];

const wrapperVariants = {
  hide: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      delayChildren: 2,
    },
  },
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.25,
    },
  },
};

const wordVariants = {
  hide: {
    opacity: 0,
    transition: {
      duration: 0,
    },
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0,
    },
  },
};

const TitleTypingText = () => {
  const [activeTitleWordIndex, setActiveTitleWordIndex] = useState(0);

  const controls = useAnimation();

  const animate = useCallback(() => {
    controls.start('show').then(() => {
      controls.start('hide').then(() => {
        setActiveTitleWordIndex((currentATitleWordIndex) =>
          currentATitleWordIndex === words.length - 1 ? 0 : currentATitleWordIndex + 1
        );

        animate();
      });
    });
  }, [controls]);

  useEffect(() => {
    controls.set('show');

    controls.start('hide').then(() => {
      setActiveTitleWordIndex((currentATitleWordIndex) => currentATitleWordIndex + 1);
      animate();
    });
  }, [controls, animate]);

  return (
    <motion.span initial="hide" animate={controls} variants={wrapperVariants}>
      {words[activeTitleWordIndex].split('').map((letter, index) => (
        <motion.span className="!text-white" variants={wordVariants} key={index}>
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default TitleTypingText;
