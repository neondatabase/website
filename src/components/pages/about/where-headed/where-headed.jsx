import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const StatisticsItem = ({ title, description }) => (
  <li className="flex flex-col gap-[20px] lg:gap-3 md:gap-2">
    <span className="bg-[linear-gradient(73deg,#7F95EB_1%,#89E0EA_33%,#EFEFEF_81%)] bg-clip-text pr-3 font-title text-7xl font-medium leading-none tracking-tighter text-transparent lg:text-6xl md:text-[56px]">
      {title}
    </span>
    <span className="text-[15px] font-normal uppercase leading-none tracking-extra-tight text-gray-new-50 lg:text-[14px] md:text-[13px]">
      {description}
    </span>
  </li>
);

StatisticsItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const WhereHeaded = () => (
  <section className="whereheaded safe-paddings mt-[216px] xl:mt-[152px] lg:mt-[112px] md:mt-[72px]">
    <Container size={640} className="lg:!max-w-[544px] lg:!px-0 md:!px-5">
      <Heading
        className="max-w-[800px] text-6xl font-medium leading-[0.9] tracking-extra-tight lg:text-5xl md:text-[36px]"
        tag="h2"
      >
        Where we&apos;re headed
      </Heading>
      <div className="mt-12 max-w-[647px] text-gray-new-50 lg:mt-8 md:mt-6">
        <p className="text-2xl tracking-tighter lg:text-xl md:text-[16px]">
          <Link
            className="border-b border-white/20 text-white transition-[border-color,color] duration-300 hover:border-primary-1"
            to="https://www.databricks.com/company/newsroom/press-releases/databricks-agrees-acquire-neon-help-developers-deliver-ai-systems"
            theme="white"
            aria-label="read more about Neon is now part of Databricks"
          >
            Neon is now part of Databricks.
          </Link>{' '}
          In May 2025, Neon joined Databricks to shape the future of Postgres and AI-native
          development. The mission stays the same: deliver Postgres for developers and AI agents —
          now backed by the scale and expertise of Databricks.
        </p>

        <p className="mt-8 block text-2xl tracking-extra-tight lg:mt-6 lg:text-xl md:mt-[14px] md:text-[16px]">
          <Link
            className="border-b border-white/20 text-white transition-[border-color,color] duration-300 hover:border-primary-1"
            to="https://www.databricks.com/blog/announcing-lakebase-public-preview"
            theme="white"
            aria-label="read more about Neon is now part of Databricks"
          >
            The same technology behind Neon powers Lakebase:
          </Link>{' '}
          The&nbsp;first serverless Postgres database integrated with the lakehouse, built for the
          AI era.
        </p>

        <ul className="mt-14 flex justify-between lg:mt-10 md:flex-col md:gap-8">
          <StatisticsItem title="40,000" description="Databases created daily" />
          <StatisticsItem title="80%" description="Of databases deployed by agents" />
        </ul>
      </div>
    </Container>
  </section>
);

export default WhereHeaded;
