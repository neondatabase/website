'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import useLocation from 'react-use/lib/useLocation';

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

const Item = ({ question, answer, id = null, initialState = 'closed', index }) => {
  const { hash } = useLocation();
  const [isOpen, setIsOpen] = useState(initialState === 'open');

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
      className="-mx-1 overflow-hidden border-b border-gray-new-15 px-1 py-[19px] last:border-0 xl:py-[18px] md:py-[14px]"
      id={id}
    >
      <button
        className="group relative flex w-full items-start justify-between gap-4 rounded-sm text-left after:absolute after:-inset-y-5 after:left-0 after:w-full"
        type="button"
        aria-expanded={isOpen}
        aria-controls={`panel-${index}`}
        onClick={handleOpen}
      >
        <h3 className="text-xl font-medium leading-snug tracking-tighter transition-colors duration-300 lg:text-lg">
          {question}
        </h3>
        <span
          className={clsx(
            'mr-2.5 mt-2.5 h-2 w-2 shrink-0 transform border-l border-t border-gray-new-80 transition duration-300',
            isOpen ? 'rotate-[405deg]' : 'rotate-[225deg]'
          )}
        />
      </button>
      <LazyMotion features={domAnimation}>
        <m.div
          key={index}
          id={`panel-${index}`}
          initial={initialState}
          animate={isOpen ? 'open' : 'closed'}
          variants={variantsAnimation}
          transition={{
            opacity: { duration: 0.2 },
            height: { duration: 0.3 },
          }}
        >
          <div
            className={clsx(
              'with-list-style pr-[52px] pt-4',
              'text-[16px] font-normal leading-normal tracking-extra-tight text-gray-new-60',
              'xl:pr-[52px] lg:pr-[50px] lg:pt-5 lg:leading-snug md:pr-0 md:pt-3 md:text-[15px]',
              '[&_p+p]:mt-2',
              '[&_ul]:ml-0 [&_ul]:list-none [&_ul]:pl-4',
              '[&_li]:relative [&_li]:list-inside [&_li]:!pl-4',
              '[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-0 [&_li]:before:content-["-"]',
              '[&_code]:my-4 [&_code]:inline-block [&_code]:rounded-lg [&_code]:bg-gray-new-10 [&_code]:px-[10px] [&_code]:py-1',
              '[&_a:hover]:text-gray-new-80 [&_a]:rounded-sm [&_a]:text-white [&_a]:transition-colors [&_a]:duration-200'
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
  initialState: PropTypes.string,
  index: PropTypes.number.isRequired,
};

export default Item;
