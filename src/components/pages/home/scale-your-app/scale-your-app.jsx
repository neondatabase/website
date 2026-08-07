import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';

const ScaleYourApp = () => (
  <section
    className="scale-your-app mt-65 bg-black-pure safe-paddings pb-40 text-white xl:pb-34 lg:mt-52 lg:pb-20 md:mt-40 md:pb-16 sm:mt-28 sm:pb-16"
    id="scale-your-app"
    aria-labelledby="scale-your-app-heading"
  >
    <Container
      className="grid grid-cols-[22rem_minmax(0,1fr)] gap-y-16 xl:grid-cols-[16rem_minmax(0,1fr)] xl:gap-y-14 lg:grid-cols-1 lg:gap-y-10 md:gap-y-8"
      size="1600"
    >
      <div>
        <SectionLabel theme="white">SCALE YOUR APP AND AGENT</SectionLabel>
        <span
          className="mt-4.25 block font-mono text-[8rem] leading-none tracking-tighter text-gray-new-8"
          aria-hidden="true"
        >
          03
        </span>
      </div>

      <h2
        className="max-w-296 indent-24 text-5xl leading-dense font-normal tracking-tighter text-pretty text-gray-new-50 xl:indent-16 xl:text-4xl lg:indent-0 lg:text-[2.25rem] md:text-[2rem]"
        id="scale-your-app-heading"
      >
        <span className="text-white">One backend for every stage of growth.</span> Scale from your
        first user to enterprise workloads without switching platforms.
      </h2>
    </Container>
  </section>
);

export default ScaleYourApp;
