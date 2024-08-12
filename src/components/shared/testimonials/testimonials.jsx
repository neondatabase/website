'use client';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import Container from 'components/shared/container';
import SliderItem from 'components/shared/testimonials/slider-item';
import QuoteIcon from 'icons/quote.inline.svg';
import TwitterIcon from 'icons/twitter.inline.svg';

const SLIDER_DURATION_IN_MS = 9000;

const sliderItemsAnimationProps = {
  initial: (direction) => ({
    opacity: 0,
    translateX: direction === 'right' ? 20 : -20,
  }),
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

const themes = {
  default: {
    icon: QuoteIcon,
  },
  twitter: {
    icon: TwitterIcon,
  },
};

const Testimonials = ({ className, itemClassName, items, theme = 'default' }) => {
  const [sliderRef, isSliderInView] = useInView();
  const [activeSliderItemIndex, setActiveSliderItemIndex] = useState(0);
  const [direction, setDirection] = useState('right');

  const Icon = themes[theme].icon;

  useEffect(() => {
    let timeout = null;

    if (isSliderInView) {
      timeout = setTimeout(() => {
        setActiveSliderItemIndex(
          (activeSliderItemIndex) => (activeSliderItemIndex + 1) % items.length
        );
        setDirection('right');
      }, SLIDER_DURATION_IN_MS);
    } else {
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [activeSliderItemIndex, isSliderInView, items.length]);

  return (
    <section
      className={clsx('testimonial safe-paddings overflow-hidden', className)}
      ref={sliderRef}
    >
      <Container className="flex flex-col items-center text-center" size="xs">
        <Icon
          className="h-[72px] w-[72px] xl:h-16 xl:w-16 md:h-[52px] md:w-[52px]"
          width={72}
          height={72}
          aria-hidden
        />

        <AnimatePresence initial={false} mode="wait">
          {items.map((item, index) =>
            index === activeSliderItemIndex ? (
              <motion.div
                className="flex items-center space-x-[18px]"
                key={index}
                custom={direction}
                {...sliderItemsAnimationProps}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 0) {
                    setActiveSliderItemIndex(
                      (itemIndex) => (itemIndex + items.length - 1) % items.length
                    );
                    setDirection('left');
                  } else {
                    setActiveSliderItemIndex((itemIndex) => (itemIndex + 1) % items.length);
                    setDirection('right');
                  }
                }}
              >
                <SliderItem className={itemClassName} {...item} />
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        <ul className="mt-8 flex items-center justify-between xl:mt-5 lg:mt-4 md:mt-3">
          {items.map((_, index) => (
            <li key={index}>
              <button
                className="px-[5px] py-2"
                type="button"
                aria-label={`Go to testimonial ${index + 1}`}
                onClick={() => setActiveSliderItemIndex(index)}
              >
                <span
                  className={clsx(
                    'block h-2 w-2 rounded-full transition-colors duration-100',
                    activeSliderItemIndex === index ? 'bg-green-45' : 'bg-gray-new-20'
                  )}
                />
              </button>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};

Testimonials.propTypes = {
  className: PropTypes.string,
  itemClassName: PropTypes.string,
  theme: PropTypes.oneOf(['default', 'twitter']),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      authorName: PropTypes.string.isRequired,
      authorTitle: PropTypes.string.isRequired,
    })
  ),
};

export default Testimonials;
