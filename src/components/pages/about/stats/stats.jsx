import Image from 'next/image';
import PropTypes from 'prop-types';

import SecondarySection from 'components/shared/secondary-section';
import SectionLabel from 'components/shared/section-label';
import databaseIcon from 'images/pages/about/stats/database.svg';
import gearIcon from 'images/pages/about/stats/gear.svg';

const STATS_DATA = [
  {
    icon: databaseIcon,
    value: '40,000+',
    description: 'Databases provisioned daily by developers worldwide.',
    iconGap: 'gap-[25px]',
  },
  {
    icon: gearIcon,
    value: '80%',
    description: 'Of databases are deployed by automated agents.',
    iconGap: 'gap-5',
  },
];

const StatCard = ({ icon, value, description, iconGap }) => (
  <div
    className={`flex w-[212px] flex-col xl:w-[180px] lg:w-[160px] md:w-full ${iconGap} xl:gap-4 lg:gap-3`}
  >
    <Image
      src={icon}
      alt=""
      width={32}
      height={32}
      aria-hidden="true"
      className="h-8 w-8 lg:h-7 lg:w-7 md:h-6 md:w-6"
    />
    <div className="flex flex-col gap-1.5">
      <span className="text-[38px] font-normal leading-dense tracking-tighter text-black-pure xl:text-[32px] lg:text-[28px] md:text-2xl">
        {value}
      </span>
      <p className="text-base font-normal leading-normal tracking-extra-tight text-gray-new-40 lg:text-sm">
        {description}
      </p>
    </div>
  </div>
);

StatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  iconGap: PropTypes.string.isRequired,
};

const Stats = () => (
  <SecondarySection title="Company Statistics and Vision">
    <div className="flex gap-x-[128px] xl:gap-x-16 lg:flex-col lg:gap-y-16 md:gap-y-12">
      {/* Left Column - Main heading and stats */}
      <div className="relative flex-1 before:absolute before:-left-5 before:top-0 before:h-full before:w-px before:bg-gray-new-50 lg:before:hidden">
        <SectionLabel>Where we&apos;re headed</SectionLabel>

        <h3 className="mt-5 max-w-[736px] text-5xl font-normal leading-dense tracking-tighter xl:mt-7 xl:max-w-[600px] xl:text-[40px] lg:mt-6 lg:max-w-full lg:text-4xl md:mt-5 md:text-[32px] sm:text-[28px]">
          <span className="text-black-pure">Neon is a Databricks company.</span>{' '}
          <span className="text-gray-new-40">
            In May 2025, Neon joined Databricks to shape the future of Postgres and AI-native
            development.
          </span>
        </h3>

        <div className="mt-[194px] flex gap-x-[84px] xl:mt-[140px] xl:gap-x-12 lg:mt-[100px] lg:gap-x-8 md:mt-16 md:flex-col md:gap-y-10">
          {STATS_DATA.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Right Column - Vision statements */}
      <div className="lg:order-0 relative grid w-[416px] content-between before:absolute before:-left-5 before:top-0 before:h-full before:w-px before:bg-gray-new-50 xl:w-[380px] lg:w-full lg:before:hidden">
        <SectionLabel>Our Vision</SectionLabel>

        <div className="grid gap-y-10">
          <p className="text-xl leading-normal tracking-tighter text-black-pure xl:text-lg lg:text-base">
            The mission stays the same:{' '}
            <mark className="rounded-sm bg-[#39A57D]/60 text-black-pure">deliver Postgres</mark> for
            developers and AI agents — now backed by the scale and expertise of Databricks.
          </p>

          <p className="text-xl leading-normal tracking-tighter text-black-pure xl:text-lg lg:text-base">
            The same technology behind Neon powers Lakebase: The&nbsp;first serverless Postgres
            database{' '}
            <mark className="rounded-sm bg-[#39A57D]/60 text-black-pure">
              integrated with the lakehouse, built for the AI era.
            </mark>
          </p>
        </div>
      </div>
    </div>
  </SecondarySection>
);

export default Stats;
