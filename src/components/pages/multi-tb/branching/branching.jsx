import Image from 'next/image';

import Container from 'components/shared/container';
import GradientBorder from 'components/shared/gradient-border';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import branchingDemoMobile from 'images/pages/multi-tb/branching-demo/branching-demo-mobile.jpg';
import glass from 'images/pages/multi-tb/branching-demo/glass.jpg';

import BranchingDemo from './branching-demo';

const STEPS = [
  {
    id: 'step-1',
    name: 'Step #1',
    title: 'Copy your database in milliseconds - regardless of size',
    description:
      "In this demo, you will create a copy of your database, make changes to it, and restore it to the original state in milliseconds. Behind the scenes, you are leveraging Neon's instant branching.",
    button: {
      text: "Let's begin",
      theme: 'primary',
    },
    iconClassName: 'branching-demo-speedometer-icon',
  },
  {
    id: 'step-2',
    name: 'Step #2',
    title: 'Create your own Postgres database',
    description:
      'A Neon database is created in under a second. For now, we have prepared a database for you to copy. Currently, the size of this database is about 4101.57 GiB.',
    button: {
      text: 'Create a copy',
      theme: 'primary',
    },
    iconClassName: 'branching-demo-database-icon',
  },
  {
    id: 'step-3',
    name: 'Step #3',
    title: 'I want to make changes in the copy',
    description:
      "In about 308 ms, your copy of 4101.57 GiB was created. Now, let's make a change to make sure that it is an isolated copy of your original database.",
    button: {
      text: 'Remove selected rows',
      theme: 'red-filled',
    },
    iconClassName: 'branching-demo-clone-icon',
  },
  {
    id: 'step-4',
    name: 'Step #4',
    title: 'I want to make more changes in the copy',
    description:
      "In about 75.49 ms, you dropped a row in your copied database. Now, let's make one more change to make sure that your data is quite different from the original database.",
    button: {
      text: 'Add a random row',
      theme: 'primary',
    },
    iconClassName: 'branching-demo-circle-minus-icon',
  },
  {
    id: 'step-5',
    name: 'Step #5',
    title: 'But... I messed it up!',
    description:
      'In about 29.15 ms, you inserted a row in your copied database. But what if you wanted to restore the initial state?',
    button: {
      text: 'Restore the database',
      theme: 'primary',
    },
    iconClassName: 'branching-demo-circle-plus-icon',
  },
  {
    id: 'step-6',
    name: 'Step #6',
    title: "Yay, it's back!",
    description:
      'In about 964 ms, you restored your copied database of 4101.57 GiB to its original state. Try this on your own data, sign up for Neon.',
    button: {
      text: 'Restart the demo',
      theme: 'gray-20',
    },
    iconClassName: 'branching-demo-restore-icon',
  },
];

const Branching = () => (
  <section className="branching mt-[168px] lg:mt-24 md:mt-[68px]">
    <Container className="lg:mx-24 md:mx-1" size="576" as="header">
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
        className="text-[15px] leading-none tracking-tight text-white"
        withArrow
      >
        Learn more
      </Link>
    </Container>
    <Container
      className="mb-14 mt-[50px] lg:mx-0 lg:mb-12 lg:mt-11 md:mx-0 md:mb-[32px] md:mt-[30px] md:flex md:items-center"
      size="960"
    >
      <div className="relative flex min-h-[486px] flex-col rounded-[10px] bg-[#0A0A0B] lg:min-h-[412px] md:mx-auto md:min-h-min md:w-auto">
        <Image
          className="hidden md:block"
          src={branchingDemoMobile}
          alt=""
          width={480}
          height={435}
          placeholder="blur"
        />
        {/* TODO: Embed Brancing Demo component */}
        <BranchingDemo className="md:hidden" steps={STEPS} />
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
    <Container className="lg:mx-8 md:mx-1" size="768" as="footer">
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
