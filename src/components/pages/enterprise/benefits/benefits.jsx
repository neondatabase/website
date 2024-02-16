import Container from 'components/shared/container/container';

import Fleets from './fleets';
import PricePerf from './price-perf';
import Workflow from './workflow';

const Benefits = () => (
  <section className="integration safe-paddings mt-[136px] xl:mt-[104px] lg:mt-20 md:mt-16">
    <Container className="grid-gap-x grid grid-cols-12" size="medium">
      <div className="col-span-10 col-start-2 flex flex-col items-center gap-y-[136px] xl:col-span-full xl:col-start-1 xl:gap-y-[104px] md:gap-y-16">
        <Fleets />
        <Workflow />
        <PricePerf />
      </div>
    </Container>
  </section>
);

export default Benefits;
