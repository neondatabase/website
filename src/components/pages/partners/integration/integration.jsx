import Container from 'components/shared/container/container';
import GradientLabel from 'components/shared/gradient-label';
import LINKS from 'constants/links';

import Api from './api';
import autoscalingChart from './images/autoscaling-chart.svg';
import databaseTable from './images/database-table.svg';
import Row from './row';

const Integration = () => (
  <section className="integration safe-paddings mt-48 2xl:mt-36 lg:mt-28 md:mt-20">
    <Container className="flex flex-col items-center" size="medium">
      <GradientLabel>Features</GradientLabel>
      <h2 className="mt-4 text-center font-title text-[48px] font-medium leading-none tracking-extra-tight lg:text-4xl sm:text-[36px]">
        Why Neon
      </h2>
      <p className="mt-3 text-center text-lg font-light leading-snug sm:text-base">
        A fully managed Postgres that’s easy to run, efficient, and scalable.
      </p>
      <div className="mt-20 flex flex-col gap-y-[88px] 2xl:gap-y-20 xl:mt-16 xl:gap-y-16 lg:mt-12 lg:gap-y-12 md:mt-8 md:gap-y-8">
        <Row
          title="Instant Postgres databases"
          description="Neon databases are ready within seconds. With dedicated URLs."
          linkText="Learn more"
          linkUrl={`${LINKS.docs}/introduction/serverless`}
          image={databaseTable}
        />
        <Row
          title="Large fleet, small bill"
          description="With Neon’s scale-to-zero, you only pay for the resources your customers actually use."
          linkText="Learn more"
          linkUrl={`${LINKS.docs}/introduction/scale-to-zero`}
          image={autoscalingChart}
          imagePosition="left"
        />
        <Api />
      </div>
    </Container>
  </section>
);

export default Integration;
