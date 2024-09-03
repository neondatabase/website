'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';

import illustration from './images/illustration.png';

const Search = dynamic(() => import('components/shared/inkeep-search'), { ssr: false });

const CTA = ({ isDocsPage = false }) =>
  isDocsPage ? (
    <div className="flex w-full flex-col">
      <Search
        className="DocSearch-notFound my-8"
        indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
      />
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

const Skeleton = () => (
  <div className="mt-6 flex w-full flex-col items-start justify-center space-y-4">
    <span className="skeleton max-w-[410px]" />
    <span className="skeleton max-w-[260px]" />
    <span className="skeleton max-w-[410px]" />
  </div>
);

const Hero = () => {
  const pathname = usePathname();
  const [isDocsPage, setIsDocsPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsDocsPage(pathname.includes('/docs/'));
    setIsLoading(false);
  }, [pathname]);

  return (
    <section className="grow pb-24 pt-16 dark:bg-black-pure dark:text-white lg:pt-0 md:py-14 xs:pt-10">
      <Container className="grid grid-cols-12 items-start gap-x-8 md:gap-x-0 md:gap-y-4" size="md">
        <div className="col-start-2 col-end-6 flex flex-col pt-48 2xl:col-start-1 xl:pt-20 lg:pt-10 md:col-span-full md:pt-0">
          <h1 className="font-title text-[58px] font-medium leading-none xl:text-5xl xl:leading-none md:text-4xl">
            Ooops!
            <br /> Page not found...
          </h1>
          <p className="t-xl mt-7 lg:mt-8">
            Sorry, the page you are looking for doesn’t exist or has been moved.
          </p>

          {isLoading ? <Skeleton /> : <CTA isDocsPage={isDocsPage} />}
        </div>

        <div className="col-start-6 col-end-12 2xl:col-end-13 md:col-span-full">
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

export default Hero;
