'use client';

import { useState } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';

const METHODS = [
  {
    title: 'Import Data Assistant',
    action: 'Start',
    href: `${LINKS.console}/app/projects`,
    docs: '/docs/import/import-data-assistant',
  },
  {
    title: 'pg_dump + pg_restore',
    action: 'Open Neon Console',
    href: LINKS.console,
    docs: '/docs/import/migrate-from-postgres',
  },
  {
    title: 'Logical replication',
    action: 'Start',
    href: '/docs/guides/logical-replication-guide#replicate-data-to-neon',
    docs: '/docs/guides/logical-replication-guide',
  },
];

const GROUPS = [
  {
    title: 'Requirements',
    rows: [
      { label: 'Database size', values: ['< 10 GB', '10–200 GB', '> 200 GB'] },
      { label: 'Downtime', values: ['Minutes', 'Minutes to hours', 'Seconds'] },
    ],
  },
  {
    title: 'Migration experience',
    rows: [
      { label: 'Best for', values: ['Small databases', 'Medium databases', 'Large databases'] },
      {
        label: 'Key benefit',
        values: [
          'No CLI or tooling required',
          'Simple & well understood',
          'Near-zero downtime cutover',
        ],
      },
    ],
  },
  {
    title: 'Considerations',
    rows: [
      {
        label: 'Data movement',
        values: [
          'Runs on Neon infrastructure',
          'Full pg_dump fidelity',
          'Old and new run in parallel',
        ],
      },
      {
        label: 'Keep in mind',
        values: [
          '~10 GB size cap',
          'Downtime scales with database size',
          'Requires replica identity; some objects don’t replicate',
        ],
      },
    ],
  },
];

const MigrationMethods = () => {
  const [hasScrolled, setHasScrolled] = useState(false);

  return (
    <section
      className="migration-methods mt-50 safe-paddings xl:mt-40 lg:mt-30 md:mt-20"
      aria-labelledby="migration-methods-title"
    >
      <Container size="1344">
        <header className="max-w-256">
          <SectionLabel theme="white">Upgrade assessment</SectionLabel>
          <h2
            className="mt-5 text-[4rem] leading-none font-normal tracking-[-0.05em] text-pretty xl:text-[3.5rem] lg:text-[3rem] md:mt-4 md:text-[2.25rem]"
            id="migration-methods-title"
          >
            Choose the right migration method for your database and requirements
          </h2>
        </header>
        <div
          data-scrolled={hasScrolled}
          className="relative mt-24 lg:mt-16 lg:-mr-8 lg:after:pointer-events-none lg:after:absolute lg:after:inset-y-0 lg:after:left-48 lg:after:z-20 lg:after:w-6 lg:after:bg-[linear-gradient(to_right,rgba(5,5,5,0.8),transparent)] lg:after:opacity-0 lg:after:transition-opacity lg:after:duration-200 lg:after:content-[''] lg:data-[scrolled=true]:after:opacity-100 md:mt-10 md:-mr-5 md:after:left-32"
        >
          {/* Keyboard users need to focus the overflow region to scroll the comparison. */}
          <div
            className="no-scrollbars overflow-x-auto overscroll-x-contain focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-45"
            onScroll={(event) => setHasScrolled(event.currentTarget.scrollLeft > 0)}
            role="region"
            aria-label="Migration methods comparison, scroll horizontally to compare all methods"
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
          >
            <table className="w-full table-fixed border-separate border-spacing-0 text-left text-base/snug tracking-extra-tight lg:min-w-252 md:min-w-212">
              <caption className="sr-only">Compare migration methods for your database</caption>
              <colgroup>
                <col className="w-1/4 lg:w-48 md:w-32" />
                {METHODS.map(({ title }) => (
                  <col className="w-1/4 lg:w-68 md:w-60" key={title} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" className="lg:sticky lg:left-0 lg:z-10 lg:bg-black-pure">
                    <span className="sr-only">Feature</span>
                  </th>
                  {METHODS.map(({ title, action, href, docs }) => (
                    <th className="pb-15 pl-4 align-top font-normal" scope="col" key={title}>
                      <div className="max-w-60">
                        <h3 className="text-2xl/snug tracking-tighter xl:text-xl">{title}</h3>
                        <Button
                          className="mt-5 w-full text-sm font-normal"
                          size="sm-new"
                          theme="outlined"
                          to={href}
                          aria-label={`${action}: ${title}`}
                        >
                          {action}
                        </Button>
                        <Link
                          className="mt-3.5 flex gap-2 text-sm/none font-medium text-white"
                          to={docs}
                          arrowClassName="h-3 w-4 text-gray-new-70"
                          aria-label={`View Neon docs: ${title}`}
                          withArrow
                        >
                          View Neon docs
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              {GROUPS.map(({ title, rows }, groupIndex) => (
                <tbody key={title}>
                  <tr>
                    <th
                      className={`${groupIndex === 0 ? 'pt-0' : 'pt-10'} pb-5 text-lg/[1.5625rem] font-medium tracking-tighter lg:sticky lg:left-0 lg:z-10 lg:bg-black-pure`}
                      scope="rowgroup"
                    >
                      {title}
                    </th>
                    <td colSpan={3} />
                  </tr>
                  {rows.map(({ label, values }) => (
                    <tr
                      className="*:shadow-[inset_0_1px_0_#242628] last:*:shadow-[inset_0_1px_0_#242628,inset_0_-1px_0_#242628]"
                      key={label}
                    >
                      <th
                        className="py-3.5 pr-4 align-top font-normal text-gray-new-90 lg:sticky lg:left-0 lg:z-10 lg:bg-black-pure"
                        scope="row"
                      >
                        {label}
                      </th>
                      {values.map((value, columnIndex) => (
                        <td className="py-3.5 pl-4 align-top text-gray-new-80" key={value}>
                          <span
                            className={
                              label === 'Keep in mind'
                                ? ['block max-w-53', 'block max-w-54', 'block max-w-52'][
                                    columnIndex
                                  ]
                                : 'block pr-4'
                            }
                          >
                            {value}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default MigrationMethods;
