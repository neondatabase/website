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
  <div className="flex w-[212px] flex-col gap-5 md:w-full lg:w-40 lg:gap-3.5 xl:w-48 xl:gap-4">
    <Image
      src={icon}
      alt=""
      width={32}
      height={32}
      aria-hidden="true"
      className="h-8 w-8 md:h-5 md:w-5 xl:h-7 xl:w-7"
    />
    <div className="flex flex-col gap-1.5 lg:gap-1">
      <span className="text-4xl leading-dense font-normal tracking-tighter text-black-pure md:text-2xl lg:text-[28px] xl:text-[36px]">
        {value}
      </span>
      <p className="text-base leading-normal font-normal tracking-extra-tight text-gray-new-40 xl:text-sm xl:leading-snug">
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
    <div className="flex gap-x-[140px] md:flex-col md:gap-y-20 lg:gap-x-12 xl:gap-x-32">
      <div className="relative flex-1 before:absolute before:top-0 before:-left-8 before:h-full before:w-px before:bg-gray-new-50 md:ml-0 md:before:hidden xl:ml-8">
        <SectionLabel icon="arrow">Where we&apos;re headed</SectionLabel>

        <h3 className="mt-5 max-w-[736px] text-5xl leading-dense font-normal tracking-tighter text-gray-new-40 md:mt-4 md:text-xl lg:max-w-full lg:text-2xl xl:max-w-[600px] xl:text-[36px]">
          <span className="text-black-pure">Neon is a Databricks company.</span> In May 2025, Neon
          joined Databricks to shape the future of Postgres and AI-native development.
        </h3>

        <div className="mt-[194px] flex gap-x-24 md:mt-9 md:flex-col md:gap-y-7 md:pr-24 lg:gap-x-8 xl:mt-[136px] xl:gap-x-16">
          {STATS_DATA.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      <div className="relative grid w-[416px] content-between before:absolute before:top-0 before:-left-8 before:h-full before:w-px before:bg-gray-new-50 md:w-full md:gap-y-4 md:before:hidden lg:order-0 lg:w-[238px] xl:w-[320px]">
        <SectionLabel icon="arrow">Our Vision</SectionLabel>

        <div className="grid gap-y-10 md:gap-y-4 lg:gap-y-7 xl:gap-y-9">
          <p className="text-xl leading-normal tracking-tighter text-black-pure md:text-[15px] lg:text-base xl:text-lg">
            The mission stays the same:{' '}
            <mark className="rounded-sm bg-[#39A57D]/60 text-black-pure">deliver Postgres</mark> for
            developers and AI agents — now backed by the scale and expertise of Databricks.
          </p>

          <p className="text-xl leading-normal tracking-tighter text-black-pure md:mr-8 md:text-[15px] lg:text-base xl:text-lg">
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
