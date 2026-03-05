import Image from 'next/image';
import PropTypes from 'prop-types';

import SecondarySection from 'components/shared/secondary-section';
import SectionLabel from 'components/shared/section-label';
import databaseIcon from 'images/pages/about/vision/database.svg';
import gearIcon from 'images/pages/about/vision/gear.svg';

import BlobNoisy from './images/blob-horizontal-noise.inline.svg';
import BlobLargeNoisy from './images/blob-large-horizontal-noise.inline.svg';
import Blob from './images/blob.inline.svg';

const STATS_DATA = [
  {
    icon: databaseIcon,
    value: '40,000+',
    description: 'Databases provisioned daily by developers worldwide.',
  },
  {
    icon: gearIcon,
    value: '80%',
    description: 'Of databases are deployed by automated agents.',
  },
];

const StatCard = ({ icon, value, description }) => (
  <div className="flex w-[212px] flex-col gap-5 xl:w-48 xl:gap-4 lg:w-40 lg:gap-3.5 md:w-full">
    <Image
      src={icon}
      alt=""
      width={32}
      height={32}
      aria-hidden="true"
      className="h-8 w-8 xl:h-7 xl:w-7 md:h-5 md:w-5"
    />
    <div className="flex flex-col gap-1.5 lg:gap-1">
      <span className="text-4xl font-normal leading-dense tracking-tighter text-black-pure xl:text-[36px] lg:text-[28px] md:text-2xl">
        {value}
      </span>
      <p className="text-base font-normal leading-normal tracking-extra-tight text-gray-new-40 xl:text-sm xl:leading-snug">
        {description}
      </p>
    </div>
  </div>
);

StatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const Vision = () => (
  <SecondarySection title="Company Statistics and Vision" className="md:pb-[26px]">
    <div className="flex gap-x-[140px] xl:gap-x-32 lg:gap-x-12 md:flex-col md:gap-y-20">
      <div className="relative flex-1 before:absolute before:-left-8 before:top-0 before:h-full before:w-px before:bg-gray-new-50 xl:ml-8 md:ml-0 md:before:hidden">
        <SectionLabel icon="arrow">Where we&apos;re headed</SectionLabel>

        <h3 className="mt-5 max-w-[736px] text-5xl font-normal leading-dense tracking-tighter text-gray-new-40 xl:max-w-[600px] xl:text-[36px] lg:max-w-full lg:text-2xl md:mt-4 md:text-xl">
          <span className="text-black-pure">Neon is a Databricks company.</span> In May 2025, Neon
          joined Databricks to shape the future of Postgres and AI-native development.
        </h3>

        <div className="mt-[194px] flex gap-x-24 xl:mt-[136px] xl:gap-x-16 lg:gap-x-8 md:mt-9 md:flex-col md:gap-y-7 md:pr-24">
          {STATS_DATA.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      <div className="lg:order-0 relative grid w-[416px] content-between before:absolute before:-left-8 before:top-0 before:h-full before:w-px before:bg-gray-new-50 xl:w-[320px] lg:w-[238px] md:w-full md:gap-y-4 md:before:hidden">
        <SectionLabel icon="arrow">Our Vision</SectionLabel>

        <div className="grid gap-y-10 xl:gap-y-9 lg:gap-y-7 md:gap-y-4">
          <p className="text-xl leading-normal tracking-tighter text-black-pure xl:text-lg lg:text-base md:text-[15px]">
            The mission stays the same:{' '}
            <mark className="rounded-sm bg-[#39A57D]/60 text-black-pure">deliver Postgres</mark> for
            developers and AI agents — now backed by the scale and expertise of Databricks.
          </p>

          <p className="text-xl leading-normal tracking-tighter text-black-pure xl:text-lg lg:text-base md:mr-8 md:text-[15px]">
            The same technology behind Neon powers Lakebase: The&nbsp;first serverless Postgres
            database{' '}
            <mark className="rounded-sm bg-[#39A57D]/60 text-black-pure">
              integrated with the lakehouse, built for the AI era.
            </mark>
          </p>
        </div>
      </div>
    </div>
    <BlobLargeNoisy className="pointer-events-none absolute bottom-[48%] left-[47%] -rotate-45 xl:left-[35%]" />
    <BlobNoisy className="pointer-events-none absolute bottom-0 left-full -rotate-[75deg] xl:left-3/4" />
    <Blob className="pointer-events-none absolute -bottom-[30%] left-[85%] -rotate-45 xl:left-[70%]" />
  </SecondarySection>
);

export default Vision;
