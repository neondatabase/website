import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import databaseIcon from 'icons/home-new/database.svg';
import databricksIcon from 'icons/home-new/databricks.svg';

import HeadingLabel from '../heading-label';

const ITEMS = [
  {
    icon: databaseIcon,
    title: '40,000+',
    description: 'Databases provisioned daily - built for scale and reliability.',
    className: 'w-[216px] xl:w-48',
  },
  {
    icon: databricksIcon,
    title: 'Databricks',
    description: 'Neon has been part of Databricks Company since May 2025.',
    className: 'w-64 xl:w-[220px]',
  },
];

const BackedBy = () => (
  <section className="backed-by safe-paddings relative overflow-hidden bg-[#E4F1EB] pb-[168px] pt-40 xl:py-[136px] lg:py-[88px] md:py-14">
    <Container size="1344">
      <div className="relative z-10 flex gap-16 xl:gap-[108px] xl:pl-2 lg:gap-8 lg:pl-3.5 md:gap-5 md:p-0 sm:flex-col sm:gap-20">
        <div className="flex-1 border-l border-gray-new-50 px-8 xl:pl-6 xl:pr-0 lg:pl-[18px] sm:border-none sm:pl-0">
          <HeadingLabel className="mb-5 md:mb-4" theme="black">
            Backed by giants
          </HeadingLabel>
          <h2
            className={clsx(
              'text-[44px] leading-dense tracking-tighter text-gray-new-40',
              'xl:text-[36px] lg:text-2xl md:text-xl',
              '[&>strong]:font-normal [&>strong]:text-black'
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
                  alt={title}
                  width={32}
                  height={32}
                />
                <h3 className="text-4xl leading-dense tracking-tighter text-black xl:text-[36px] lg:text-[28px] md:text-[24px]">
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
          <HeadingLabel className="md:mb-4" theme="black">
            Trusted by the best
          </HeadingLabel>
          <blockquote className="mt-auto font-mono text-xl leading-snug tracking-extra-tight text-black xl:text-lg lg:text-[15px]">
            Neon's serverless philosophy is{' '}
            <span className="-mx-1 bg-[#39A57D]/60 px-1">aligned with our vision:</span> no
            infrastructure to manage, no servers to provision, no database cluster to maintain.
            <cite className="mt-5 block text-base not-italic leading-normal text-gray-new-15 xl:text-sm">
              Edouard Bonlieu – Co-founder at Koyeb
            </cite>
          </blockquote>
        </div>
      </div>
      <span
        className={clsx(
          'pointer-events-none absolute right-0 top-0 aspect-[1.4] w-[1360px]',
          '-translate-y-1/2 translate-x-1/2 -rotate-45 rounded-[100%]',
          'bg-[url("/images/pages/home-new/noise-light.png")] bg-[length:380px]',
          '[mask-image:radial-gradient(50%_50%_at_50%_50%,white,transparent)]',
          'xl:w-[1000px] xl:-translate-y-[80%] xl:translate-x-[60%]',
          'lg:w-[900px] md:w-[800px] sm:w-[700px]'
        )}
        aria-hidden
      />
    </Container>
  </section>
);

export default BackedBy;
