'use client';
import clsx from 'clsx';
import Container from 'components/shared/container';

import Link from 'components/shared/link';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';
import prototypeImage from './images/prototype.svg';

const items = [
  {
    type: 'Prototype',
    image: prototypeImage,
  },
  {
    type: 'Startup',
    image: prototypeImage,
  },
  {
    type: 'Enterprise',
    image: prototypeImage,
  },
];

const Estimates = (props) => {
  const [selected, setSelected] = useState(items[0].type);

  const handleSelect = (item) => {
    setSelected(item);
  };

  console.log(selected);

  return (
    <section className="estimates safe-paddings mt-48">
      <Container className="grid-gap-x grid grid-cols-12" size="mdDoc">
        <div className="col-start-3 col-end-11 flex flex-col items-center">
          <span className="text-lg uppercase leading-snug text-primary-1">
            Billing & usage estimates
          </span>
          <h2 className="t-5xl mt-2.5 inline-flex flex-col text-center font-bold leading-tight">
            <span>Each user is unique.</span> However, we can give you some estimates.
          </h2>
          <p className="mt-7 text-xl">
            Contact{' '}
            <Link theme="underline-primary-1" size="md" to="mailto:sales@neon.tech">
              sales@neon.tech
            </Link>{' '}
            if you require assistance forecasting billing and usage.
          </p>
          <ul className="mt-[53px] mb-12 grid w-full grid-cols-3 gap-x-7">
            {items.map(({ type }) => (
              <li key={type}>
                <button
                  className={clsx(
                    'w-full rounded-[80px] border py-6 text-lg font-bold leading-none transition-colors duration-200 hover:border-white hover:text-white',
                    type === selected
                      ? 'border-white text-white'
                      : 'border-dashed border-gray-4 text-gray-4'
                  )}
                  onClick={() => handleSelect(type)}
                >
                  {type}
                </button>
              </li>
            ))}
          </ul>
          <LazyMotion features={domAnimation}>
            <AnimatePresence initial={false} mode="wait">
              {items.map(({ type, image }) => {
                if (type === selected) {
                  return (
                    <m.img
                      key={type}
                      src={image}
                      width={740}
                      height={356}
                      initial={{
                        opacity: 0,
                        translateY: 10,
                      }}
                      animate={{
                        opacity: 1,
                        translateY: 0,
                        transition: { duration: 0.3 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.2 },
                      }}
                      transition={{ ease: [0.25, 0.1, 0, 1] }}
                    />
                  );
                }
              })}
            </AnimatePresence>
          </LazyMotion>
        </div>
      </Container>
    </section>
  );
};

Estimates.propTypes = {};

export default Estimates;
