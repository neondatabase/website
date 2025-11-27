'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useRef, useState, useEffect, Fragment } from 'react';
import { useInView } from 'react-intersection-observer';

const HIGHLIGHT_COLOR = 'rgba(57, 165, 125, 0.6)';

const QUOTES = [
  {
    text: "Neon allows us to develop much faster than we've even been used to",
    highlight: "faster than we've even been",
    author: 'Alex Klarfeld',
    post: 'CEO and co-founder of Supergood.ai',
  },
  {
    text: "Neon's serverless philosophy is aligned with our vision: no infrastructure to manage, no servers to provision, no database cluster to maintain.",
    highlight: 'aligned with our vision:',
    author: 'Edouard Bonlieu',
    post: 'Co-founder at Koyeb',
  },
  {
    text: 'The killer feature that convinced us to use Neon was branching: it keeps our engineering velocity high',
    highlight: 'The killer feature',
    author: 'Léonard Henriquez',
    post: 'Co-founder and CTO, Topo.io',
  },
  {
    text: "We've been able to automate virtually all database tasks via the Neon API, saving us a tremendous amount of time and engineering effort",
    highlight: 'automate virtually all database tasks',
    author: 'Himanshu Bhandoh',
    post: 'Software Engineer at Retool',
  },
];

const Quotes = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const startTimeRef = useRef(Date.now());
  const pausedTimeRef = useRef(0);
  const frameRef = useRef(null);

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
    <div ref={ref} className="relative w-full md:h-[142px]">
      {QUOTES.map(({ text, highlight, author, post }, index) => {
        const isActive = index === currentIndex;

        return (
          <LazyMotion features={domAnimation} key={index}>
            <m.figure
              className={clsx(
                'absolute inset-x-0 bottom-0 -mx-1 mt-auto overflow-hidden px-1',
                'font-mono-new tracking-extra-tight',
                !isActive && 'pointer-events-none'
              )}
              initial={index !== 0 && { y: 5, opacity: 0 }}
              animate={{
                y: isActive ? 0 : 5,
                opacity: isActive ? 1 : 0,
                transition: { duration: 0.3, delay: 0.15, ease: [0.19, 0.44, 0, 1] },
              }}
            >
              <blockquote
                className={clsx(
                  'text-xl xl:text-lg lg:text-[15px]',
                  'transition-[line-height] duration-300 ease-out',
                  isActive ? 'leading-snug delay-150' : 'leading-dense'
                )}
              >
                {text.split(highlight).map((part, partIndex, parts) => (
                  <Fragment key={partIndex}>
                    {part}
                    {partIndex < parts.length - 1 && (
                      <m.span
                        className="relative -mx-1 px-1"
                        animate={{
                          backgroundImage: `linear-gradient(to right, ${HIGHLIGHT_COLOR}, ${HIGHLIGHT_COLOR} ${isActive ? '100%' : '0%'}, transparent ${isActive ? '100%' : '0%'})`,
                          transition: { duration: 0.67, ease: [0.17, 0.17, 0.1, 1], delay: 0.35 },
                        }}
                      >
                        {highlight}
                      </m.span>
                    )}
                  </Fragment>
                ))}
              </blockquote>
              <figcaption className="mt-5 block text-base not-italic leading-normal text-gray-new-15 xl:text-sm">
                <span className="font-medium">{author}</span> – {post}
              </figcaption>
              <m.span
                className={clsx(
                  'pointer-events-none absolute inset-0 h-[150%] bg-gradient-to-t from-transparent to-[#E4F1EB] to-30%',
                  'transition-all duration-300 ease-[cubic-bezier(.19,.44,0,1)]',
                  isActive ? '-translate-y-full delay-150' : 'translate-y-0'
                )}
                aria-hidden
              />
            </m.figure>
          </LazyMotion>
        );
      })}
    </div>
  );
};

export default Quotes;
