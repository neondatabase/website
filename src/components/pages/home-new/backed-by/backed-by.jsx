import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import databaseIcon from 'icons/home-new/database.svg';
import databricksIcon from 'icons/home-new/databricks.svg';
import bgNoise from 'images/pages/home-new/backed-by/bg-noise.jpg';

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
    <Container className="z-10" size="1344">
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
                  width={32}
                  height={32}
                  alt=""
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
          <blockquote className="mt-auto font-mono-new text-xl leading-snug tracking-extra-tight text-black xl:text-lg lg:text-[15px]">
            Neon's serverless philosophy is{' '}
            <span className="-mx-1 bg-[#39A57D]/60 px-1">aligned with our vision:</span> no
            infrastructure to manage, no servers to provision, no database cluster to maintain.
            <cite className="mt-5 block text-base not-italic leading-normal text-gray-new-15 xl:text-sm">
              <span className="font-medium">Edouard Bonlieu</span> – Co-founder at Koyeb
            </cite>
          </blockquote>
        </div>
      </div>
      <span
        className={clsx(
          'pointer-events-none absolute -bottom-[300px] -right-[100px] aspect-[0.64] w-[460px]',
          'rotate-[75deg] rounded-[100%] opacity-30  blur-[105px]',
          'bg-[#39A57D]/10 bg-[linear-gradient(0deg,rgba(57,165,125,0.10),rgba(57,165,125,0.10)),radial-gradient(70.97%_70.97%_at_50%_29.03%,#61756C_21.28%,rgba(97,117,108,0.00)_100%)]',
          'xl:-bottom-[400px] xl:-right-[220px] xl:w-[350px] xl:rotate-[30deg]'
        )}
        aria-hidden
      />
    </Container>
    <Image
      className="absolute right-0 top-0 xl:-right-[20%] xl:h-full sm:-right-1/2"
      src={bgNoise}
      alt=""
      width={550}
      height={900}
      quality={100}
    />
  </section>
);

export default BackedBy;
