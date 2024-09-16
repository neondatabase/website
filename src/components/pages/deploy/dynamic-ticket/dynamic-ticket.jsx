'use client';

import clsx from 'clsx';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef, useCallback } from 'react';

import usePreviousValue from 'hooks/use-previous-value';
import getShortName from 'utils/get-short-name';

const appearAndExitGradientVariants = {
  initial: {
    opacity: 0,
    translateX: '-100%',
    transition: {
      duration: 0.15,
      ease: 'linear',
    },
  },
  almost: {
    opacity: 1,
    translateX: '0%',
    transition: {
      duration: 0.3,
      ease: 'linear',
    },
  },
  done: {
    translateX: '100%',
    transition: {
      duration: 0.3,
      ease: 'linear',
      transitionEnd: {
        display: 'none',
      },
    },
  },
};

// TODO: fix translateZ opacity bug
// eslint-disable-next-line no-unused-vars
const scaleAndMoveTicketVariants = {
  initial: {
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0, 0.35, 0.35, 1],
    },
  },
  scaleOut: {
    scale: 0.9,
    transition: {
      duration: 0.2,
      ease: [0, 0.35, 0.35, 1],
    },
  },
};

const colorVariants = [
  {
    id: 1,
    title: 'Color variant 1',
    buttonColorClass: 'before:bg-color-picker-variant-1',
  },
  {
    id: 2,
    title: 'Color variant 2',
    buttonColorClass: 'before:bg-color-picker-variant-2',
  },
  {
    id: 3,
    title: 'Color variant 3',
    buttonColorClass: 'before:bg-color-picker-variant-3',
  },
  {
    id: 4,
    title: 'Color variant 4',
    buttonColorClass: 'before:bg-color-picker-variant-4',
  },
];

