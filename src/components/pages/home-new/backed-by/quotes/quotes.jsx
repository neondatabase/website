'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import AnimatedText from './animated-text';

const FADE_DURATION = 0.3; // Duration for fade in/out animations in seconds

const QUOTES = [
  {
    text: [
      "Neon's serverless philosophy is ",
      'aligned with our vision:',
      ' no infrastructure to manage, no servers to provision, no database cluster to maintain.',
    ],
    author: ['Edouard Bonlieu'],
    post: ['Co-founder at Koyeb'],
  },
  {
    text: [
      "Neon's serverless philosophy is ",
      'aligned with our vision:',
      ' no infrastructure to manage, no servers to provision, no database cluster to maintain.',
    ],
    author: ['Edouard Bonlieu'],
    post: ['Co-founder at Koyeb'],
  },
  // {
  //   text: "Neon allows us to develop much faster than we've even been used to.",
  //   highlight: "faster than we've even been",
  //   author: 'Alex Klarfeld',
  //   post: 'CEO and co-founder of Supergood.ai',
  // },
  // {
  //   text: 'The killer feature that convinced us to use Neon was branching: it keeps our engineering velocity high.',
  //   highlight: 'The killer feature',
  //   author: 'Léonard Henriquez',
  //   post: 'Co-founder and CTO, Topo.io',
  // },
  // {
  //   text: "We've been able to automate virtually all database tasks via the Neon API, saving us a tremendous amount of time and engineering effort.",
  //   highlight: 'automate virtually all database tasks',
  //   author: 'Himanshu Bhandoh',
  //   post: 'Software Engineer at Retool',
  // },
];

const Quotes = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFirstShow, setIsFirstShow] = useState(true);
  const startTimeRef = useRef(Date.now());
  const pausedTimeRef = useRef(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (isFirstShow) {
      setIsFirstShow(false);
    }
  }, [isFirstShow]);

  const [ref, isVisible] = useInView({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  });

  useEffect(() => {
    if (!isVisible) {
      if (frameRef.current) {
        pausedTimeRef.current = Date.now() - startTimeRef.current;
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      return undefined;
    }

    startTimeRef.current = Date.now() - pausedTimeRef.current;
    pausedTimeRef.current = 0;

    const updateIndex = () => {
      const elapsedTime = Date.now() - startTimeRef.current;
      const newIndex = Math.floor(elapsedTime / 5000) % QUOTES.length;
      setCurrentIndex(newIndex);
      frameRef.current = requestAnimationFrame(updateIndex);
    };

    frameRef.current = requestAnimationFrame(updateIndex);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [isVisible]);

  return (
    <div ref={ref} className="relative w-full md:h-40">
      {QUOTES.map(({ text, author, post }, index) => {
        const isActive = index === currentIndex;

        return (
          <LazyMotion features={domAnimation} key={index}>
            <AnimatePresence>
              {isActive && (
                <m.figure
                  className={clsx(
                    'absolute inset-x-0 bottom-0 -mx-1 mt-auto overflow-hidden px-1',
                    'font-mono-new tracking-extra-tight',
                    !isActive && 'pointer-events-none'
                  )}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { delay: FADE_DURATION, duration: 0 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: FADE_DURATION, ease: [0.17, 0.17, 0.83, 0.83] },
                  }}
                >
                  <blockquote className="text-pretty text-xl leading-snug xl:text-lg lg:text-[15px]">
                    <AnimatedText
                      text={text}
                      startDelay={0}
                      skipAnimation={isFirstShow}
                      fadeDelay={FADE_DURATION}
                    />
                  </blockquote>
                  <figcaption className="mt-5 block text-base not-italic leading-normal text-gray-new-15 xl:text-sm md:text-[13px]">
                    <span className="block font-medium">
                      <AnimatedText
                        text={author}
                        startDelay={text.length}
                        skipAnimation={isFirstShow}
                        fadeDelay={FADE_DURATION}
                      />
                    </span>
                    <AnimatedText
                      text={post}
                      startDelay={text.length + author.length}
                      skipAnimation={isFirstShow}
                      fadeDelay={FADE_DURATION}
                    />
                  </figcaption>
                </m.figure>
              )}
            </AnimatePresence>
          </LazyMotion>
        );
      })}
    </div>
  );
};

export default Quotes;
