import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';
import migrationAssistantIcon from 'icons/tools/migration-assistant.png';
import upgradeAssessmentIcon from 'icons/tools/upgrade-assessment.png';

const TOOLS = [
  {
    title: 'Upgrade Assessment',
    icon: upgradeAssessmentIcon,
    description:
      'Assess your database against a new Postgres major version and identify changes that could impact your schema.',
    groups: [
      {
        title: 'What it checks',
        items: [
          'Breaking changes between Postgres versions',
          'Schema compatibility',
          'Extension compatibility',
        ],
      },
      {
        title: 'What you get:',
        items: [
          'Issues that affect your database',
          'Guidance on what needs attention',
          'A clearer path to your target version',
        ],
      },
    ],
    href: 'https://neon-postgres-upgrade-assessment.vercel.app/assess',
    action: 'Run an assessment',
  },
  {
    title: 'Migration Assistant',
    icon: migrationAssistantIcon,
    description:
      'Find the migration approach that fits your database size and downtime requirements.',
    groups: [
      {
        title: 'What it considers',
        items: ['Database size', 'Downtime requirements', 'Available migration methods'],
      },
      {
        title: 'What you get:',
        items: [
          'A recommended migration approach',
          'Guidance for your migration',
          'A path from your source database to Neon',
        ],
      },
    ],
    href: `${LINKS.labs}/migrate`,
    action: 'Plan your migration',
  },
];

const Hero = () => (
  <section className="hero pt-40 safe-paddings xl:pt-36 lg:pt-16 md:pt-12">
    <Container size="1344">
      <SectionLabel theme="white">Neon Tools</SectionLabel>
      <h1 className="mt-5 max-w-208 text-[4.5rem] leading-none tracking-tighter text-pretty xl:text-[4rem] lg:max-w-180 lg:text-[3.5rem] md:text-[2.5rem]">
        Upgrade and migrate Postgres with confidence
      </h1>
      <p className="mt-6 max-w-176 text-lg/normal tracking-extra-tight text-pretty text-gray-new-60 md:mt-5 md:text-base">
        Tools to assess major version upgrades, catch compatibility issues, and find the right
        migration path for your database.
      </p>
      <ul className="mt-16 grid scroll-mt-25 grid-cols-2 grid-rows-[auto_auto] border border-gray-new-20 bg-black-pure md:grid-cols-1 md:grid-rows-none">
        {TOOLS.map(({ title, icon, description, groups, href, action }) => (
          <li
            className="row-span-2 grid min-w-0 grid-rows-subgrid first:border-r first:border-gray-new-20 md:row-span-1 md:grid-rows-[auto_auto] md:first:border-r-0 md:first:border-b"
            key={title}
          >
            <div className="border-b border-gray-new-20 bg-gray-new-8/80 px-8 pt-8 pb-9 md:p-6">
              <Image
                className="size-14 md:size-12"
                src={icon}
                width={56}
                height={56}
                alt=""
                loading="eager"
              />
              <h2 className="mt-7 text-[2rem] leading-tight tracking-tighter text-pretty text-white lg:text-[1.75rem]">
                {title}
              </h2>
              <p className="mt-4 max-w-134 text-lg/normal tracking-extra-tight text-pretty text-gray-new-70 lg:text-base">
                {description}
              </p>
            </div>
            <div className="flex grow flex-col items-start px-8 pt-9 pb-8 md:p-6">
              <div className="flex flex-col gap-12 md:gap-8">
                {groups.map(({ title: groupTitle, items }) => (
                  <div key={groupTitle}>
                    <h3 className="font-mono text-[0.9375rem] leading-none font-medium text-gray-new-70 uppercase">
                      {groupTitle}
                    </h3>
                    <ul className="mt-6 flex flex-col gap-4">
                      {items.map((item) => (
                        <li
                          className="flex items-start gap-3 text-lg/normal tracking-extra-tight text-pretty text-white lg:text-base"
                          key={item}
                        >
                          <span className="mt-2.5 ml-1 size-2 shrink-0 bg-green-52 lg:mt-1.25" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-14 md:pt-9">
                <Button size="new" theme="white-filled" to={href} isExternal>
                  {action}
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Hero;
