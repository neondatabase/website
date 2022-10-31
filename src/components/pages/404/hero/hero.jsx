import { StaticImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import Search from 'components/shared/search';

const CTA = ({ isDocsPage }) =>
  isDocsPage ? (
    <div className="flex w-full flex-col">
      <Search className="my-8" isNotFoundPage />
      <span className="h-px w-full bg-gray-5" />
      <Link className="mt-8 self-start" size="lg" theme="black-primary-1" to="/">
        Back to home
      </Link>
    </div>
  ) : (
    <Button className="mt-11 self-start lg:mt-8 sm:w-full" size="md" theme="primary" to="/">
      Back to Home
    </Button>
  );

CTA.propTypes = {
  isDocsPage: PropTypes.bool,
};

CTA.defaultProps = {
  isDocsPage: false,
};

const Skeleton = () => (
  <div className="mt-6 flex w-full flex-col items-start justify-center space-y-4">
    <span className="skeleton max-w-[410px]" />
    <span className="skeleton max-w-[260px]" />
    <span className="skeleton max-w-[410px]" />
  </div>
);

const Hero = ({ pathname }) => {
  const [isDocsPage, setIsDocsPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsDocsPage(pathname.includes('/docs/'));
    setIsLoading(false);
  }, [pathname]);

  return (
    <section className="grow pt-16 pb-24 lg:pt-0 md:py-14 xs:pt-10">
      <Container className="grid grid-cols-12 items-start gap-x-8 md:gap-x-0 md:gap-y-4" size="md">
        <div className="col-start-2 col-end-6 flex flex-col pt-48 2xl:col-start-1 xl:pt-20 lg:pt-10 md:col-span-full md:pt-0">
          <h1 className="text-[58px] font-bold leading-none xl:text-5xl xl:leading-none md:text-4xl">
            Ooops!
            <br /> Page not found...
          </h1>
          <p className="t-xl mt-7 lg:mt-8">
            Sorry, the page you are looking for doesn’t exist or has been moved.
          </p>

          {isLoading ? <Skeleton /> : <CTA isDocsPage={isDocsPage} />}
        </div>

        <div className="col-start-6 col-end-12 2xl:col-end-13 md:col-span-full">
          <StaticImage
            className="w-full md:mx-auto md:max-w-xl"
            width={860}
            height={862}
            src="./images/illustration.jpg"
            alt="Illustration"
            loading="eager"
          />
        </div>
      </Container>
    </section>
  );
};

Hero.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export default Hero;
