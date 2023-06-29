import Container from 'components/shared/container/container';

import Api from './api';
import Oauth from './oauth';

const Integration = () => (
  <section className="integration safe-paddings mt-[200px] xl:mt-36">
    <Container className="grid-gap-x grid grid-cols-12" size="lg">
      <div className="col-span-10 col-start-2 flex flex-col items-center xl:col-span-full xl:col-start-1">
        <span className="inline-block rounded-[40px] bg-green-45/10 px-3.5 py-2 text-xs font-semibold uppercase leading-none text-green-45">
          Integrate
        </span>
        <h2 className="mt-2 text-center text-[56px] font-medium leading-none tracking-tighter xl:text-[44px]">
          Pick the integration that suits your needs
        </h2>
        <p className="mt-4 text-center text-lg font-light leading-snug xl:text-base">
          Neon offers two ways to seamlessly integrate it into your product.
        </p>
        <Oauth />
        <Api />
      </div>
    </Container>
  </section>
);

export default Integration;
