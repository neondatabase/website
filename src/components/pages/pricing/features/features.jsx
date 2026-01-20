import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import LINKS from 'constants/links';
import authIcon from 'icons/pricing/features/auth.svg';
import autoscalingIcon from 'icons/pricing/features/autoscaling.svg';
import connectionsIcon from 'icons/pricing/features/connections.svg';
import extensionsIcon from 'icons/pricing/features/extensions.svg';
import monitoringIcon from 'icons/pricing/features/monitoring.svg';
import replicasIcon from 'icons/pricing/features/replicas.svg';
import securityIcon from 'icons/pricing/features/security.svg';
import storageIcon from 'icons/pricing/features/storage.svg';

const FEATURES = [
  {
    icon: storageIcon,
    title: 'High availability.',
    description: `Storage uses <a href="${LINKS.docsHighAvailability}">multi-AZ</a> to minimize disruptions without HA standbys.`,
  },
  {
    icon: replicasIcon,
    title: 'Read replicas.',
    description: `Offload read-heavy <a href="${LINKS.docs}/introduction/read-replicas">workloads to replicas</a>, avoiding storage costs.`,
  },
  {
    icon: autoscalingIcon,
    title: 'Autoscaling.',
    description: `Neon automatically <a href="${LINKS.autoscaling}">adjusts compute</a> and storage as needed.`,
  },
  {
    icon: monitoringIcon,
    title: 'Monitoring.',
    description: `Monitor resource usage in <a href="${LINKS.docs}/introduction/monitoring-page">real time</a> with optimization dashboards.`,
  },
  {
    icon: connectionsIcon,
    title: 'Connection pooling.',
    description: `Built on pgBouncer, ready to scale to <a href="${LINKS.connectionPooling}">10,000 connections</a>.`,
  },
  {
    icon: extensionsIcon,
    title: 'Postgres extensions library.',
    description: `Extend with <a href="${LINKS.pgSearch}">pg_search</a>, PostGIS, TimescaleDB, etc.`,
  },
  {
    icon: authIcon,
    title: 'Neon auth.',
    description: `Simple setup, built right <a href="${LINKS.auth}">into the platform</a> — no added overhead.`,
  },
  {
    icon: securityIcon,
    title: 'GPDR and ISO compliance.',
    description: `Visit our <a href="${LINKS.security}">Security page</a> for more information.`,
  },
];

const Features = () => (
  <section className="features mt-[200px] scroll-mt-5 px-safe xl:mt-[184px] lg:mt-40 md:mt-[104px]">
    <Container size="1152" className="px-8">
      <h2
        className={clsx(
          'text-pretty indent-24 text-5xl leading-dense tracking-tighter text-gray-new-50',
          'xl:px-8 xl:text-[40px] lg:text-wrap lg:px-5 lg:indent-16 lg:text-[28px] md:indent-0 md:text-[24px] sm:px-0',
          '[&>strong]:font-normal [&>strong]:text-white'
        )}
      >
        <strong>Powerful and essential features </strong>
        that are consistently available in every Neon database, regardless of configuration or plan.
      </h2>
      <ul
        className={clsx(
          '-ml-8 mt-16 grid grid-cols-3 gap-x-[85px]',
          'xl:ml-0 xl:gap-x-5 xl:pr-5',
          'lg:mt-12 lg:grid-cols-2 md:mt-10 sm:grid-cols-1 sm:gap-y-7'
        )}
      >
        {FEATURES.map(({ icon, title, description }) => (
          <li
            className={clsx(
              'flex flex-col gap-[18px] border-l border-gray-new-20',
              'py-2 pl-8 [&:nth-child(n+4)]:pt-14',
              'xl:px-6 xl:py-0 xl:[&:nth-child(n+4)]:pt-10',
              'lg:gap-4 lg:px-[18px] lg:py-1.5 lg:[&:nth-child(n+3)]:pt-[38px]',
              'md:border-0 sm:gap-3 sm:!p-0'
            )}
            key={title}
          >
            <Image
              className="size-6 lg:size-5 sm:size-4"
              src={icon}
              width={24}
              height={24}
              alt=""
              loading="lazy"
            />
            <div className="text-lg tracking-extra-tight lg:text-base lg:leading-snug sm:text-[15px]">
              <h3 className="inline text-white">{title}</h3>{' '}
              <p
                className={clsx(
                  'inline text-gray-new-50',
                  '[&_a]:border-b [&_a]:border-dashed [&_a]:border-gray-new-70 [&_a]:text-gray-new-70',
                  '[&_a]:transition-colors [&_a]:duration-200',
                  '[&_a:hover]:border-green-52 [&_a:hover]:text-green-52'
                )}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Features;
