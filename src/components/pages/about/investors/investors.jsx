import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import ajeetSingh from 'images/pages/about/investors/ajeet-singh.jpg';
import andyPavlo from 'images/pages/about/investors/andy-pavlo.jpg';
import databricks from 'images/pages/about/investors/databricks.svg';
import eladGil from 'images/pages/about/investors/elad-gil.jpg';
import foundersFund from 'images/pages/about/investors/founders-fund.svg';
import generalCatalyst from 'images/pages/about/investors/general-catalyst.svg';
import guillermoRauch from 'images/pages/about/investors/guillermo-rauch.jpg';
import khoslaVentures from 'images/pages/about/investors/khosla-ventures.svg';
import menloVentures from 'images/pages/about/investors/menlo-ventures.svg';
import mikeOvitz from 'images/pages/about/investors/mike-ovitz.jpg';
import natFriedman from 'images/pages/about/investors/nat-friedman.jpg';
import notable from 'images/pages/about/investors/notable.svg';
import ramtinNaimi from 'images/pages/about/investors/ramtin-naimi.jpg';
import snowflake from 'images/pages/about/investors/snowflake.svg';
import sorenBrammerSchmidt from 'images/pages/about/investors/soren-brammer-schmidt.jpg';
import wesMcKinney from 'images/pages/about/investors/wes-mckinney.jpg';

const investors = {
  companies: [
    {
      logo: notable,
      width: 135,
      label: 'Notable',
    },
    {
      logo: generalCatalyst,
      width: 303,
      label: 'General Catalyst',
    },
    {
      className: 'md:order-1',
      logo: menloVentures,
      width: 92,
      label: 'Menlo Ventures',
    },
    {
      className: 'md:order-2',
      logo: snowflake,
      width: 180,
      label: 'Snowflake',
    },
    {
      className: 'md:order-0',
      logo: khoslaVentures,
      width: 256,
      label: 'Khosla Ventures',
    },
    {
      className: 'lg:order-3',
      logo: foundersFund,
      width: 304,
      label: 'Founders Fund',
    },
    {
      className: 'md:order-2',
      logo: databricks,
      width: 200,
      label: 'Databricks',
    },
  ],
  individuals: [
    {
      image: natFriedman,
      name: 'Nat Friedman',
      role: 'Former CEO at',
      company: 'GitHub',
    },
    {
      image: guillermoRauch,
      name: 'Guillermo Rauch',
      role: 'CEO at',
      company: 'Vercel',
    },
    {
      image: wesMcKinney,
      name: 'Wes McKinney',
      role: 'Founder of',
      company: 'VoltronData',
    },
    {
      image: ajeetSingh,
      name: 'Ajeet Singh',
      role: 'Founder of',
      company: 'ThoughtSpot',
    },
    {
      image: eladGil,
      name: 'Elad Gil',
      role: 'Founder of',
      company: 'Color Genomics',
    },
    {
      image: mikeOvitz,
      name: 'Mike Ovitz',
      role: 'Founder of',
      company: 'CAA',
    },
    {
      image: sorenBrammerSchmidt,
      name: 'Søren Brammer Schmidt',
      role: 'CEO at',
      company: 'Prisma',
    },
    {
      image: ramtinNaimi,
      name: 'Ramtin Naimi',
      role: 'Founder at',
      company: 'Abstract',
    },
    {
      image: andyPavlo,
      name: 'Andy Pavlo',
      role: 'Professor at',
      company: 'CMU',
    },
  ],
};

const Investors = () => (
  <section className="investors safe-paddings z-10 -mb-40 mt-[200px] xl:-mb-6 xl:mt-[136px] lg:mb-12 lg:mt-[104px] md:mt-20 sm:-mb-4">
    <Container className="flex flex-col items-center" size="1152">
      <Heading
        className="text-[68px] font-medium leading-none tracking-extra-tight xl:text-[56px] lg:text-5xl md:text-[36px]"
        tag="h2"
        theme="black"
      >
        Our investors
      </Heading>
      <p className="mt-7 text-center text-xl leading-snug tracking-extra-tight text-gray-new-50 xl:mt-5 lg:mt-[18px] lg:max-w-[477px] lg:text-lg md:mt-3.5 md:max-w-[277px] md:text-base">
        We&apos;ve <span className="text-white">raised $104 million in funding</span>, backed by
        some of the world&apos;s leading investors.
      </p>
      <ul className="mt-16 flex max-w-[1070px] flex-wrap items-center justify-center gap-x-[120px] gap-y-10 xl:mt-14 xl:gap-x-20 xl:gap-y-9 lg:mt-12 lg:max-w-[618px] lg:gap-x-12 sm:mt-8 sm:gap-x-9 sm:gap-y-7">
        {investors.companies.map(({ logo, width, label, className }, index) => (
          <li
            className={clsx('flex flex-col', index > 3 && 'xl:-mx-1 lg:mx-0', className)}
            key={index}
          >
            <Image
              className="w-full rounded-sm xl:h-10 lg:h-9 sm:h-7"
              src={logo}
              alt={label}
              width={width}
              height={44}
            />
          </li>
        ))}
      </ul>
      <Heading
        className="mt-[120px] text-4xl font-medium leading-none tracking-extra-tight xl:mt-24 xl:text-[36px] lg:mt-20 lg:text-[28px] md:mt-16 md:text-2xl"
        tag="h3"
        theme="black"
      >
        Individual investors
      </Heading>
      <ul className="mt-14 flex max-w-[852px] flex-wrap items-center justify-center gap-x-12 gap-y-9 xl:mt-12 xl:max-w-[828px] xl:gap-x-10 xl:gap-y-8 lg:mt-10 lg:max-w-[702px] lg:gap-x-[26px] lg:gap-y-7 sm:mt-9 sm:gap-x-11 sm:gap-y-10">
        {investors.individuals.map(({ image, name, role, company }, index) => (
          <li
            className={clsx(
              'flex w-[177px] flex-col items-center lg:w-[156px] sm:w-[113px]',
              index === investors.individuals.length - 1 && 'sm:w-[177px]',
              index > 3 && 'lg:mx-1 md:mx-0'
            )}
            key={index}
          >
            <Image className="rounded-full" src={image} alt={name} width={64} height={64} />
            <p className="mt-5 flex flex-col gap-y-1.5 lg:mt-[18px]">
              <span className="whitespace-nowrap text-center text-[15px] font-medium leading-tight tracking-extra-tight sm:whitespace-normal">
                {name}
              </span>
              <span className="whitespace-nowrap text-center text-sm leading-tight tracking-extra-tight text-gray-new-50 sm:whitespace-normal">
                {role} <span className="text-gray-new-80 sm:block">{company}</span>
              </span>
            </p>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Investors;
