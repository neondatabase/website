'use client';

import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
// import Image from 'next/image';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import links from 'constants/links';

const CTA = () => {
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
    <section className="safe-paddings pt-16">
      <Container className="grid grid-cols-12 items-center gap-4" size="md">
        <div className="z-10 col-span-4 col-start-2 mb-24 xl:col-span-5 xl:col-start-1 lg:mb-12 md:col-span-full">
          <Heading className="whitespace-nowrap md:text-center" tag="h2" size="2sm">
            Still have a <span className="text-pricing-primary-1">question?</span>
          </Heading>
          <p className="mt-4 text-lg font-light leading-snug xl:text-base md:mx-auto md:mt-2 md:max-w-[550px] md:text-center">
            Interested in increasing your free tier limits or learning about pricing? Complete the
            form below to get in touch with our Sales team
          </p>
          <AnimatedButton
            className="mt-8 inline-flex !px-14 !py-5 !text-lg tracking-tight hover:bg-[#00FFAA] xl:!px-11 xl:!py-[17px] lg:mt-6 md:mx-auto md:flex md:w-48"
            theme="primary"
            to={links.contactSales}
            size="sm"
            linesOffsetTop={24}
            linesOffsetSide={24}
            linesOffsetBottom={50}
            isAnimated
          >
            Talk to sales
          </AnimatedButton>
        </div>
        <div
          className="relative col-span-7 col-start-6 self-end md:z-20 md:col-span-full"
          ref={contentRef}
        >
          <img
            className="relative mx-auto min-h-[345px] lg:min-h-0 sm:left-1/2 sm:right-1/2 sm:-ml-[50vw] sm:-mr-[50vw] sm:w-screen sm:min-w-[100vw]"
            src="/images/pages/pricing/cta.jpg"
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

export default CTA;
