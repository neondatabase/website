'use client';

import clsx from 'clsx';
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import SliderItem from 'components/pages/ai/testimonials/slider-item';
import Container from 'components/shared/container/container';

// TODO: add links to original tweets?
const sliderItems = [
  {
    text: '<a href="https://twitter.com/postgresql" target="_blank">@PostgreSQL</a> is popular database choice. Excited to share a new extension from <a href="https://twitter.com/neondatabase" target="_blank">@neondatabase</a> to help you use it for embeddings as well (with HNSW)!',
    authorName: 'Harrison Chase',
    authorTitle: 'Co-Founder and CEO, LangChainAI',
  },
  {
    text: 'What if PGVector was on steroids ?! <a href="https://twitter.com/raoufdevrel" target="_blank">@raoufdevrel</a> from <a href="https://twitter.com/neondatabase" target="_blank">@neondatabase</a> just did that with pg_embedding and made it available through <a href="https://twitter.com/LangChainAI" target="_blank">@LangChainAI</a>. I&apos;ll definitely give it a try on <a href="https://twitter.com/quivr_brain" target="_blank">@quivr_brain</a> and our 10GB of vectors that use PGVector',
    authorName: 'Stan Girard',
    authorTitle: 'Founder, Quivr',
  },
  {
    text: '<a href="https://twitter.com/postgresql" target="_blank">@PostgreSQL</a> is popular database choice. Excited to share a new extension from <a href="https://twitter.com/neondatabase" target="_blank">@neondatabase</a> to help you use it for embeddings as well (with HNSW)!',
    authorName: 'Harrison Chase',
    authorTitle: 'Co-Founder and CEO, LangChainAI',
  },
];

const SLIDER_DURATION_IN_MS = 5000;

const sliderItemsAnimationProps = {
  initial: {
    opacity: 0,
    translateX: 20,
  },
  animate: {
    opacity: 1,
    translateX: 0,
    transition: { ease: [0.25, 0.1, 0, 1], duration: 0.5 },
  },
  exit: {
    opacity: 0,
    transition: { ease: [0.25, 0.1, 0, 1], duration: 0.2 },
  },
};

const Testimonials = () => {
  const [sliderRef, isSliderInView] = useInView();
  const [activeSliderItemIndex, setActiveSliderItemIndex] = useState(0);

  useEffect(() => {
    let timeout = null;

    if (isSliderInView) {
      timeout = setTimeout(() => {
        setActiveSliderItemIndex(
          (activeSliderItemIndex) => (activeSliderItemIndex + 1) % sliderItems.length
        );
      }, SLIDER_DURATION_IN_MS);
    } else {
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [activeSliderItemIndex, isSliderInView]);

  return (
    <section className="testimonial safe-paddings mt-40 xl:mt-[120px]" ref={sliderRef}>
      <Container className="flex flex-col items-center text-center" size="xs">
        <LazyMotion features={domAnimation}>
          <AnimatePresence initial={false} mode="wait">
            {sliderItems.map((item, index) =>
              index === activeSliderItemIndex ? (
                <m.div
                  className="flex items-center space-x-[18px] lg:mt-10 md:mt-8"
                  key={index}
                  {...sliderItemsAnimationProps}
                >
                  <SliderItem {...item} />
                </m.div>
              ) : null
            )}
          </AnimatePresence>
        </LazyMotion>
        <div className="mt-7 flex items-center justify-between xl:mt-5 md:flex-col md:items-center">
          <ul className="flex space-x-2.5">
            {sliderItems.map((_, index) => (
              <li key={index}>
                <button
                  className={clsx(
                    'h-2 w-2 rounded-full transition-colors duration-100',
                    activeSliderItemIndex === index ? 'bg-green-45' : 'bg-gray-new-20'
                  )}
                  type="button"
                  aria-label={`Go to testimonial ${index + 1}`}
                  onClick={() => setActiveSliderItemIndex(index)}
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
