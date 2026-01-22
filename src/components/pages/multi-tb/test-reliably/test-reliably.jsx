import Image from 'next/image';

import Container from 'components/shared/container';
import loadTesting from 'icons/multi-tb/test-reliably/tag-cloud/load-testing.svg';
import optimize from 'icons/multi-tb/test-reliably/tag-cloud/optimize.svg';
import reproduceBugs from 'icons/multi-tb/test-reliably/tag-cloud/reproduce-bugs.svg';
import testUpgrades from 'icons/multi-tb/test-reliably/tag-cloud/test-upgrades.svg';

import TagCloud from '../../use-case/tag-cloud';

import database from './images/database.png';

const TAGS = [
  {
    title: 'Reliable load testing',
    icon: loadTesting,
  },
  {
    title: 'Optimize indexes, queries, configs',
    icon: optimize,
  },
  {
    title: 'Test upgrades',
    icon: testUpgrades,
  },
  {
    title: 'Reproduce bugs',
    icon: reproduceBugs,
  },
];

const TestReliably = () => (
  <section className="test-reliably mt-[188px] xl:mt-[168px] lg:mt-[100px] md:mt-[61px]">
    <Container className="lg:mx-0 md:mx-auto md:max-w-[640px]" size="960">
      <div className="flex items-start gap-16 lg:justify-start lg:gap-16 sm:flex-col sm:gap-8">
        <div className="flex-1 xl:mt-1.5 lg:mt-0 sm:w-full">
          <p className="mb-3 text-base font-medium uppercase tracking-wide text-gray-new-50 xl:mb-3 lg:mb-4 lg:text-sm md:mb-[9px] md:text-[12px]">
            Test reliably
          </p>
          <h2 className="text-5xl font-medium leading-tight tracking-[-0.03em] text-gray-new-60 xl:max-w-[860px] xl:text-[44px] lg:text-[36px] md:text-[24px] md:leading-snug md:tracking-tighter">
            Most production issues originate from unreliable tests.{' '}
            <span className="text-white">
              Branch your{' '}
              <span className="relative mx-0.5 -mb-2.5 inline-block xl:mx-0 lg:mx-1 md:-mt-0.5">
                <Image
                  className="relative z-10 lg:size-11 md:-top-[3px] md:size-8"
                  src={database}
                  alt=""
                  width={52}
                  height={52}
                  quality={100}
                />
                <span
                  className="absolute left-1/2 top-1/2 size-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6AFFE6] opacity-15 blur-xl"
                  aria-hidden
                />
              </span>{' '}
              database and test on real data.
            </span>
          </h2>
          <TagCloud
            items={TAGS}
            className="gap-3 lg:mt-[18px] lg:gap-3.5 md:gap-3"
            titleClassName="text-[15px] md:text-sm"
          />
        </div>
      </div>
    </Container>
  </section>
);

export default TestReliably;
