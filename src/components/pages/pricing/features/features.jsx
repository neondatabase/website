import Image from 'next/image';

import Container from 'components/shared/container/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import authIcon from 'icons/pricing/features/auth.svg';
import cableIcon from 'icons/pricing/features/cable.svg';
import checkIcon from 'icons/pricing/features/check.svg';
import complianceIcon from 'icons/pricing/features/compliance.svg';
import copyIcon from 'icons/pricing/features/copy.svg';
import gridIcon from 'icons/pricing/features/grid.svg';
import scaleIcon from 'icons/pricing/features/scale.svg';
import searchIcon from 'icons/pricing/features/search.svg';

const DATA = [
  {
    icon: checkIcon,
    title: 'High availability',
    description: 'Storage uses multi-AZ to minimize disruptions without HA standbys.',
    link: `${LINKS.docs}/introduction/high-availability`,
  },
  {
    icon: copyIcon,
    title: 'Read replicas',
    description: 'Offload read-heavy workloads to replicas, avoiding storage costs.',
    link: `${LINKS.blog}/neon-read-replicas-in-the-wild-how-beatgig-uses-them`,
  },
  {
    icon: scaleIcon,
    title: 'Autoscaling',
    description: 'Neon automatically adjusts compute and storage as needed.',
    link: LINKS.autoscaling,
  },
  {
    icon: searchIcon,
    title: 'Monitoring',
    description: 'Monitor resource usage in real time with optimization dashboards.',
    link: `${LINKS.docs}/introduction/monitoring-page`,
  },
  {
    icon: cableIcon,
    title: 'Connection pooling',
    description: 'Built on pgBouncer, ready to scale to 10,000 connections.',
    link: LINKS.connectionPooling,
  },
  {
    icon: gridIcon,
    title: 'Postgres extensions library',
    description: 'Extend with pg_search, PostGIS, TimescaleDB, etc.',
    link: `${LINKS.docs}/extensions/pg-extensions`,
  },
  {
    icon: authIcon,
    title: 'Neon Auth',
    description: 'Simple setup, built right into the platform — no added overhead.',
    link: LINKS.auth,
  },
  {
    icon: complianceIcon,
    title: 'GDPR and ISO compliance',
    description: 'Visit our Security page for more information.',
    link: LINKS.security,
  },
];

const Features = () => (
  <section className="features mt-[192px] scroll-mt-5 px-safe xl:mt-40 lg:mt-36 md:mt-28">
    <Container size="1152" className="xl:px-16 md:px-5">
      <h2 className="text-center font-title text-[52px] font-medium leading-none tracking-extra-tight xl:text-5xl lg:text-4xl md:text-[32px]">
        Features in all Neon databases
      </h2>
      <ul className="mx-auto mt-14 grid grid-cols-4 justify-center gap-x-10 gap-y-11 xl:grid-cols-3 lg:mt-12 lg:max-w-[640px] lg:grid-cols-2 lg:gap-10 md:gap-[34px] sm:mt-10 xs:grid-cols-1">
        {DATA.map(({ icon, title, description, link }) => (
          <li className="sm:max-w-[260px]" key={title}>
            <Image className="size-6" src={icon} width={24} height={24} alt="" loading="lazy" />
            <h3 className="mt-2.5 text-xl font-medium leading-snug tracking-extra-tight md:text-lg sm:mt-2">
              {title}
            </h3>
            <p className="mt-2 leading-snug tracking-extra-tight text-gray-new-70 md:mt-1.5">
              {description}
            </p>
            <Link
              href={link}
              className="mt-4 text-[15px] leading-none tracking-[-0.03em]"
              theme="white"
              withArrow
            >
              Read more
              <span className="sr-only">about {title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Features;
