import React from 'react';
import { useInView } from 'react-intersection-observer';

import BlinkingText from 'components/shared/blinking-text';
import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import LINKS from 'constants/links';

import illustrationLg from './images/saas-illustration-lg.svg';
import Illustration from './saas-illustration';

const SaaS = () => {
  const [wrapperRef, isSectionInView] = useInView({ rootMargin: '100px 0px', triggerOnce: true });
  const [titleRef, isTitleInView, titleEntry] = useInView({ triggerOnce: true, threshold: 0.5 });
  const [illustrationWrapperRef, isIllustrationWrapperInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <section
      id="saas"
      className="safe-paddings bg-black py-[212px] 3xl:py-44 2xl:py-40 xl:py-32 lg:py-24 md:py-20"
      ref={wrapperRef}
    >
      <Container className="z-20 flex items-center justify-between lg:block" size="md">
        <div>
          <Heading id="saas-title" tag="h2" size="lg" theme="white" ref={titleRef}>
            <BlinkingText
              text="Perfect for SaaS"
              parentElement={titleEntry?.target}
              shouldAnimationStart={isTitleInView}
            />
          </Heading>
          <p
            id="saas-description"
            className="t-2xl mt-5 max-w-[600px] text-white 2xl:mt-4 2xl:max-w-[488px] xl:max-w-[400px] lg:max-w-none"
          >
            SaaS companies use Neon to maximize engineering velocity and minimize the cost. Our
            serverless architecture minimizes the cost of maintenance for inactive customers.
            Specifically Neon removes the need to over-provision capacity by fitting the customers
            into the predefined under-utilized instance sizes.
          </p>
          <Button
            id="saas-button"
            className="mt-10 2xl:mt-8 xl:mt-7 md:mt-6"
            to={LINKS.earlyAccess}
            size="md"
            theme="primary"
          >
            Get early access
          </Button>
        </div>

        <div
          id="saas-illustration"
          className="relative 3xl:max-w-[813px] 2xl:max-w-[672px] xl:max-w-[500px] lg:hidden"
          ref={illustrationWrapperRef}
          aria-hidden
        >
          <img
            src="data:image/svg+xml;charset=utf-8,%3Csvg width='976' height='624' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E"
            alt=""
          />
          {isSectionInView && <Illustration isInView={isIllustrationWrapperInView} />}
        </div>

        <img
          className="hidden lg:mt-10 lg:block lg:max-w-[524px] md:max-w-full"
          src={illustrationLg}
          loading="lazy"
          alt=""
          aria-hidden
        />
      </Container>
    </section>
  );
};

export default SaaS;
