import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import lineLg from 'images/pages/about/timeline/line-lg.svg';
import lineMd from 'images/pages/about/timeline/line-md.svg';
import lineXl from 'images/pages/about/timeline/line-xl.svg';
import line from 'images/pages/about/timeline/line.svg';
import pointerLineLg from 'images/pages/about/timeline/pointer-line-lg.svg';

const ITEMS = [
  {
    date: 'March, 2021',
    title: 'First Commit',
  },
  {
    date: 'June 15th, 2022',
    title: 'Technical Preview',
    link: `${LINKS.blog}/hello-world`,
  },
  {
    date: 'July, 2022',
    title: '$54M Raised',
    link: `${LINKS.blog}/funding-a1`,
  },
  {
    date: 'December, 2022',
    title: 'Open Access',
    link: `${LINKS.blog}/neon-serverless-postgres-is-live`,
  },
  {
    date: 'August, 2023',
    title: '$46M Raised',
    link: `${LINKS.blog}/series-b-funding`,
  },
  {
    date: 'April 15th, 2024',
    title: 'Neon is Generally Available',
    link: `${LINKS.blog}/neon-ga`,
  },
  {
    date: 'May 14th, 2025',
    title: 'Databricks acquires Neon',
    link: `https://www.databricks.com/company/newsroom/press-releases/databricks-agrees-acquire-neon-help-developers-deliver-ai-systems`,
    isExternal: true,
  },
  {
    className: '2xl:translate-x-[35px]',
    date: 'June 13th, 2025',
    title: 'Databricks launches Lakebase',
    link: `https://www.databricks.com/product/lakebase`,
    isExternal: true,
  },
];

const Point = ({ align, size = 'md' }) => (
  <span
    className={clsx(
      'absolute left-0 h-8 w-[7px] md:-left-1.5 md:bottom-auto md:top-[-9px] md:-rotate-90 ',
      align === 'bottom' ? '-bottom-1 rotate-180' : '-top-1',
      size === 'lg' ? 'left-0.5' : 'left-0'
    )}
    aria-hidden
  >
    <span
      className={clsx(
        'absolute left-1/2 top-[3px] flex h-3.5 w-3.5  -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#00D7E5]',
        size === 'md' ? 'opacity-40 blur-[9px]' : 'opacity-90 blur-[2px] md:left-1 md:top-1'
      )}
    />
    {size === 'md' ? (
      <span className="absolute bottom-0 left-1/2 h-7 w-px -translate-x-1/2 bg-gradient-to-t from-transparent from-[7%] to-[#97FFE0]" />
    ) : (
      <Image
        className="absolute bottom-0 left-0.5 rotate-180 md:left-0"
        src={pointerLineLg}
        width={4}
        height={29}
        alt=""
        priority
      />
    )}
    <span
      className={clsx(
        'absolute rounded-full border border-gray-new-8 shadow-[0px_1px_4px_0px_rgba(0,0,0,.8)]',
        {
          'left-0 top-0 h-2 w-2 bg-[radial-gradient(69%_69%_at_31%_38%,_#9FEEFF_31%,_#1A5A5E_86%)]':
            size === 'md',
          '-left-0.5 -top-0.5 h-3 w-3 bg-[radial-gradient(81%_81%_at_40%_58%,_#9FEEFF_31%,_#1A5A5E_86%)] md:-left-0.5 md:-top-0.5':
            size === 'lg',
        }
      )}
    />
    {size === 'lg' && (
      <span className="absolute -left-px top-px h-[5px] w-[5px] rounded-full bg-[linear-gradient(128deg,#9FFFFF_12.5%,#2B869A_91.75%)] mix-blend-plus-lighter blur-[2px]" />
    )}
  </span>
);

Point.propTypes = {
  align: PropTypes.oneOf(['top', 'bottom']),
  size: PropTypes.oneOf(['md', 'lg']),
};

const Timeline = () => (
  <section className="timeline safe-paddings mt-[136px] overflow-hidden pb-1 pt-10 xl:mt-[110px] lg:mt-[56px] md:mt-4">
    <Container className="relative 2xl:max-w-5xl md:max-w-[544px] md:!px-5" size="1344">
      <span className="pointer-events-none absolute -top-9 left-1/2 h-[230px] w-[300px] translate-x-[60px] bg-[radial-gradient(50%_50%_at_50%_50%,#09212A_0%,#071119_48%,rgba(7,17,25,0)_100%)] 2xl:h-[218px] 2xl:w-[260px] 2xl:translate-x-[30px] xl:translate-x-[-40px] lg:-top-5 lg:h-[170px] lg:w-[272px] lg:translate-x-[-35%] md:-left-14 md:bottom-[140px] md:top-auto md:h-[120px] md:w-[270px] md:translate-x-0" />
      <Image
        className="pointer-events-none absolute left-1/2 top-[105px] -translate-x-1/2 2xl:hidden"
        src={line}
        width={1344}
        height={2}
        alt="timeline"
        priority
      />
      <Image
        className="pointer-events-none absolute left-1/2 top-[105px] hidden -translate-x-1/2 2xl:block lg:hidden"
        src={lineXl}
        width={1024}
        height={2}
        alt="timeline"
        priority
      />
      <Image
        className="pointer-events-none absolute left-1/2 top-[94px] hidden -translate-x-1/2 lg:block md:hidden"
        src={lineLg}
        width={768}
        height={2}
        alt="timeline"
        priority
      />
      <Image
        className="pointer-events-none absolute left-6 top-0 hidden w-0.5 md:block"
        src={lineMd}
        width={2}
        height={604}
        alt="timeline"
        priority
      />
      <ul className="relative z-10 mx-auto flex h-[180px] pl-[92px] pr-6 pt-8 2xl:pl-16 2xl:pr-0 xl:pl-0 lg:h-[163px] lg:max-w-[704px] lg:pl-0 lg:pt-7 md:h-auto md:max-w-none md:flex-col md:gap-y-8 md:pb-10 md:pl-5 md:pt-9">
        {ITEMS.map(({ date, title, className, link, isExternal }, index) => (
          <li
            className={clsx(
              'relative flex h-fit w-[148px] max-w-[148px] flex-col gap-y-2 2xl:max-w-[105px] lg:max-w-[72px] lg:gap-y-1 md:translate-x-0 md:pb-0.5 md:pl-3.5',
              index % 2 === 0
                ? 'mt-auto pt-7 xl:translate-y-[-3px] md:pt-0'
                : 'pb-7 xl:translate-y-[3px] md:pb-0',
              className
            )}
            key={index}
          >
            <span
              className={clsx(
                'whitespace-nowrap text-sm font-light leading-none md:text-[13px]',
                index === ITEMS.length - 1 ? 'text-gray-new-80' : 'text-gray-new-60'
              )}
            >
              {date}
            </span>
            {typeof link === 'undefined' ? (
              <span className="whitespace-nowrap pb-0.5 text-lg font-medium leading-tight tracking-extra-tight text-gray-new-90 xl:text-[14px] lg:text-[13px]">
                {title}
              </span>
            ) : (
              <Link
                className="w-fit whitespace-nowrap border-b border-white/20 pb-px text-lg font-medium leading-tight tracking-extra-tight text-gray-new-90 transition-[border-color,color] duration-300 hover:border-primary-1 2xl:text-[16px] xl:text-[14px] lg:text-[13px]"
                to={link}
                theme="white"
                aria-label={`read more about ${title}`}
                isExternal={isExternal}
              >
                {title}
              </Link>
            )}

            <Point align={index % 2 === 1 ? 'bottom' : 'top'} size="md" />
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Timeline;
