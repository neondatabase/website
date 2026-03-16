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
  <section
    id="backed-by-giants"
    className="backed-by relative overflow-hidden bg-[#E4F1EB] pt-40 safe-paddings pb-[168px] text-black-pure md:py-14 lg:py-[88px] xl:py-[136px]"
  >
    <Container className="z-10" size="1344">
      <div className="relative z-10 flex gap-16 sm:flex-col sm:gap-20 md:gap-5 md:p-0 lg:gap-8 xl:gap-[108px]">
        <div className="flex-1 border-l border-gray-new-50 px-8 sm:border-none sm:pl-0 lg:pl-[18px] xl:pr-0 xl:pl-6">
          <SectionLabel className="mb-5 md:mb-4">Backed by giants</SectionLabel>
          <h2
            className={clsx(
              'text-[44px] leading-dense tracking-tighter text-gray-new-40',
              'md:text-xl lg:text-2xl xl:text-[36px]',
              '[&>strong]:font-normal [&>strong]:text-black-pure'
            )}
          >
            <strong>Trusted Postgres, Backed by Giants.</strong> Neon was founded by Postgres
            committers, bringing decades of expertise. In 2025, Neon became a Databricks company.
          </h2>
          <ul className="mt-[216px] flex gap-[92px] sm:mt-9 md:gap-5 lg:gap-8 xl:mt-[136px] xl:gap-16 xs:flex-col xs:gap-7">
            {ITEMS.map(({ icon, title, description, className }) => (
              <li className={clsx(className, 'sm:w-[220px] lg:w-40')} key={title}>
                <Image
                  className="mb-5 sm:size-5 md:size-6 lg:mb-3.5 lg:size-7 xl:mb-4"
                  src={icon}
                  width={32}
                  height={32}
                  alt=""
                />
                <h3 className="text-4xl leading-dense tracking-tighter md:text-[24px] lg:text-[28px] xl:text-[36px]">
                  {title}
                </h3>
                <p className="mt-1.5 tracking-extra-tight text-gray-new-40 sm:text-balance lg:mt-1 xl:text-sm xl:leading-snug">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div
          className={clsx(
            'flex w-[480px] flex-col justify-between border-l border-gray-new-50 px-8',
            'sm:w-full sm:border-none sm:pl-0 lg:w-64 lg:pl-[18px] xl:w-[340px] xl:pr-0 xl:pl-5'
          )}
        >
          <SectionLabel className="md:mb-4">Trusted by the best</SectionLabel>
          <Quotes />
        </div>
      </div>
    </Container>
    <Image
      className="pointer-events-none absolute top-0 -right-[10%] h-full sm:-right-1/2 2xl:-right-[20%]"
      src={bgNoise}
      alt=""
      width={1175}
      height={927}
      quality={100}
    />
  </section>
);

export default BackedBy;
