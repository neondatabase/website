import Image from 'next/image';

import Container from 'components/shared/container';
import costEffective from 'icons/migration/grid-features/cost-effective.svg';
import developerFriendly from 'icons/migration/grid-features/developer-friendly.svg';
import easy from 'icons/migration/grid-features/easy.svg';
import fullyManaged from 'icons/migration/grid-features/fully-managed.svg';
import reliability from 'icons/migration/grid-features/reliability.svg';
import serverlessAutoscaling from 'icons/migration/grid-features/serverless-autoscaling.svg';

const ITEMS = [
  {
    title: 'Easy',
    description: 'Simplify the life of developers with a serverless consumption model.',
    icon: easy,
  },
  {
    title: 'Reliability',
    description: 'S3 durability, multi-AZ redundancy, and point-in-time recovery.',
    icon: reliability,
  },
  {
    title: 'Cost-effective',
    description: 'With pay-as-you-go pricing that ties costs directly to usage.',
    icon: costEffective,
  },
  {
    title: 'Fully managed',
    description: 'Neon handles all database tasks — backups, updates, failovers.  ',
    icon: fullyManaged,
  },
  {
    title: 'Serverless & Autoscaling',
    description: 'Handles spiky workloads without intervention or overprovisioning.',
    icon: serverlessAutoscaling,
  },
  {
    title: 'Developer-friendly',
    description: 'Features like branching allows teams to automate tasks via CI/CD.',
    icon: developerFriendly,
  },
];

const GridFeatures = () => (
  <section className="grid-features safe-paddings pt-[185px] xl:pt-[162px] lg:pt-[136px] md:pt-[96px]">
    <Container className="md:px-5 sm:!max-w-sm" size="960">
      <header className="mx-auto flex max-w-[640px] flex-col items-center gap-3 text-center lg:max-w-[560px] md:max-w-[500px]">
        <h2 className="font-title text-5xl font-medium leading-none tracking-extra-tight xl:text-[44px] lg:text-4xl md:text-balance md:text-[32px]">
          Why teams migrate to Neon
        </h2>
        <p className="text-lg leading-snug tracking-extra-tight text-gray-new-70 lg:max-w-[480px] lg:text-base">
          Neon provides a serverless, fully managed Postgres built for modern development — fast,
          reliable, and cost-effective.
        </p>
      </header>
      <ul className="mx-1 mt-[57px] grid grid-cols-3 gap-x-11 gap-y-10 xl:mx-auto xl:max-w-[832px] lg:mx-16 lg:mt-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-10 md:mx-0 sm:grid-cols-1">
        {ITEMS.map(({ title, description, icon }) => (
          <li key={title}>
            <Image
              className="relative mb-[18px]"
              src={icon}
              alt=""
              width={22}
              height={22}
              quality={100}
            />
            <h3 className="text-xl font-semibold leading-dense tracking-extra-tight lg:text-lg lg:tracking-tighter">
              {title}
            </h3>
            <p
              className="mt-2 text-pretty text-lg tracking-extra-tight text-gray-new-70 lg:text-base"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default GridFeatures;
