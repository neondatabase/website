'use client';
import clsx from 'clsx';
import Container from 'components/shared/container';

import Link from 'components/shared/link';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';

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

const Estimates = () => {
  const [selected, setSelected] = useState(items[0].type);

  const handleSelect = (item) => {
    setSelected(item);
  };

  return (
    <section className="estimates safe-paddings mt-48 2xl:mt-40 xl:mt-32 lg:mt-24 md:mt-20">
      <Container className="grid-gap-x grid grid-cols-12" size="mdDoc">
        <div className="col-start-3 col-end-11 flex flex-col items-center 2xl:col-span-full">
          <span className="text-lg uppercase leading-snug text-primary-1">
            Billing & usage estimates
          </span>
          <h2 className="mt-2.5 inline-flex flex-col text-center text-5xl font-bold leading-tight 2xl:max-w-[968px] 2xl:text-[44px] 2xl:leading-snug xl:text-4xl lg:inline lg:text-[36px] lg:leading-tight">
            <span>Each user is unique.</span> However, we can give you some estimates.
          </h2>
          <p className="mt-7 text-xl 2xl:mt-5 xl:text-base">
            Contact{' '}
            <Link className="font-semibold" theme="underline-primary-1" to="mailto:sales@neon.tech">
              sales@neon.tech
            </Link>{' '}
            if you require assistance forecasting billing and usage.
          </p>
          <ul className="mt-[53px] mb-12 grid w-full grid-cols-3 gap-x-7 2xl:mx-auto 2xl:max-w-[801px] xl:mb-8 xl:mt-10 xl:max-w-[616px] xl:gap-x-5 lg:mb-6 lg:mt-7 md:mt-6 md:mb-5 md:gap-x-4">
            {items.map(({ type }) => (
              <li key={type}>
                <button
                  className={clsx(
                    'w-full rounded-[80px] border py-6 text-lg font-bold leading-none transition-colors duration-200 hover:border-white hover:text-white xl:py-4 md:py-3',
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
                      className="2xl:max-w-[592px] xl:max-w-[616px] lg:max-w-[584px] md:max-w-full"
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

export default Estimates;
