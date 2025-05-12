import Button from 'components/shared/button';
import Container from 'components/shared/container';
import LINKS from 'constants/links';

const Hero = () => (
  <section className="hero safe-paddings relative pt-[134px] lg:pt-16 md:pt-12">
    <Container className="lg:mx-8 md:mx-1" size="768">
      <h1 className="max-w-[646px] font-title text-[64px] font-medium leading-none tracking-extra-tight xl:text-[56px] lg:max-w-xl lg:text-5xl md:max-w-full md:text-4xl">
        Scale Postgres without losing sleep
      </h1>
      <p className="mt-4 max-w-[570px] text-lg font-light leading-snug tracking-extra-tight text-gray-new-80 lg:mt-3 lg:text-base">
        No more 3 AM panics. Eliminate hours-long restores, automate scaling, and protect uptime —
        no matter how big you grow.
      </p>
      <Button
        className="mt-9 h-12 min-w-40 px-[38px] font-semibold tracking-tighter lg:mt-7 lg:h-11 lg:px-8 lg:text-sm md:mt-6"
        theme="primary"
        to={LINKS.docsMigration}
        target="_blank"
        tagName="Multi-TB Page Hero"
      >
        Get started
      </Button>
    </Container>
  </section>
);

export default Hero;
