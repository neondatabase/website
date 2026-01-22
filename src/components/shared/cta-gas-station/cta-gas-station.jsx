'use client';

import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import links from 'constants/links';
import sendGtagEvent from 'utils/send-gtag-event';

import illustration from './images/illustration.jpg';

const CTAGasStation = ({ title = '', description = '', buttonText = '', buttonUrl = '' }) => {
  const [contentRef, isContentInView] = useInView({ rootMargin: '50px 0px', triggerOnce: true });
  const {
    rive,
    RiveComponent,
    setContainerRef: setRiveRef,
  } = useRive({
    src: '/animations/pages/pricing/flip-numbers.riv',
    autoplay: false,
    stateMachines: 'SM',
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
    onLoad: () => {
      rive?.resizeDrawingSurfaceToCanvas();
    },
  });

  useEffect(() => {
    if (rive && isContentInView) {
      rive.play();
    }
  }, [rive, isContentInView]);

  return (
    <section className="safe-paddings bg-black-pure pt-16">
      <Container className="grid grid-cols-12 items-center gap-4" size="md">
        <div className="z-10 col-span-4 col-start-2 mb-24 xl:col-span-5 xl:col-start-1 lg:mb-12 md:col-span-full">
          <Heading
            className="whitespace-nowrap md:text-center [&>strong]:font-medium [&>strong]:text-green-45"
            tag="h2"
            size="2sm"
            asHTML
          >
            {title || 'Still have <span class="text-green-45">questions?</span>'}
          </Heading>
          <p className="mt-4 text-lg font-light leading-snug xl:text-base md:mx-auto md:mt-2 md:max-w-[550px] md:text-center">
            {description ||
              'Interested in learning more about our plans and pricing? Complete the form below to get in touch with our Sales team.'}
          </p>
          <AnimatedButton
            className="mt-8 inline-flex !px-14 !py-5 !text-lg tracking-tight hover:bg-[#00FFAA] xl:!px-11 xl:!py-[17px] lg:mt-6 md:mx-auto md:flex md:w-48"
            theme="primary"
            to={buttonUrl || links.contactSales}
            size="sm"
            linesOffsetTop={24}
            linesOffsetSide={24}
            linesOffsetBottom={50}
            isAnimated
            onClick={() => {
              sendGtagEvent('pricing_cta_click');
            }}
          >
            {buttonText || 'Talk to Sales'}
          </AnimatedButton>
        </div>
        <div
          className="relative col-span-7 col-start-6 self-end md:z-20 md:col-span-full"
          ref={contentRef}
        >
          <Image
            className="relative mx-auto min-h-[345px] lg:min-h-0 sm:left-1/2 sm:right-1/2 sm:-ml-[50vw] sm:-mr-[50vw] sm:w-screen sm:min-w-[100vw]"
            src={illustration}
            width={842}
            height={538}
            loading="lazy"
            alt=""
          />
          <div ref={setRiveRef}>
            {isContentInView ? (
              <RiveComponent
                className="absolute left-1/2 top-[184px] h-[140px] w-[89px] -translate-x-1/2 2xl:top-[142px] 2xl:h-[140px] 2xl:w-[74px] xl:top-[124px] xl:h-[78px] xl:w-[58px] lg:hidden"
                width={74}
                height={140}
                aria-hidden
              />
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
};

CTAGasStation.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  buttonUrl: PropTypes.string,
};

export default CTAGasStation;
