import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';

import Deploy from './deploy';
import Scale from './scale';
import Startups from './startups';

const ScaleYourApp = () => (
  <section
    className="scale-your-app relative mt-40 overflow-hidden bg-black-pure safe-paddings text-white 2xl:mt-32 md:mt-28 sm:mt-24"
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
          className="mt-4.25 block font-mono text-[8rem] leading-none tracking-tighter text-gray-new-10 xl:text-[6rem] md:mt-2 md:text-[5rem]"
          aria-hidden="true"
        >
          03
        </span>
      </div>

      <header className="min-w-0">
        <h2
          className="relative left-px max-w-296 indent-24 text-5xl leading-dense font-normal tracking-tighter text-gray-new-50 2xl:text-[2.75rem] xl:left-0 xl:indent-16 xl:text-[2.25rem] lg:mt-10 lg:indent-0 md:mt-8 md:text-[1.75rem]"
          id="scale-your-app-heading"
        >
          <span className="text-white">Scale from your first users to the Fortune 500. </span>
          Startups ship on the same Neon primitives that enterprise teams run in production.
        </h2>
      </header>
    </Container>

    <div className="mt-[120px] 2xl:mt-16">
      <Startups />
      <Deploy />
      <Scale />
    </div>
  </section>
);

export default ScaleYourApp;
