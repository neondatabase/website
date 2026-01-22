import Image from 'next/image';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import MegaLink from 'components/shared/mega-link';
import autoScaling from 'icons/multi-tb/sub-hero/tag-cloud/autoscaling.svg';
import highAvailability from 'icons/multi-tb/sub-hero/tag-cloud/high-availability.svg';
import instantRecovery from 'icons/multi-tb/sub-hero/tag-cloud/instant-recovery.svg';

import TagCloud from '../../use-case/tag-cloud';

import clockCoins from './images/clock-coins.png';

const TAGS = [
  {
    title: 'Instant point-in-time recovery',
    icon: instantRecovery,
  },
  {
    title: 'Built-in high availability',
    icon: highAvailability,
  },
  {
    title: 'Autoscaling of CPU, connections, storage',
    icon: autoScaling,
  },
];

const Hero = () => (
  <section className="sub-hero safe-paddings relative pt-[120px] xl:pt-[112px] lg:pt-24 md:pt-16">
    <Container className="lg:mx-24 md:mx-auto md:max-w-[640px]" size="576">
      <div className="relative mb-4 size-[46px] lg:mb-4 lg:size-10 lg:rounded-[10px] md:mb-0 md:size-14">
        <Image
          className="relative z-10 lg:size-10"
          src={clockCoins}
          alt=""
          width={46}
          height={46}
          quality={100}
          priority
        />
        <span
          className="absolute left-1/2 top-1/2 size-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6AFFE6] opacity-15 blur-xl"
          aria-hidden
        />
      </div>
      <p className="text-[28px] font-medium leading-snug tracking-tighter text-white lg:text-[24px] md:text-[20px]">
        Every minute waiting for that AWS RDS instance to restore is costing your company anywhere
        {` `}
        <br className="hidden md:block" />
        <Link
          className="text-green-45 underline decoration-primary-1 decoration-1 underline-offset-[8px] transition-colors duration-200 hover:text-white hover:decoration-gray-new-60"
          to="https://www.atlassian.com/incident-management/kpis/cost-of-downtime#:~:text=In%20March%202015%2C%20a%2012,also%20the%20financial%20grim%20reaper"
          target="_blank"
          rel="noopener noreferrer"
        >
          from $427 to $9,000
        </Link>
        .
      </p>
      <h2 className="mt-[136px] font-title text-[60px] font-medium leading-none tracking-extra-tight xl:mt-[128px] xl:text-[52px] lg:mt-[112px] lg:text-[44px] md:mt-[74px] md:text-[36px]">
        Break the RDS cycle.
      </h2>
      <div className="mb-7 mt-10 flex flex-col gap-[18px] text-xl font-normal leading-normal tracking-extra-tight text-gray-new-60 lg:mb-6 lg:mt-7 lg:text-[18px] md:mb-[22px] md:mt-6 md:text-base">
        <p>
          <span className="text-white">With AWS RDS</span>, backups and recovery take hours,
          replication lag adds uncertainty, and anticipating workloads feels like a constant gamble.
        </p>
        <p>
          <span className="text-white">Neon eliminates the guesswork</span> — fast, automated
          recovery, real-time replication with minimal lag, and built-in instant autoscaling. With
          Neon, you get:
        </p>
      </div>

      <TagCloud items={TAGS} className="gap-4 lg:mt-4" titleClassName="text-[16px]" />
      <MegaLink
        className="!my-16 xl:!my-14 lg:!my-12 md:!my-10"
        title="The real impact of slow Postgres restores for businesses: lost revenue and customer trust."
        date={new Date('2025-04-11')}
        url="/blog/the-true-cost-of-slow-postgres-restores"
      />
    </Container>
  </section>
);

export default Hero;
