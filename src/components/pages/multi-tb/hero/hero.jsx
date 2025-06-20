import Button from 'components/shared/button';
import Container from 'components/shared/container';
import LINKS from 'constants/links';

const Hero = () => (
  <section className="hero safe-paddings relative pt-[160px] xl:pt-[150px] lg:pt-12 md:pt-10">
    <Container className="lg:mx-24 md:mx-auto md:max-w-[640px]" size="576" as="header">
      <h1 className="max-w-[646px] font-title text-[64px] font-medium leading-none tracking-extra-tight xl:max-w-[500px] xl:text-[56px] lg:max-w-[440px] lg:text-5xl md:max-w-full md:text-[36px]">
        Scale Postgres without losing sleep
      </h1>
      <p className="mt-4 text-lg leading-snug tracking-extra-tight text-gray-new-60 lg:mt-3 lg:max-w-[460px] lg:text-base lg:tracking-tight">
        No more 3 AM panics. Eliminate hours-long restores, automate scaling, and protect uptime —
        no matter how big you grow.
      </p>
      <Button
        className="mt-8 h-12 px-[40px] font-semibold tracking-tighter lg:mt-7 lg:h-11 lg:px-11 lg:text-sm md:mt-6"
        theme="primary"
        to={LINKS.docsMigration}
        tagName="Multi-TB Page Hero"
      >
        Get started
      </Button>
    </Container>
  </section>
);

export default Hero;
