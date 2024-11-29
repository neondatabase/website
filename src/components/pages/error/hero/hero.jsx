'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import InkeepTrigger from 'components/shared/inkeep-trigger';
import Link from 'components/shared/link';

import illustration from './images/illustration.png';

const CTA = ({ isDocsPage = false, reset }) =>
  isDocsPage ? (
    <div className="flex w-full flex-col">
      <InkeepTrigger className="my-8 w-full" isNotFoundPage />
      <Link className="whitespace-nowrap" size="sm" theme="green" to="/" withArrow>
        Back to Home
      </Link>
    </div>
  ) : (
    <div className="mt-11 flex items-center gap-6 lg:mt-8 lg:gap-4 sm:mt-6">
      {reset ? (
        <>
          <Button size="xs" theme="primary" withArrow onClick={reset}>
            Try again
          </Button>
          <Link className="whitespace-nowrap" size="sm" theme="green" to="/" withArrow>
            Back to Home
          </Link>
        </>
      ) : (
        <Button size="xs" theme="primary" to="/">
          Back to Home
        </Button>
      )}
    </div>
  );

CTA.propTypes = {
  isDocsPage: PropTypes.bool,
  reset: PropTypes.func,
};

const Skeleton = () => (
  <div className="mt-6 flex w-full flex-col items-start justify-center space-y-4">
    <span className="skeleton max-w-[410px]" />
    <span className="skeleton max-w-[260px]" />
    <span className="skeleton max-w-[410px]" />
  </div>
);

const Hero = ({ title, text, reset }) => {
  const pathname = usePathname();
  const [isDocsPage, setIsDocsPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsDocsPage(pathname.includes('/docs/'));
    setIsLoading(false);
  }, [pathname]);

  return (
    <section className="flex grow flex-col pb-24 pt-16 dark:bg-black-pure dark:text-white lg:pt-0 md:py-14 xs:pt-10">
      <Container
        className="grid grow grid-cols-12 items-center gap-x-8 md:gap-x-0 md:gap-y-4"
        size="md"
      >
        <div className="col-start-2 col-end-6 flex flex-col 2xl:col-start-1 lg:col-end-7 md:col-span-full">
          <h1 className="font-title text-[58px] font-medium leading-none xl:text-5xl xl:leading-none lg:text-4xl">
            Ooops!
            <br />
            {title}
          </h1>
          <p className="t-xl mt-7 max-w-md sm:mt-4">{text}</p>
          {isLoading ? <Skeleton /> : <CTA isDocsPage={isDocsPage} reset={reset} />}
        </div>

        <div className="col-start-6 col-end-12 2xl:col-end-13 lg:col-start-7 md:col-span-full">
          <Image
            className="w-full md:mx-auto md:max-w-xl"
            width={860}
            height={862}
            src={illustration}
            alt="Illustration"
            loading="eager"
            quality={75}
          />
        </div>
      </Container>
    </section>
  );
};

Hero.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  reset: PropTypes.func,
};

export default Hero;
