import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container/container';
import GradientBorder from 'components/shared/gradient-border/index';
import configurationTuning from 'icons/migration/cards-support/configuration-tuning.svg';
import dualWriteModel from 'icons/migration/cards-support/dual-write-model.svg';
import logicalReplication from 'icons/migration/cards-support/logical-replication.svg';
import phasedCutover from 'icons/migration/cards-support/phased-cutover.svg';
import schemaAdjustments from 'icons/migration/cards-support/schema-adjustments.svg';
import versionMigrations from 'icons/migration/cards-support/version-migrations.svg';

const ITEMS = [
  {
    title: 'Perform a production migration without causing any downtime',
    description:
      'Large, production-scale migrations can be daunting, but Neon’s approach minimizes risk and downtime.',
    list: [
      {
        icon: logicalReplication,
        text: 'Logical replication',
      },
      {
        icon: dualWriteModel,
        text: 'Dual-write model',
      },
      {
        icon: phasedCutover,
        text: 'Phased cutover',
      },
    ],
    className: 'bg-migration-card-left-bg',
  },
  {
    title: 'Optimize Postgres for cost efficiency and performance',
    description:
      'A large migration is a great moment to also address key optimization areas improve compatibility and efficiency.',
    list: [
      {
        icon: versionMigrations,
        text: 'Version migrations',
      },
      {
        icon: configurationTuning,
        text: 'Configuration tuning',
      },
      {
        icon: schemaAdjustments,
        text: 'Schema adjustments',
      },
    ],
    className: 'bg-migration-card-right-bg',
  },
];

const CardsSupport = () => (
  <section className="cards-support safe-paddings pt-[137px] xl:pt-[113px] lg:pt-[90px] md:pt-[26px]">
    <Container className="md:px-5" size="768">
      <header className="mx-auto flex flex-col items-center text-center">
        <h2 className="max-w-md font-title text-5xl font-medium leading-none tracking-extra-tight xl:text-[44px] lg:max-w-[380px] lg:text-4xl md:max-w-[280px] md:text-[32px] md:tracking-tighter">
          Multi-TB migrations? Get expert support
        </h2>
        <p className="mt-3 text-lg leading-snug tracking-extra-tight text-gray-new-70 lg:text-base">
          Our team is here to guide you through even the most complex scenarios.
        </p>
      </header>
      <ul className="mt-12 grid grid-cols-2 gap-5 lg:mt-10 md:mt-8 sm:grid-cols-1 xs:gap-3">
        {ITEMS.map(({ title, description, list, className }) => (
          <li
            key={title}
            className={clsx('relative rounded-xl bg-black-fog p-7 lg:p-6 md:p-5', className)}
          >
            <h3 className="mb-2.5 text-balance text-xl font-medium leading-snug tracking-tight text-white lg:text-lg md:tracking-extra-tight">
              {title}
            </h3>
            <p
              className="text-pretty text-base font-normal leading-normal tracking-extra-tight text-gray-new-60 lg:text-[15px]"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <div
              className="my-6 h-px w-full bg-white mix-blend-overlay lg:my-5 md:my-[18px]"
              aria-hidden
            />
            <ul className="flex flex-col gap-[18px]">
              {list.map(({ icon, text }) => (
                <li key={text} className="flex items-center gap-2.5">
                  <Image src={icon} alt="" width={20} height={20} quality={100} />
                  <p className="text-base font-medium leading-none tracking-snug text-white lg:text-[15px]">
                    {text}
                  </p>
                </li>
              ))}
            </ul>
            <GradientBorder withBlend />
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default CardsSupport;
