import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';

import Deploy from './deploy';
import Scale from './scale';
import Startups from './startups';

const ScaleYourApp = () => (
  <section
    className="scale-your-app relative mt-40 overflow-hidden bg-black-pure safe-paddings text-white lg:mt-32 md:mt-28 sm:mt-24"
    id="scale-your-app"
    aria-labelledby="scale-your-app-heading"
  >
    <Container
      className="grid grid-cols-[22rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-1"
      size="1600"
    >
      <div>
        <SectionLabel theme="white">SCALE YOUR APP AND AGENT</SectionLabel>
        <span
          className="mt-4.25 block font-mono text-[8rem] leading-none tracking-tighter text-gray-new-10 lg:text-[6rem] md:text-[5rem] sm:text-[5rem]"
          aria-hidden="true"
        >
          03
        </span>
      </div>

      <header className="min-w-0">
        <h2
          className="relative left-px max-w-296 indent-24 text-5xl leading-dense font-normal tracking-tighter text-gray-new-50 xl:left-0 xl:indent-16 xl:text-4xl lg:mt-10 lg:indent-0 lg:text-[2.25rem] md:mt-8 md:text-[2rem]"
          id="scale-your-app-heading"
        >
          <span className="text-white">One backend, from your first user to the Fortune 500. </span>
          Startups ship on the same Neon primitives that enterprise teams run in production.
        </h2>
      </header>
    </Container>

    <div className="mt-[120px] lg:mt-24 md:mt-20 sm:mt-16">
      <Startups />
      <Deploy />
      <Scale />
    </div>
  </section>
);

export default ScaleYourApp;
