import Image from 'next/image';

import Container from 'components/shared/container/container';
import LINKS from 'constants/links';
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
  <section className="recovery-solution safe-paddings mt-[126px]">
    <Container className="relative z-10 flex !max-w-[576px] flex-col items-start" size="xxs">
      <h2 className="font-title text-5xl font-medium leading-dense tracking-tighter">
        Reduce your recovery time from hours to seconds
      </h2>

      <ul className="mt-12 flex flex-col gap-y-12">
        {DATA.map(({ icon, title, description }, index) => (
          <li className="flex flex-col gap-y-4" key={index}>
            <Image src={icon} width={28} height={28} alt="" />
            <h3 className="-mt-1 text-[28px] font-medium leading-tight tracking-tighter text-gray-new-94">
              {title}
            </h3>
            <p className="text-lg leading-normal tracking-extra-tight text-gray-new-60">
              {description}
            </p>
          </li>
        ))}
      </ul>

      <p className="with-link-primary mt-12 text-lg leading-snug tracking-extra-tight text-gray-new-90">
        Want to see it in action?{' '}
        <a className="ml-2 tracking-tighter" href={LINKS.demo}>
          Here's a demo →
        </a>
      </p>
    </Container>
  </section>
);

export default RecoverySolution;
