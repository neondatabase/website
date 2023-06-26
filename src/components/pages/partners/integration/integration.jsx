import Container from 'components/shared/container/container';

import Api from './api';
import Oauth from './oauth';

const Integration = () => (
  <section className="integration safe-paddings mt-[200px]">
    <Container className="grid-gap-x grid grid-cols-12" size="lg">
      <div className="col-span-10 col-start-2 flex flex-col items-center">
        <span className="inline-block rounded-[40px] bg-green-45/10 px-3.5 py-2 text-xs font-semibold uppercase leading-none text-green-45">
          Integration
        </span>
        <h2 className="mt-2 text-[56px] font-medium leading-none tracking-tighter">
          Try integration quickly
        </h2>
        <p className="mt-4 text-lg font-light leading-snug">
          Learn more about the smooth integration process we have built for our partners.
        </p>
        <Oauth />
        <Api />
      </div>
    </Container>
  </section>
);

export default Integration;
