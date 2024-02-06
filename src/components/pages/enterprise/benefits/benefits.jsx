import Container from 'components/shared/container/container';

import Fleets from './fleets';
import PricePerf from './price-perf';
import Workflow from './workflow';

const Benefits = () => (
  <section className="integration safe-paddings mt-[200px] 2xl:mt-40 xl:mt-36 lg:mt-28 md:mt-20">
    <Container className="grid-gap-x grid grid-cols-12" size="medium">
      <div className="col-span-10 col-start-2 flex flex-col items-center xl:col-span-full xl:col-start-1">
        <Fleets />
        <Workflow />
        <PricePerf />
      </div>
    </Container>
  </section>
);

export default Benefits;
