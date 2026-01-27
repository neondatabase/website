import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';
import databaseIcon from 'icons/home/database.svg';
import databricksIcon from 'icons/home/databricks.svg';
import bgNoise from 'images/pages/home/backed-by/bg-noise.jpg';


import Quotes from './quotes';

const ITEMS = [
  {
    icon: databaseIcon,
    title: '150,000+',
    description: 'New Postgres compute endpoints provisioned daily.',
    className: 'w-[216px] xl:w-48',
  },
  {
    icon: databricksIcon,
    title: 'Databricks',
    description: 'Neon has been a Databricks Company since May 2025.',
    className: 'w-64 xl:w-[220px]',
  },
];

const BackedBy = () => (
  <section className="backed-by safe-paddings relative overflow-hidden bg-[#E4F1EB] pb-[168px] pt-40 text-black-pure xl:py-[136px] lg:py-[88px] md:py-14">
    <Container className="z-10" size="1344">
      <div className="relative z-10 flex gap-16 xl:gap-[108px] lg:gap-8 md:gap-5 md:p-0 sm:flex-col sm:gap-20">
        <div className="flex-1 border-l border-gray-new-50 px-8 xl:pl-6 xl:pr-0 lg:pl-[18px] sm:border-none sm:pl-0">
          <SectionLabel className="mb-5 md:mb-4">Backed by giants</SectionLabel>
          <h2
            className={clsx(
              'text-[44px] leading-dense tracking-tighter text-gray-new-40',
              'xl:text-[36px] lg:text-2xl md:text-xl',
              '[&>strong]:font-normal [&>strong]:text-black-pure'
            )}
          >
            <strong>Backed by Giants. Trusted Postgres. Battle-tested scale.</strong> Neon was
            founded by Postgres committers, bringing decades of expertise.
          </h2>
          <ul className="mt-[216px] flex gap-[92px] xl:mt-[136px] xl:gap-16 lg:gap-8 md:gap-5 sm:mt-9 xs:flex-col xs:gap-7">
            {ITEMS.map(({ icon, title, description, className }) => (
              <li className={clsx(className, 'lg:w-40 sm:w-[220px]')} key={title}>
                <Image
                  className="mb-5 xl:mb-4 lg:mb-3.5 lg:size-7 md:size-6 sm:size-5"
                  src={icon}
                  width={32}
                  height={32}
                  alt=""
                />
                <h3 className="text-4xl leading-dense tracking-tighter xl:text-[36px] lg:text-[28px] md:text-[24px]">
                  {title}
                </h3>
                <p className="mt-1.5 tracking-extra-tight text-gray-new-40 xl:text-sm xl:leading-snug lg:mt-1 sm:text-balance">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div
          className={clsx(
            'flex w-[480px] flex-col justify-between border-l border-gray-new-50 px-8',
            'xl:w-[340px] xl:pl-5 xl:pr-0 lg:w-64 lg:pl-[18px] sm:w-full sm:border-none sm:pl-0'
          )}
        >
          <SectionLabel className="md:mb-4">Trusted by the best</SectionLabel>
          <Quotes />
        </div>
      </div>
    </Container>
    <Image
      className="pointer-events-none absolute -right-[10%] top-0 h-full 2xl:-right-[20%] sm:-right-1/2"
      src={bgNoise}
      alt=""
      width={1175}
      height={927}
      quality={100}
    />
  </section>
);

export default BackedBy;
