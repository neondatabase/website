import { motion, useAnimation } from 'framer-motion';
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

const TitleTypingText = () => {
  const [activeTitleWordIndex, setActiveTitleWordIndex] = useState(0);

  const controls = useAnimation();

  const animate = useCallback(() => {
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
    controls.set('shown');

    controls.start('hidden').then(() => {
      setActiveTitleWordIndex((currentATitleWordIndex) => currentATitleWordIndex + 1);
      animate();
    });
  }, [controls, animate]);

  return (
    <motion.span initial="hidden" animate={controls} variants={wrapperVariants}>
      {words[activeTitleWordIndex].split('').map((letter, index) => (
        <motion.span className="!text-white" variants={wordVariants} key={index}>
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default TitleTypingText;
