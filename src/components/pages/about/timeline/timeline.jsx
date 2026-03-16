'use client';

import clsx from 'clsx';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import TimelineSvg from 'images/pages/about/timeline/timeline.inline.svg';

const ITEMS = [
  {
    date: 'MAR, 2021',
    dateTime: '2021-03',
    title: 'First commit',
  },
  {
    date: 'JUN 15, 2022',
    dateTime: '2022-06-15',
    title: 'Technical preview',
    link: `${LINKS.blog}/hello-world`,
  },
  {
    date: 'DEC, 2022',
    dateTime: '2022-12',
    title: 'Open access',
    link: `${LINKS.blog}/neon-serverless-postgres-is-live`,
  },
  {
    date: 'AUG, 2023',
    dateTime: '2023-08',
    title: '$46M raised',
    link: `${LINKS.blog}/series-b-funding`,
  },
  {
    date: 'APR 15, 2024',
    dateTime: '2024-04-15',
    title: 'Neon is GA',
    link: `${LINKS.blog}/neon-ga`,
  },
  {
    date: 'MAY 14, 2025',
    dateTime: '2025-05-14',
    title: 'Databricks acquires Neon',
    link: `https://www.databricks.com/company/newsroom/press-releases/databricks-agrees-acquire-neon-help-developers-deliver-ai-systems`,
    isExternal: true,
  },
];

const Timeline = () => (
  <section className="timeline overflow-hidden pt-40 safe-paddings pb-[200px] md:pt-[72px] md:pb-[104px] lg:pt-[88px] lg:pb-[136px] xl:pt-[136px] xl:pb-[184px]">
    <Container size="1600">
      <h2 className="mb-20 max-w-5xl indent-24 font-sans text-5xl leading-dense font-normal tracking-tighter md:mb-11 md:indent-0 md:text-2xl lg:mb-14 lg:indent-16 lg:text-[28px] xl:text-4xl">
        Our mission is to deliver Postgres{' '}
        <span className="text-gray-new-50">
          as a cloud service designed to help teams build scalable, dependable applications faster
          than ever.
        </span>
      </h2>
      <div className="no-scrollbars w-full sm:-mx-5 sm:-mt-2 sm:w-screen sm:overflow-x-auto sm:pb-2">
        <div className="relative h-[284px] w-full sm:mx-5 md:h-[189px] md:min-w-[545px] lg:h-64 xl:h-[264px]">
          <ol className="grid h-full w-full grid-cols-[repeat(5,minmax(0,243fr))_320fr] md:grid-cols-[repeat(5,minmax(0,86fr))_114fr] lg:grid-cols-[repeat(5,minmax(0,112fr))_147fr] xl:grid-cols-[repeat(5,minmax(0,152fr))_200fr]">
            {ITEMS.map((item, index) => (
              <li
                key={index}
                className={clsx(
                  '-ml-px border-l border-gray-new-30',
                  index % 2 === 0 ? 'self-end' : 'self-start'
                )}
              >
                <div
                  className={clsx(
                    'relative flex h-[170px] flex-col gap-y-2.5 pl-[18px] md:h-[110px] md:gap-y-1.5 md:pl-3.5 lg:h-[150px] xl:h-40 xl:gap-y-2 xl:pl-4',
                    index % 2 === 0 && 'justify-end'
                  )}
                >
                  <time
                    dateTime={item.dateTime}
                    className="font-mono text-base leading-none font-normal tracking-extra-tight whitespace-nowrap text-gray-new-50 md:text-xs xl:text-sm"
                  >
                    {item.date}
                  </time>
                  {item.link ? (
                    <Link
                      className={clsx(
                        'relative text-xl leading-snug font-normal tracking-extra-tight text-white md:text-[15px] xl:text-lg',
                        'underline decoration-white/40 decoration-dashed decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-200 hover:decoration-white',
                        'after:absolute after:-inset-1.5',
                        index !== ITEMS.length - 1 && 'whitespace-nowrap'
                      )}
                      to={item.link}
                      isExternal={item.isExternal}
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <p
                      className={clsx(
                        'text-xl leading-snug font-normal tracking-extra-tight text-white md:text-[15px] xl:text-lg',
                        index !== ITEMS.length - 1 && 'whitespace-nowrap'
                      )}
                    >
                      {item.title}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <TimelineSvg className="absolute bottom-[114px] -z-10 h-14 w-full object-fill md:bottom-[79px] md:h-8 lg:bottom-[106px] lg:h-11 xl:bottom-[104px]" />
        </div>
      </div>
    </Container>
  </section>
);

export default Timeline;
