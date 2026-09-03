'use client';

import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import useLocation from 'react-use/lib/useLocation';

import { cn } from 'utils/cn';

const variantsAnimation = {
  open: {
    opacity: 1,
    height: 'auto',
    pointerEvents: 'auto',
  },
  closed: {
    opacity: 0,
    height: 0,
    pointerEvents: 'none',
  },
};

const variants = {
  default: {
    item: null,
    title: null,
    icon: null,
    content: null,
  },
  light: {
    item: 'border-gray-new-70',
    title: 'text-black-pure font-normal',
    icon: 'border-gray-new-40 size-2.25',
    content: 'text-gray-new-20',
  },
};

const Item = ({
  question,
  answer,
  id = null,
  initialState = 'closed',
  index,
  variant = 'default',
}) => {
  const { hash } = useLocation();
  const [isOpen, setIsOpen] = useState(initialState === 'open');
  const shouldReduceMotion = useReducedMotion();
  const styles = variants[variant] ?? variants.default;

  const handleOpen = () => {
    setIsOpen((prev) => {
      const newState = !prev;

      if (!newState && hash === `#${id}`) {
        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}${window.location.search}`
        );
      }

      return newState;
    });
  };

  useEffect(() => {
    let timeout;

    if (hash === `#${id}`) {
      timeout = setTimeout(() => {
        setIsOpen(true);
      }, 700);
    }

    return () => clearTimeout(timeout);
  }, [id, hash]);

  return (
    <li
      className={cn(
        '-mx-1 overflow-hidden border-b border-gray-new-15 px-1 py-[19px] last:border-0 xl:py-[18px] md:py-[14px]',
        styles.item
      )}
      id={id}
    >
      <h3
        className={cn(
          'text-xl leading-snug font-medium tracking-tighter transition-colors duration-300 lg:text-lg',
          styles.title
        )}
      >
        <button
          className="group relative flex w-full items-start justify-between gap-4 rounded-sm text-left after:absolute after:-inset-y-5 after:left-0 after:w-full"
          type="button"
          aria-expanded={isOpen}
          aria-controls={`panel-${index}`}
          onClick={handleOpen}
        >
          <span>{question}</span>
          <span
            className={cn(
              'mt-2.5 mr-2.5 h-2 w-2 shrink-0 transform border-t border-l border-gray-new-80 transition duration-300',
              'motion-reduce:transition-none',
              styles.icon,
              isOpen ? 'rotate-[405deg]' : 'rotate-[225deg]'
            )}
          />
        </button>
      </h3>
      <LazyMotion features={domAnimation}>
        <m.div
          key={index}
          id={`panel-${index}`}
          aria-hidden={!isOpen}
          inert={!isOpen}
          initial={initialState}
          animate={isOpen ? 'open' : 'closed'}
          variants={variantsAnimation}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  opacity: { duration: 0.2 },
                  height: { duration: 0.3 },
                }
          }
        >
          <div
            className={cn(
              'with-list-style pt-4 pr-[52px]',
              'text-[16px] leading-normal font-normal tracking-extra-tight text-gray-new-60',
              'xl:pr-[52px] lg:pt-5 lg:pr-[50px] lg:leading-snug md:pt-3 md:pr-0 md:text-[15px]',
              '[&_p+p]:mt-2',
              '[&_ul]:ml-0 [&_ul]:list-none [&_ul]:pl-4',
              '[&_li]:relative [&_li]:list-inside [&_li]:pl-4!',
              '[&_li]:before:absolute [&_li]:before:top-0 [&_li]:before:left-0 [&_li]:before:content-["-"]',
              '[&_code]:my-4 [&_code]:inline-block [&_code]:rounded-lg [&_code]:bg-gray-new-10 [&_code]:px-[10px] [&_code]:py-1',
              '[&_a]:rounded-sm [&_a]:text-white [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-gray-new-80',
              styles.content
            )}
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </m.div>
      </LazyMotion>
    </li>
  );
};

Item.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  id: PropTypes.string,
  initialState: PropTypes.oneOf(['open', 'closed']),
  index: PropTypes.number.isRequired,
  variant: PropTypes.oneOf(Object.keys(variants)),
};

export default Item;
