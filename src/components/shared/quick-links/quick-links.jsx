'use client';

import clsx from 'clsx';
import Link from 'next/link';
import PropTypes from 'prop-types';

import Chevron from 'icons/chevron-right-lg.inline.svg';

const content = {
  'start-here': [
    {
      id: 1,
      href: 'https://neon.com/docs/guides/partner-get-started?utm_source=chatgpt.com',
      label: 'Get started with your integration',
      type: 'Docs',
    },
    {
      id: 2,
      href: 'https://neon.com/docs/reference/api-reference',
      label: 'From idea to full stack app in one conversation with Create',
      type: 'Case Study',
    },
    {
      id: 3,
      href: 'https://neon.com/docs/guides/partner-consumption-limits',
      label:
        'Databutton Just Made Their Agent Smarter, with Postgres and Auth Built In фыв фыв ыфв фыв фыв фыв фыв',
      type: 'Case Study',
    },
    {
      id: 4,
      href: 'https://neon.com/docs/guides/partner-consumption-metrics',
      label: 'Explore the Neon API',
      type: 'Docs',
    },
    {
      id: 5,
      href: 'https://neon.com/blog/replit-app-history-powered-by-neon-branches',
      label: 'Configure consumption limits',
      type: 'Docs',
    },
  ],
};

const QuickLinks = ({ type = 'start-here', className }) => {
  const links = content[type] || [];

  return (
    <section className={clsx('quick-links', className)}>
      <ul className="!m-0 !p-0">
        {links.map(({ id, href, label, type }, index) => {
          const isFirst = index === 0;
          const isLast = index === links.length - 1;

          return (
            <li
              key={id}
              className={clsx(
                '!m-0 border-x border-b border-[#27272A] !p-4 transition before:!content-none hover:bg-[#27272A80]',
                {
                  'border-t': isFirst,
                  'rounded-t-lg': isFirst,
                  'rounded-b-lg': isLast,
                }
              )}
            >
              <Link
                href={href}
                className="flex justify-between border-none !text-gray-new-98"
                target="_blank"
              >
                <div className="flex max-w-[calc(100%-64px)] flex-col gap-2.5 md:max-w-[calc(100%-32px)]">
                  {type && (
                    <span className="text-sm leading-none tracking-tight text-green-45">
                      {type}
                    </span>
                  )}
                  <span className="truncate  text-xl font-medium leading-snug tracking-tight">
                    {label}
                  </span>
                </div>
                <Chevron className="w-2 text-gray-new-50" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

QuickLinks.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
};

export default QuickLinks;
