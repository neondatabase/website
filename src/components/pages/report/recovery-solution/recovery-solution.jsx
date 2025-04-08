import Image from 'next/image';

import Container from 'components/shared/container/container';
import dbIcon from 'icons/report/db-icon.svg';
import restoreIcon from 'icons/report/restore-icon.svg';

const DATA = [
  {
    description:
      'Restoring large Postgres databases can take hours with snapshots and WAL. HA standbys help with infra issues but not with drops, corruption, or lagging replicas.',
    title: 'Neon is a Postgres platform that supports instant PITR — even for multi-TB databases.',
    icon: dbIcon,
  },
  {
    description:
      'The magic trick? Instant branching. Neon lets you instantly branch from any past state — no WAL replay or full restore needed. It references existing storage at a specific moment, making recovery instant. Spin up a branch, recover data, and merge it back — all without downtime.',
    title: 'Neon takes a fundamentally different approach to recovery.',
    icon: restoreIcon,
  },
];

const RecoverySolution = () => (
  <section className="recovery-solution safe-paddings mt-[126px] xl:mt-28 sm:mt-24">
    <Container
      className="relative z-10 flex !max-w-xl flex-col items-start lg:!max-w-[642px]"
      size="xxs"
    >
      <h2 className="font-title text-5xl font-medium leading-dense tracking-tighter xl:text-[44px] lg:max-w-[440px] lg:text-[40px] sm:text-[32px]">
        Reduce your recovery time from hours to seconds
      </h2>

      <ul className="mt-12 flex flex-col gap-y-12 lg:mt-10 lg:gap-y-10 sm:mt-7 sm:gap-y-6">
        {DATA.map(({ icon, title, description }, index) => (
          <li className="flex flex-col gap-y-4 lg:gap-y-[18px] sm:gap-y-4" key={index}>
            <Image src={icon} width={28} height={28} alt="" />
            <h3 className="-mt-1 text-[28px] font-medium leading-tight tracking-tighter text-gray-new-94 lg:text-[24px] sm:text-[20px]">
              {title}
            </h3>
            <p className="text-lg leading-normal tracking-extra-tight text-gray-new-60 sm:text-base">
              {description}
            </p>
          </li>
        ))}
      </ul>

      <p className="with-link-primary mt-12 text-lg leading-snug tracking-extra-tight text-gray-new-90 lg:mt-10 sm:mt-7 sm:text-base">
        Want to see it in action?{' '}
        <a
          className="ml-2 tracking-tighter"
          href="https://fyi.neon.tech/branching"
          target="_blank"
          rel="noreferrer"
        >
          Here's a demo →
        </a>
      </p>
    </Container>
  </section>
);

export default RecoverySolution;
