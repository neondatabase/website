import clsx from 'clsx';
import Image from 'next/image';

import Link from 'components/shared/link';

import bgPatternMob from './images/bg-pattern-mob.jpg';
import bgPattern from './images/bg-pattern.jpg';

const PROGRAMS = [
  {
    type: 'Agent Plan',
    title: 'App generation platforms',
    description: 'Custom rates and limits for thousands of databases.',
    url: '/programs/agents',
  },
  {
    type: 'Startup Program',
    title: 'Early-stage startups',
    description: 'Launch faster with up to $100k in credits.',
    url: '/startups',
  },
  {
    type: 'Open Source Program',
    title: 'Open source on Neon',
    description: 'Credits and funding for building on Neon.',
    url: '/programs/open-source',
  },
];

const Programs = () => (
  <div className="relative mt-6 w-full overflow-hidden border border-gray-new-30 lg:mt-4">
    <div className="relative overflow-hidden px-6 py-5">
      <h2 className="relative z-10 text-2xl font-normal leading-snug tracking-extra-tight text-white md:text-xl">
        Special programs
      </h2>
      <Image
        className="pointer-events-none absolute right-0 top-0 h-full w-auto max-w-none md:hidden"
        src={bgPattern}
        alt=""
      />
      <Image
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-auto max-w-none md:block"
        src={bgPatternMob}
        alt=""
      />
    </div>

    <div className="relative -mt-px grid grid-cols-3 gap-x-[18px] border-t border-gray-new-30 lg:grid-cols-2 md:grid-cols-1">
      {PROGRAMS.map(({ type, title, description, url }, index) => (
        <div
          key={index}
          className={clsx(
            'relative flex flex-col px-[18px] py-5',
            'border-l border-r border-gray-new-20',
            'first:border-l-0 first:pl-6 last:border-r-0 last:pr-6',
            'lg:border-r-0 lg:first:border-l-0 lg:first:border-r',
            'lg:last:col-span-2 lg:last:border-l-0 lg:last:border-t',
            'md:border-l-0 md:border-r-0 md:border-t md:first:border-t-0 md:last:col-span-1'
          )}
        >
          <span className="font-mono text-sm font-medium uppercase leading-none text-gray-new-60">
            {type}
          </span>
          <div className="mt-10 flex flex-col gap-1.5">
            <h3 className="text-xl font-normal leading-snug tracking-extra-tight text-white">
              {title}
            </h3>
            <p className="text-lg font-normal leading-snug tracking-extra-tight text-gray-new-50">
              {description}
            </p>
          </div>
          <Link
            className={clsx(
              'mt-5 gap-2 text-base font-medium leading-none tracking-extra-tight',
              'text-gray-new-80 transition-colors hover:text-white',
              '[&_svg]:text-gray-new-60',
              'lg:gap-1.5 lg:text-[15px]'
            )}
            to={url}
            theme="gray-80"
            withArrow
          >
            Learn more <span className="sr-only">about {title}</span>
          </Link>
        </div>
      ))}
    </div>
  </div>
);

export default Programs;
