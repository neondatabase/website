import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

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
  <section className="timeline safe-paddings overflow-hidden pb-[200px] pt-40 xl:pb-[184px] xl:pt-[136px] lg:pb-[136px] lg:pt-[88px] md:pb-[104px] md:pt-[72px]">
    <Container className="w-full" size="1600">
      <h2
        className="mb-20 max-w-[1024px] indent-24 font-sans text-5xl font-normal leading-dense tracking-tighter xl:text-4xl lg:mb-14 lg:indent-16 lg:text-[28px] md:mb-11 md:indent-0 md:text-2xl"
        tag="h2"
        theme="white"
        size="md-about-us"
      >
        Our mission{' '}
        <span className="text-gray-new-60">
          is to deliver Postgres as a cloud service designed to help teams build scalable,
          dependable applications faster than ever.
        </span>
      </h2>
      <div className="relative h-[284px] w-full xl:h-[264px] lg:h-64 md:h-[189px] md:min-w-[545px]">
        <ol className="grid h-full w-full grid-cols-[repeat(5,minmax(0,243fr))_320fr] xl:grid-cols-[repeat(5,minmax(0,152fr))_200fr] lg:grid-cols-[repeat(5,minmax(0,112fr))_147fr] md:grid-cols-[repeat(5,minmax(0,86fr))_114fr]">
          {ITEMS.map((item, index) => (
            <li
              key={index}
              className={clsx(
                '-ml-px flex h-[170px] flex-col gap-y-[10px] border-l border-gray-new-30 pl-[18px] xl:h-40 xl:pl-4 lg:h-[150px] md:h-[110px] md:gap-y-[6px] md:pl-[14px]',
                index % 2 === 0 ? 'justify-end self-end' : 'self-start'
              )}
            >
              <time
                dateTime={item.dateTime}
                className="whitespace-nowrap font-mono text-base font-normal leading-none tracking-extra-tight text-gray-new-50 xl:text-sm md:text-xs"
              >
                {item.date}
              </time>
              <p
                className={clsx(
                  'text-xl font-normal leading-snug tracking-extra-tight text-white xl:text-lg md:text-[15px]',
                  index !== ITEMS.length - 1 && 'whitespace-nowrap'
                )}
              >
                {item.link ? (
                  <Link href={item.link} theme="white" isExternal={item.isExternal}>
                    {item.title}
                  </Link>
                ) : (
                  item.title
                )}
              </p>
            </li>
          ))}
        </ol>
        <div>
          <button />
          <button />
        </div>
        <Image
          className="absolute bottom-[114px] -z-10 h-14 w-full object-fill xl:bottom-[104px] lg:bottom-[106px] lg:h-11 md:bottom-[79px] md:h-8 md:min-w-full"
          width={1536}
          height={56}
          src="/images/pages/about/timeline22222222.svg"
          aria-hidden="true"
          alt=""
        />
      </div>
    </Container>
  </section>
);

export default Timeline;
