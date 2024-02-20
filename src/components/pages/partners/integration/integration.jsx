import Container from 'components/shared/container/container';

import Api from './api';

const Integration = () => (
  <section className="integration safe-paddings mt-24 2xl:mt-20 xl:mt-16 lg:mt-12 md:mt-8">
    <Container className="grid-gap-x grid grid-cols-12" size="medium">
      <div className="col-span-10 col-start-2 flex flex-col items-center xl:col-span-full xl:col-start-1">
        <Api />
      </div>
    </Container>
  </section>
);

export default Integration;
