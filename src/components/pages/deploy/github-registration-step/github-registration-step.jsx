'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

import DynamicTicket from 'components/pages/deploy/dynamic-ticket';
import Button from 'components/shared/button';
import GithubIcon from 'components/shared/header/images/header-github.inline.svg';

const appearAndExitAnimationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const GithubRegistrationStep = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <div className="col-span-4 col-start-1 self-center 2xl:col-start-1 xl:col-span-full xl:self-end xl:text-center">
        <h2 className="text-[62px] font-semibold leading-none tracking-[-0.05em] text-white xl:mx-auto xl:max-w-[420px] xl:text-center md:text-[52px]">
          You’re invited. <br />
          Grab the ticket.
        </h2>
        <p className="mt-5 font-mono text-[1.15rem] font-light leading-tight tracking-tight text-white 2xl:max-w-[420px] xl:mx-auto xl:max-w-xl xl:text-center xl:text-lg xl:leading-[1.375] xl:tracking-tighter lg:mt-4 lg:text-base">
          Generate a unique ticket image with your GitHub profile and participate in Neon's giveaway
          right after the conference.
        </p>
        <div className="mt-11 flex items-center xl:mt-10 xl:flex-col lg:mt-8 md:mt-6">
          <Button
            className="relative z-30 px-11 py-[22px] text-xl tracking-[-0.02em] xl:px-9 lg:px-8"
            theme="with-icon"
            rel="noopener noreferrer"
            target="_blank"
            disabled={isLoading}
            isAnimated
            onClick={() => {
              setIsLoading(true);
              signIn('github');
            }}
          >
            <AnimatePresence>
              {isLoading ? (
                <motion.div
                  className="absolute left-3 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full bg-transparent"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={appearAndExitAnimationVariants}
                  aria-hidden
                >
                  <div className="h-[40px] w-[40px] rounded-full" />
                  <svg
                    className="absolute left-1/2 top-1/2 h-[40px] w-[40px]"
                    width="58"
                    height="58"
                    viewBox="0 0 58 58"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ transform: 'scale(1, -1) rotate(-90deg) translate(-50%, -50%)' }}
                  >
                    <motion.path
                      d="M3 29C3 43.3594 14.6406 55 29 55C43.3594 55 55 43.3594 55 29C55 14.6406 43.3594 3 29 3C14.6406 3 3 14.6406 3 29Z"
                      strokeLinecap="round"
                      stroke="black"
                      strokeWidth="5"
                      initial={{ pathLength: 0 }}
                      animate={{
                        pathLength: 1,
                        transition: { duration: 2, delay: 0.2, repeat: Infinity },
                      }}
                    />
                  </svg>
                </motion.div>
              ) : (
                <GithubIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-black"
                  width={40}
                  height={40}
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>
            <span>Generate with GitHub</span>
          </Button>
          <span className="relative z-10 ml-5 max-w-[140px] shrink-0 text-sm leading-[1.375] tracking-[0.04em] text-gray-5 xl:ml-0 xl:mt-3 xl:max-w-full sm:mt-2">
            Only public data <br className="xl:hidden" /> is going to be used.
          </span>
        </div>
      </div>
      <div className="col-span-6 col-start-5 self-center 2xl:col-start-6 xl:col-span-full xl:-ml-10 xl:ml-0 xl:mr-0 xl:self-start">
        <DynamicTicket
          userData={{
            id: 0,
            name: 'Your Name',
            image: '',
            login: 'github-account',
            colorSchema: '0',
          }}
          isBlankTicket
        />
      </div>
    </>
  );
};

export default GithubRegistrationStep;
