import Image from 'next/image';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import autoScaling from 'icons/multi-tb/sub-hero/tag-cloud/autoscaling.svg';
import highAvailability from 'icons/multi-tb/sub-hero/tag-cloud/high-availability.svg';
import instantRecovery from 'icons/multi-tb/sub-hero/tag-cloud/instant-recovery.svg';

import RelatedArticle from '../related-article';
import TagCloud from '../tag-cloud';

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
  <section className="sub-hero safe-paddings relative pt-[120px] lg:pt-16 md:pt-12">
    <Container className="lg:mx-8 md:mx-1" size="576">
      <div className="relative mb-4 size-[46px] lg:mb-8 lg:size-16 lg:rounded-[14px] md:mb-7 md:size-14">
        <Image
          className="relative z-10 xl:size-10 lg:size-8 md:size-7"
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
      <p className="text-[28px] font-medium leading-snug tracking-tighter text-white">
        Every minute waiting for that AWS RDS instance to restore is costing your company anywhere
        {` `}
        <Link
          className="text-green-45 underline decoration-primary-1 decoration-1 underline-offset-[8px] transition-colors duration-200 hover:text-white hover:decoration-gray-new-60"
          to="/"
        >
          from $427 to $9,000
        </Link>
        .
      </p>
      <h2 className="mt-[136px] font-title text-[60px] font-medium leading-none tracking-extra-tight xl:mt-24 xl:text-[56px] lg:mt-20 lg:max-w-xl lg:text-5xl md:mt-14 md:max-w-full md:text-4xl">
        Break the RDS cycle.
      </h2>
      <div className="mb-7 mt-10 flex flex-col gap-[18px]">
        <p className="text-xl font-normal leading-normal tracking-extra-tight text-gray-new-60">
          <span className="text-white">With AWS RDS</span>, backups and recovery take hours,
          replication lag adds uncertainty, and anticipating workloads feels like a constant gamble.
        </p>
        <p className="text-xl font-normal leading-normal tracking-extra-tight text-gray-new-60">
          <span className="text-white">Neon eliminates the guesswork</span> — fast, automated
          recovery, real-time replication with minimal lag, and built-in instant autoscaling. With
          Neon, you get:
        </p>
      </div>

      <TagCloud items={TAGS} className="gap-4" titleClassName="text-[16px]" />
      <RelatedArticle
        title="The real impact of slow Postgres restores for businesses: lost revenue and customer trust."
        date={new Date('2025-03-27')}
        link="/blog/the-true-cost-of-slow-postgres-restores"
      />
    </Container>
  </section>
);

export default Hero;
