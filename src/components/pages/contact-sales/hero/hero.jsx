'use client';

import clsx from 'clsx';
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion';
import Image from 'next/image';
import React, { useState } from 'react';

import Button from 'components/shared/button';
import Heading from 'components/shared/heading';
import { FORM_STATES } from 'constants/forms';

import ContactForm from './contact-form';
import illustrationPricing from './images/illustration-pricing.png';
import illustrationSuccess from './images/illustration-success.png';

const APPEAR_AND_EXIT_ANIMATION_DURATION = 0.3;

const NoiseFilter = () => (
  <svg className="absolute opacity-0" aria-hidden="true">
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="6" stitchTiles="stitch" />
    </filter>
    <rect x="0" y="0" width="100%" height="100%" fill="#000" />
    <rect x="0" y="0" width="100%" height="100%" fill="#ffffff" filter="url(#noiseFilter)" />
  </svg>
);

const Hero = () => {
  const [formState, setFormState] = useState(FORM_STATES.DEFAULT);

  return (
    <LazyMotion features={domAnimation}>
      <section className="relative grow overflow-hidden bg-black pb-40 pt-44 text-white 2xl:pb-36 2xl:pt-[136px] lg:pb-28 lg:pt-9 md:pb-24">
        <AnimatePresence>
          <m.div
            className="mx-auto min-h-[653px] max-w-[1216px] text-center xl:max-w-[936px] lg:max-w-none lg:px-8 md:min-h-[500px] md:px-4"
            animate={{
              opacity: formState === FORM_STATES.SUCCESS ? 0 : 1,
              height: formState === FORM_STATES.SUCCESS ? 0 : 'auto',
              pointerEvents: formState === FORM_STATES.SUCCESS ? 'none' : 'auto',
              transition: { duration: APPEAR_AND_EXIT_ANIMATION_DURATION },
            }}
          >
            <h1 className="text-[72px] font-bold leading-tight 2xl:text-[56px] 2xl:leading-dense md:text-[36px]">
              Talk to our Sales team
            </h1>
            <p className="mx-auto mt-1.5 max-w-[660px] text-xl 2xl:max-w-[550px] 2xl:text-base md:mt-2">
              Interested in increasing your free tier limits or learning about pricing? Complete the
              form below to get in touch with our Sales team.
            </p>
            <div className="mx-auto mt-16 flex 2xl:mt-12 2xl:max-w-5xl lg:mt-9 lg:max-w-[583px] lg:flex-col lg:space-y-9 md:mt-6 md:space-y-6">
              <div
                className={clsx(
                  'relative w-full max-w-[696px] shrink-0 rounded-[20px] shadow-[0_0_70px_30px_rgb(0_230_153/30%)] 2xl:max-w-[535px] lg:max-w-none sm:shadow-none',
                  'after:pointer-events-none after:absolute after:-inset-40 after:rounded-[22px] after:opacity-10 after:[-webkit-mask-position:center_center] after:[-webkit-mask-repeat:no-repeat] after:[-webkit-mask-size:100%_100%] after:[filter:url("#noiseFilter")] after:[mask-image:url("/images/mask-lg.svg")] xl:after:hidden'
                )}
              >
                <ContactForm formState={formState} setFormState={setFormState} />
              </div>
              <div
                className={clsx(
                  'relative my-9 flex-1 rounded-[20px] font-mono text-black shadow-[0_0_70px_30px_rgb(240_240_117/30%)] lg:my-0 sm:shadow-none',
                  'after:pointer-events-none after:absolute after:-inset-40 after:rounded-[22px] after:opacity-10 after:[-webkit-mask-position:center_center] after:[-webkit-mask-repeat:no-repeat] after:[-webkit-mask-size:100%_100%] after:[filter:url("#noiseFilter")] after:[mask-image:url("/images/mask-md.svg")] xl:after:hidden'
                )}
              >
                <div className="relative z-10 flex h-full w-full flex-col overflow-hidden rounded-r-[20px] bg-secondary-2 pt-10 lg:flex-row lg:rounded-[20px] lg:pt-0 md:flex-col md:items-center">
                  <div className="px-11 lg:order-1 lg:self-center lg:pl-[18px] lg:pr-8 lg:text-left md:order-none md:px-8 md:pl-4 md:pr-4 md:pt-5 md:text-center">
                    <h2
                      className="text-[56px] font-bold leading-none 2xl:text-5xl lg:text-[36px]"
                      style={{
                        background:
                          'linear-gradient(180deg, #1A1A1A 0%, rgba(26, 26, 26, 0.8) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textFillColor: 'transparent',
                      }}
                    >
                      On Demand!
                    </h2>
                    <p className="mt-2.5 text-[23px] font-bold leading-snug text-[#3E3E29] 2xl:text-xl lg:max-w-[208px] md:max-w-none">
                      Only pay for what you use.
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-1/2 w-[620px] -translate-x-1/2 2xl:w-[554px] lg:static lg:-mb-3 lg:-ml-2.5 lg:w-[320px] lg:translate-x-0 lg:pt-2.5 md:-mb-4 md:ml-0 md:mt-4 md:w-[334px] md:pt-0">
                    <Image
                      src={illustrationPricing}
                      alt="Illustration"
                      loading="eager"
                      width={620}
                      height={485}
                    />
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </AnimatePresence>

        <AnimatePresence>
          {formState === FORM_STATES.SUCCESS && (
            <m.div
              className={clsx(
                'absolute top-28 mb-28 flex w-full flex-col items-center text-center lg:top-0 lg:px-8 md:px-4'
              )}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: APPEAR_AND_EXIT_ANIMATION_DURATION },
              }}
              aria-hidden={formState !== FORM_STATES.SUCCESS}
            >
              <Image
                className="sm:w-1/2"
                src={illustrationSuccess}
                width={330}
                height={372}
                loading="lazy"
                alt=""
                aria-hidden
              />
              <Heading size="md" tag="h2">
                Your message has been sent
              </Heading>
              <p className="mt-5 text-xl md:text-lg">
                Thank you for contacting us. We will be in touch shortly.
              </p>
              <Button
                className="relative mt-9 px-9 py-6 !text-lg xl:!text-base"
                theme="primary"
                size="sm"
                to="/"
              >
                <span
                  className="pointer-events-none absolute inset-x-0 top-0 h-[232px] w-full rounded-[32px] opacity-40 blur-[30px] lg:h-[146px] sm:h-[92px]"
                  style={{
                    background: 'linear-gradient(180deg, #00E599 0%, rgba(0, 229, 153, 0) 100%)',
                  }}
                />
                <span className="relative z-10">Back to Home</span>
              </Button>
            </m.div>
          )}
        </AnimatePresence>

        <NoiseFilter />
      </section>
    </LazyMotion>
  );
};

export default Hero;