const DynamicTicket = ({
  isBlankTicket = false,
  withColorPicker = false,
  userData: { id: number, name, image, login: githubHandle, colorSchema },
}) => {
  const { data, status } = useSession();
  const [selectedColorSchema, setSelectedColorSchema] = useState(null);
  const prevColor = usePreviousValue(selectedColorSchema);
  const currentColorSchema = selectedColorSchema || colorSchema || '1';
  const [elephantColorSchema, setElephantColorSchema] = useState(currentColorSchema);
  const gradientControls = useAnimationControls();
  // TODO: fix translateZ opacity bug
  // const ticketControls = useAnimationControls();

  useEffect(() => {
    if (prevColor !== selectedColorSchema && selectedColorSchema) {
      // TODO: fix translateZ opacity bug
      // ticketControls.start('scaleOut').then(() => {
      //   ticketControls.start('initial');
      // });

      gradientControls
        .start('almost')
        .then(() => {
          setElephantColorSchema(selectedColorSchema);
          return gradientControls.start('done');
        })
        .then(() => {
          gradientControls.start('initial');
        });
    }
  }, [prevColor, selectedColorSchema, gradientControls]);

  useEffect(() => {
    if (!selectedColorSchema) return;
    const { userId, colorSchema } = data;

    const updateUserDataTimer = setTimeout(async () => {
      await fetch(`/api/update/user?id=${userId}&colorSchema=${colorSchema}`);
      await fetch(`/api/auth/session?colorSchema=${selectedColorSchema}`);
    }, 1000);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(updateUserDataTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColorSchema]);

  const handleColorClick = async (e) => {
    data.colorSchema = e.target.id;

    // setCurrentColorSchema(e.target.id);
    setSelectedColorSchema(e.target.id);
  };

  const ticketRef = useRef(null);
  const measurementRef = useRef({ x: 0, width: 0 });

  useEffect(() => {
    const gap = getComputedStyle(ticketRef.current).getPropertyValue('--hover-gap-x');
    const { left } = ticketRef.current.getBoundingClientRect();
    const fullWidth = ticketRef.current.clientWidth + gap * 2;

    measurementRef.current = {
      x: left,
      width: fullWidth,
      center: left - gap + fullWidth / 2,
      delta: null,
    };
  }, []);

  const onMouseMove = useCallback((evt) => {
    const currentX = evt.clientX - measurementRef.current.center;
    const OxDelta = Math.round((currentX * 100 * 2) / measurementRef.current.width);
    // eslint-disable-next-line no-nested-ternary
    const normalizedOxDelta = OxDelta < -100 ? -100 : OxDelta > 100 ? 100 : OxDelta;

    if (measurementRef.current.delta === null || measurementRef.current.delta !== OxDelta) {
      measurementRef.current.delta = normalizedOxDelta;
      ticketRef.current.style.setProperty('--delta-x', normalizedOxDelta);
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    ticketRef.current.style.setProperty('--delta-x', 0);
  }, []);

  return (
    <div className="xl:mt-11 lg:mt-10 md:mt-14 md:flex md:flex-col md:gap-y-9">
      <section
        className={clsx('ticket xl:mx-auto', {
          'ticket-blank': isBlankTicket,
          'before:bg-ticket-back-variant-1': currentColorSchema === '1',
          'before:bg-ticket-back-variant-2': currentColorSchema === '2',
          'before:bg-ticket-back-variant-3': currentColorSchema === '3',
          'before:bg-ticket-back-variant-4': currentColorSchema === '4',
        })}
        ref={ticketRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <div
          className={clsx('ticket-back', {
            'bg-ticket-border-variant-0': isBlankTicket,
            'bg-ticket-border-variant-1': currentColorSchema === '1',
            'bg-ticket-border-variant-2': currentColorSchema === '2',
            'bg-ticket-border-variant-3': currentColorSchema === '3',
            'bg-ticket-border-variant-4': currentColorSchema === '4',
          })}
        >
          <div className={clsx('ticket-middle')}>
            <div
              className={clsx('ticket-front', {
                'ticket-front-variant-0': isBlankTicket,
                'ticket-front-variant-1': elephantColorSchema === '1',
                'ticket-front-variant-2': elephantColorSchema === '2',
                'ticket-front-variant-3': elephantColorSchema === '3',
                'ticket-front-variant-4': elephantColorSchema === '4',
              })}
            >
              <div className="ticket-content flex items-start justify-between p-7 pb-6 text-white 2xl:p-6 md:flex-col md:justify-start md:p-5 md:pb-[61px] md:pt-20">
                <header
                  className={clsx(
                    { 'opacity-20': isBlankTicket },
                    'order-2 mb-4 ml-[43px] self-start 2xl:mb-3 2xl:ml-[42px] lg:mb-0 lg:ml-[38px] lg:mt-3 md:ml-0 md:mt-1'
                  )}
                >
                  <h2 className="sr-only">Neon Deploy</h2>
                </header>
                <p
                  className={clsx(
                    { 'opacity-20': isBlankTicket },
                    'order-1 grid grid-cols-[56px_1fr] grid-rows-2 gap-x-4 gap-y-2 lg:grid-cols-[48px_1fr] lg:gap-x-3 md:gap-x-2.5'
                  )}
                >
                  {image ? (
                    <Image
                      src={image}
                      width={56}
                      height={56}
                      alt={`${name || githubHandle}'s profile picture`}
                      className="row-start-1 row-end-3 h-[56px] w-[56px] rounded-full lg:h-[48px] lg:w-[48px]"
                    />
                  ) : (
                    <span className="row-start-1 row-end-3 h-[56px] w-[56px] rounded-full border border-white lg:h-[48px] lg:w-[48px]" />
                  )}
                  <b className="font-sans text-[26px] font-semibold leading-none text-white lg:text-xl md:hidden">
                    {name || githubHandle}
                  </b>
                  <b className="hidden font-sans text-[26px] font-semibold leading-none text-white lg:text-xl md:block">
                    {getShortName(name) || githubHandle}
                  </b>
                  <span className="col-start-2 font-mono text-base font-normal leading-none text-white lg:text-sm">
                    @{githubHandle}
                  </span>
                </p>
                <footer
                  className={clsx(
                    { 'opacity-20': isBlankTicket },
                    'order-3 flex items-center gap-2 md:mt-7'
                  )}
                >
                  <p className="font-kallisto xxs:text-[26px] whitespace-nowrap text-[36px] font-light leading-none tracking-[0.08em] text-white lg:text-3xl md:text-[28px]">
                    #{`${number}`.padStart(6, '0')} /
                  </p>
                  <time
                    dateTime="2023-11-02T10:00"
                    className="whitespace-nowrap text-sm uppercase leading-dense tracking-[0.01em] text-white lg:text-[12px] md:text-[12px]"
                  >
                    10 AM PT,
                    <br />
                    Oct 01, 2024
                  </time>
                </footer>
              </div>
              {status === 'authenticated' && (
                <motion.span
                  initial="initial"
                  animate={gradientControls}
                  variants={appearAndExitGradientVariants}
                  className={clsx('flare absolute left-0 top-0 h-full w-full translate-x-full', {
                    'bg-ticket-flare-variant-1': currentColorSchema === '1',
                    'bg-ticket-flare-variant-2': currentColorSchema === '2',
                    'bg-ticket-flare-variant-3': currentColorSchema === '3',
                    'bg-ticket-flare-variant-4': currentColorSchema === '4',
                  })}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {withColorPicker && (
        <div className="pointer-events-none relative z-10 mt-9 flex items-center gap-6 2xl:mt-8 xl:justify-center lg:mt-7 lg:gap-4 md:mb-7 md:mt-0">
          <p className="text-sm tracking-[0.04em] text-white opacity-80">Pick a color:</p>
          <div className="pointer-events-auto flex gap-5 lg:gap-6">
            {colorVariants.map((item, i) => {
              const { id, title, buttonColorClass } = item;
              const isActive = currentColorSchema === `${id}`;

              return (
                <motion.button
                  className={clsx(
                    'relative flex h-9 w-9 items-center justify-center rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.1)] before:h-4 before:w-4 before:rounded-full',
                    buttonColorClass
                  )}
                  key={i}
                  id={id}
                  disabled={isActive}
                  onClick={handleColorClick}
                >
                  <span className="sr-only">{title}</span>
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        className="absolute left-0 top-0 z-10 h-full w-full rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.5)]"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                        aria-hidden
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

DynamicTicket.propTypes = {
  isBlankTicket: PropTypes.bool,
  withColorPicker: PropTypes.bool,
  userData: PropTypes.exact({
    id: PropTypes.number,
    email: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    login: PropTypes.string,
    colorSchema: PropTypes.string,
  }).isRequired,
};

export default DynamicTicket;
