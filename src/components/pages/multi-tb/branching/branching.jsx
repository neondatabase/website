import Image from 'next/image';

import Container from 'components/shared/container';
import GradientBorder from 'components/shared/gradient-border';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import branchingDemoMobile from 'images/pages/multi-tb/branching-demo/branching-demo-mobile.jpg';
import glass from 'images/pages/multi-tb/branching-demo/glass.jpg';

import BranchingDemo from './branching-demo';

const Branching = () => (
  <section className="branching mt-[168px] overflow-hidden pb-[100px] lg:mt-24 md:mt-[68px]">
    <Container className="max-w-3xl lg:mx-24 md:mx-auto md:max-w-sm" size="576" as="header">
      <h2 className="pr-28 font-title text-[60px] font-medium leading-[90%] tracking-extra-tight text-white xl:max-w-[500px] xl:text-[52px] lg:max-w-[380px] lg:pr-20 lg:text-[40px] md:pr-10 md:text-[36px] md:leading-none">
        Recover multi-TB in seconds.
      </h2>
      <p className="mb-3.5 mt-6 text-balance text-lg leading-snug tracking-extra-tight text-gray-new-60 lg:mb-3 lg:mt-5 lg:text-base md:mb-2 md:mt-4 md:text-wrap">
        Neon has a unique storage architecture that records the entire history of your database.
        This allows you to revert to any point in time instantly, without duplicating data or
        replaying WAL.
      </p>
      <Link
        to={LINKS.docsBranching}
        className="text-[15px] leading-none tracking-tight"
        theme="white"
        withArrow
      >
        Learn more
      </Link>
    </Container>
    <Container
      className="mb-14 mt-[50px] lg:mx-0 lg:mb-12 lg:mt-11 md:mx-0 md:mb-[32px] md:mt-[30px] md:flex md:items-center"
      size="960"
    >
      <div className="relative flex h-[486px] flex-col rounded-[10px] bg-[#0A0A0B] lg:mx-auto lg:h-[412px] lg:max-w-[704px] md:mx-auto md:h-auto md:w-auto">
        <div className="relative hidden shrink-0 overflow-hidden rounded-xl lg:w-[384px] md:block">
          <Image
            className="sm:w-full"
            src={branchingDemoMobile}
            alt=""
            width={480}
            height={435}
            placeholder="blur"
          />
          <GradientBorder withBlend />
        </div>
        <BranchingDemo className="md:hidden" />
        <div
          className="branching-demo-glass absolute -left-[8px] -top-[8px] -z-20 h-[calc(100%+16px)] w-[calc(100%+16px)] overflow-hidden rounded-[14px] md:hidden"
          aria-hidden
        >
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src={glass}
            alt=""
            width={976}
            height={502}
            placeholder="blur"
          />
          <GradientBorder withBlend />
        </div>
        <span className="absolute -right-[208px] -top-[230px] -z-30 size-[643px] bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(74,88,172,0.24)_0%,_rgba(74,88,172,0.00)_100%)] opacity-90" />
        <span className="absolute -bottom-[181px] -left-[181px] -z-30 size-[565px] bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(7,125,148,0.25)_0%,_rgba(7,125,148,0.00)_100%)] opacity-90" />
      </div>
    </Container>
    <Container className="max-w-3xl lg:mx-8 md:mx-auto md:max-w-sm" size="768" as="footer">
      <ul className="flex flex-row gap-16 text-balance text-2xl font-normal leading-snug tracking-extra-tight text-gray-new-60 lg:text-xl md:flex-col md:gap-6 md:text-pretty md:pr-10 md:text-lg">
        <li className="flex-1">
          <p>
            <span className="text-white">For teams.</span> You have a reliable safety net protecting
            you against accidental errors.
          </p>
        </li>
        <li className="flex-1">
          <p>
            <span className="text-white">For businesses.</span> You prevent downtimes, preserving
            customer trust and SLAs.
          </p>
        </li>
      </ul>
    </Container>
  </section>
);

export default Branching;
