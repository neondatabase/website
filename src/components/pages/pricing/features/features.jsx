import Image from 'next/image';

import Container from 'components/shared/container';
import LINKS from 'constants/links';
import authIcon from 'icons/pricing/features/auth.svg';
import autoscalingIcon from 'icons/pricing/features/autoscaling.svg';
import branchingIcon from 'icons/pricing/features/branching.svg';
import connectionsIcon from 'icons/pricing/features/connections.svg';
import dataApiIcon from 'icons/pricing/features/data-api.svg';
import extensionsIcon from 'icons/pricing/features/extensions.svg';
import functionsIcon from 'icons/pricing/features/functions.svg';
import securityIcon from 'icons/pricing/features/security.svg';
import storageIcon from 'icons/pricing/features/storage.svg';
import { cn } from 'utils/cn';

const FEATURES = [
  {
    icon: storageIcon,
    title: 'High availability.',
    description: `Neon’s storage is <a href="${LINKS.docsHighAvailability}">multi-AZ</a> by default, without the need for HA standbys.`,
  },
  {
    icon: branchingIcon,
    title: 'Branching.',
    description: `Create <a href="${LINKS.docsBranching}">instant copy-on-write branches</a> of your database, with auth, Object Storage, and Functions branching alongside it, for previews, tests, and agents.`,
  },
  {
    icon: autoscalingIcon,
    title: 'Autoscaling and scale to zero.',
    description: `Compute <a href="${LINKS.autoscaling}">adjusts to load</a> and scales to zero when idle, including on the Free plan.`,
  },
  {
    icon: connectionsIcon,
    title: 'Connection pooling and read replicas.',
    description: `Up to <a href="${LINKS.connectionPooling}">10,000 pooled connections</a> per compute with built-in PgBouncer, and <a href="${LINKS.docs}/introduction/read-replicas">read replicas</a> without added storage costs.`,
  },
  {
    icon: extensionsIcon,
    title: 'Postgres extensions.',
    description: `Add extensions like <a href="${LINKS.docsExtensionsPgVector}">pgvector</a>, <a href="${LINKS.docsExtensionsPostgisRelatedExtensions}">PostGIS</a>, <a href="${LINKS.docsExtensionsTimescaledb}">TimescaleDB</a>, and many more.`,
  },
  {
    icon: authIcon,
    title: 'Managed Better Auth.',
    description: `<a href="${LINKS.auth}">Authentication</a> based on Better Auth that stores users in your database and branches with it.`,
  },
  {
    icon: dataApiIcon,
    title: 'Data API.',
    description: `Query your database over HTTP with a <a href="${LINKS.dataApi}">managed REST API</a>, no backend server required.`,
  },
  {
    icon: functionsIcon,
    title: 'Object Storage and Functions.',
    description: `S3-style <a href="${LINKS.objectStorageOverview}">Object Storage</a> and <a href="${LINKS.functionsOverview}">Functions</a> in every project, with Free plan allowances, plus <a href="${LINKS.realtime}">Realtime</a> in beta.`,
  },
  {
    icon: securityIcon,
    title: 'Compliance.',
    description: `Neon is ISO 27001 and 27701 certified, SOC 2 audited, and GDPR and CCPA compliant. HIPAA is available on Scale. See our <a href="${LINKS.security}">Security page</a>.`,
  },
];

const Features = () => (
  <section className="features mt-[200px] scroll-mt-5 px-safe xl:mt-[184px] lg:mt-40 md:mt-[104px]">
    <Container size="1152" className="px-8">
      <h2
        className={cn(
          'indent-24 text-5xl leading-dense tracking-tighter text-pretty text-gray-new-50 lg:indent-16 md:indent-0',
          'xl:px-8 xl:text-[40px] lg:px-5 lg:text-[28px] lg:text-wrap md:text-[24px] sm:px-0',
          '[&>strong]:font-normal [&>strong]:text-white'
        )}
      >
        <strong>Included in every Neon project, on every plan, by default.</strong> Lakebase
        Postgres and the backend around it, with high availability and compliance built in.
      </h2>
      <ul
        className={cn(
          'mt-16 -ml-8 grid grid-cols-3 gap-x-[85px]',
          'xl:ml-0 xl:gap-x-5 xl:pr-5',
          'lg:mt-12 lg:grid-cols-2 md:mt-10 sm:grid-cols-1 sm:gap-y-7'
        )}
      >
        {FEATURES.map(({ icon, title, description }) => (
          <li
            className={cn(
              'flex flex-col gap-[18px] border-l border-gray-new-20',
              'py-2 pl-8 nth-[n+4]:pt-14',
              'xl:px-6 xl:py-0 xl:nth-[n+4]:pt-10',
              'lg:gap-4 lg:px-[18px] lg:py-1.5 lg:nth-[n+3]:pt-[38px]',
              'md:border-0 sm:gap-3 sm:p-0!'
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
            <div className="text-lg/normal tracking-extra-tight lg:text-base lg:leading-snug sm:text-[15px]">
              <h3 className="inline text-white">{title}</h3>{' '}
              <p
                className={cn(
                  'inline text-gray-new-50',
                  '[&_a]:border-b [&_a]:border-dashed [&_a]:border-white/40 [&_a]:text-gray-new-70',
                  '[&_a]:transition-colors [&_a]:duration-200',
                  '[&_a:hover]:border-gray-new-70'
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
