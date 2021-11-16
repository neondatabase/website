import clsx from 'clsx';
import copyToClipboard from 'copy-to-clipboard';
import { motion, useAnimation } from 'framer-motion';
import React, { useRef, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import BlinkingText from 'components/shared/blinking-text';
import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const pVariants = {
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
    transition: {
      duration: 1,
    },
  },
};

const inputInnerVariants = {
  from: {
    width: 0,
  },
  to: {
    width: '100%',
    transition: {
      duration: 1,
    },
  },
};

const inputPanelVariants = {
  from: {
    backgroundColor: '#00e699',
  },
  to: {
    backgroundColor: '#f0f075',
    transition: {
      delay: 2,
      duration: 0.4,
      repeat: Infinity,
      repeatDelay: 2,
      repeatType: 'mirror',
    },
  },
};

const CTA = () => {
  const titleRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);

  const controls = useAnimation();

  const [animationVisibilityRef, isInView] = useInView({
    threshold: 0.6,
    triggerOnce: true,
  });

  const handleButtonClick = () => {
    if (!isCopied) {
      copyToClipboard('psql -h lb.zenith.tech', { onCopy: setIsCopied(true) });
    }
  };

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    }
  }, [isCopied]);

  useEffect(() => {
    if (isInView) {
      controls.start('to');
    }
  }, [isInView, controls]);

  return (
    <motion.section
      className="text-center bg-black pt-[504px] safe-paddings 3xl:pt-[397px] 2xl:pt-[344px] xl:pt-[310px] lg:pt-[238px] md:pt-[200px]"
      initial="from"
      animate={controls}
    >
      <Container className="z-20" ref={animationVisibilityRef}>
        <Heading id="cta-title" tag="h2" size="lg" theme="white" ref={titleRef}>
          <BlinkingText
            text="Made for Developers"
            parentElement={titleRef.current}
            shouldAnimationStart={isInView}
          />
        </Heading>
        <motion.p className="mt-5 text-white t-3xl 2xl:mt-4" variants={pVariants}>
          Just use a single command from CLI to create new Zenith database
        </motion.p>
        <div className="max-w-[860px] mt-8 mx-auto 3xl:max-w-[716px] 2xl:max-w-[592px] 2xl:mt-7 xl:max-w-[498px] xl:mt-6 lg:max-w-[584px]">
          <motion.div className="relative mx-auto" id="cta-input" variants={inputInnerVariants}>
            <motion.div
              id="cta-input-background"
              className="absolute -bottom-3.5 -left-3.5 w-full h-full rounded-full 2xl:-bottom-2.5 2xl:-left-2.5 xl:-bottom-2 xl:-left-2 md:w-[calc(100%+8px)]"
              variants={inputPanelVariants}
              aria-hidden
            />
            <div className="overflow-hidden">
              <div className="relative flex items-center justify-between p-2 bg-white border-4 border-black rounded-full pl-9 2xl:p-1.5 2xl:pl-7 xl:p-1 xl:pl-6 md:py-[22px] md:px-0 md:justify-center">
                <span className="font-mono t-3xl whitespace-nowrap !leading-none">
                  $ psql -h lb.zenith.tech
                </span>
                <Button
                  className="relative md:hidden"
                  size="sm"
                  theme="secondary"
                  onClick={handleButtonClick}
                >
                  <span className={clsx({ 'opacity-0': isCopied })}>Copy</span>
                  <span
                    className={clsx(
                      'absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 opacity-0',
                      { 'opacity-100': isCopied }
                    )}
                  >
                    Copied!
                  </span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
        <motion.p
          id="cta-bottom-text"
          className="max-w-[500px] text-white t-xl mt-[56px] mx-auto 2xl:max-w-[450px] 2xl:mt-[46px] xl:mt-10 xl:max-w-[400px]"
          variants={pVariants}
        >
          Same PostgreSQL command as you used to will get you{' '}
          <Link to="/" theme="underline-primary-1">
            a smooth database creation
          </Link>{' '}
          experience.
        </motion.p>
      </Container>
    </motion.section>
  );
};

export default CTA;
