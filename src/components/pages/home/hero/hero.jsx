import React, { useRef } from 'react';

import BlinkingText from 'components/shared/blinking-text';
import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import TypingText from 'components/shared/typing-text';
import useLottie from 'hooks/use-lottie';

import animationData from './data/lottie-data.json';

const Hero = () => {
  const titleRef = useRef(null);

  const { animationRef, isAnimationPlaying, animationVisibilityRef } = useLottie({
    lottieOptions: {
      animationData,
      rendererSettings: {
        filterSize: {
          width: '400%',
          height: '400%',
          x: '-100%',
          y: '-100%',
        },
      },
    },
    useInViewOptions: { triggerOnce: false, threshold: [0.8, 0] },
    events: {
      complete() {
        // eslint-disable-next-line react/no-this-in-sfc
        this.loop = true;
        // eslint-disable-next-line react/no-this-in-sfc
        this.playSegments([70, 130], true);
      },
    },
  });

  return (
    <section className="bg-black pt-[322px] safe-paddings 3xl:pt-[243px] 2xl:pt-[207px] xl:pt-[193px] lg:pt-12 md:pt-6">
      <Container className="z-20 flex items-center justify-between lg:flex-col lg:justify-center">
        <div className="relative z-20 max-w-[860px] 3xl:max-w-[750px] 2xl:max-w-[610px] xl:max-w-[535px] lg:text-center">
          <Heading
            id="hero-title"
            className="with-highlighted-text-secondary-2"
            tag="h1"
            size="xl"
            theme="white"
            ref={titleRef}
          >
            <BlinkingText
              parentElement={titleRef.current}
              shouldAnimationStart={isAnimationPlaying}
            >
              {'Zenith is PostgreSQL that is /'.split('').map((letter, index) => (
                <span
                  className="animate-text-blink"
                  style={{ animationPlayState: 'paused' }}
                  key={index}
                >
                  {letter}
                </span>
              ))}{' '}
              <TypingText
                phrases={['Serverless', 'Fault-tolerant', 'Branchable', 'Bottomless']}
                shouldAnimationStart={isAnimationPlaying}
              />
            </BlinkingText>
          </Heading>
          <Button
            id="hero-button"
            className="mt-10 2xl:mt-8 xl:mt-7 md:mt-6"
            to="/"
            size="md"
            theme="primary"
          >
            Get Early Access
          </Button>
        </div>
        <div
          className="!absolute top-[-165px] -right-1 w-[820px] 3xl:w-[677px] 3xl:top-[-122px] 3xl:right-[-17px] 2xl:w-[564px] 2xl:top-[-102px] 2xl:right-[-14px] xl:w-[492px] xl:top-[-88px] xl:right-[-132px] lg:!relative lg:top-0 lg:right-0 lg:w-[451px] lg:-mr-2.5 lg:mt-10 sm:w-[391px] sm:mt-8 xs:w-[294px]"
          ref={animationVisibilityRef}
          aria-hidden
        >
          <img
            src="data:image/svg+xml;charset=utf-8,%3Csvg height='830' width='820' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E"
            alt=""
            aria-hidden
          />
          <div className="absolute top-0 right-0 z-10 w-full" ref={animationRef} />
          <div className="absolute top-1/2 left-1/2 w-[888px] h-[888px] border-2 border-gray-1 rounded-full translate-x-[-51%] translate-y-[-51.6%] 3xl:w-[716px] 3xl:h-[716px] 2xl:w-[600px] 2xl:h-[600px] xl:w-[520px] xl:h-[520px] lg:w-[480px] lg:h-[480px] sm:w-[420px] sm:h-[420px] xs:hidden" />
          <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] border-2 border-gray-1 rounded-full translate-x-[-51%] translate-y-[-51.6%] 3xl:w-[796px] 3xl:h-[796px] 2xl:w-[670px] 2xl:h-[670px] xl:w-[590px] xl:h-[590px] lg:w-[540px] lg:h-[540px] sm:w-[470px] sm:h-[470px] xs:hidden" />
          <div className="absolute top-1/2 left-1/2 w-[1160px] h-[1160px] border-2 border-gray-1 rounded-full translate-x-[-51%] translate-y-[-51.6%] 3xl:w-[924px] 3xl:h-[924px]  2xl:w-[780px] 2xl:h-[780px] xl:w-[700px] xl:h-[700px] lg:w-[630px] lg:h-[630px] sm:w-[520px] sm:h-[520px] xs:hidden" />
          <div
            className="top-[-54px] left-[383px] !translate-x-0 !translate-y-0 circle circle-with-text circle-with-text-right 3xl:top-[-37px] 3xl:left-[310px] 2xl:top-[-42px] 2xl:left-[126px] xl:hidden"
            data-text="Cloudflare Workers"
          />
          <div
            className="top-[89px] right-[81px] !translate-x-0 !translate-y-0 circle circle-with-text circle-with-text-right 3xl:top-[67px] 3xl:right-[81px] 2xl:top-[2px] 2xl:right-[68px] xl:hidden lg:block lg:top-[1px] lg:right-[47px] sm:hidden"
            data-text="Hasura Cloud"
          />
          <div
            className="top-[185px] left-[-5px] !translate-x-0 !translate-y-0 circle circle-with-text circle-with-text-left 3xl:top-[152px] 3xl:left-[4px] 2xl:top-[128px] 2xl:left-[-3px] xl:top-[54px] xl:left-[-9px] lg:top-[97px] lg:left-[-3px] sm:hidden"
            data-text="Gatsby Cloud"
          />
          <div
            className="top-auto bottom-[61px] left-[41px] !translate-x-0 !translate-y-0 circle circle-with-text circle-with-text-left 3xl:left-[39px] 2xl:bottom-[51px] 2xl:left-[25px] xl:bottom-[44px] xl:left-[15px] lg:bottom-[36px] lg:left-[17px] sm:hidden"
            data-text="Netlify"
          />
          <div
            className="top-auto bottom-[-48px] right-[233px] !translate-x-0 !translate-y-0 circle circle-with-text circle-with-text-right 3xl:bottom-[-28px] 3xl:right-[190px] 2xl:bottom-[-29px] 2xl:right-[162px] xl:hidden lg:block lg:right-[131px] sm:hidden"
            data-text="Amazon Lambda"
          />
        </div>
      </Container>
    </section>
  );
};

export default Hero;
