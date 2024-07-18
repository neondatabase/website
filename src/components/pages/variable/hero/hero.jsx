import Container from 'components/shared/container/container';

const Hero = () => (
  <section className="hero safe-paddings relative overflow-hidden pt-[152px] xl:pt-32 lg:pt-12 md:pt-8">
    <Container size="xxs">
      <h1 className="text-[56px] font-semibold leading-dense tracking-tighter xl:text-5xl lg:text-4xl md:text-[28px]">
        Dynamically scale your
        <br /> Postgres database
      </h1>
      <p className="mt-4 text-2xl leading-snug tracking-extra-tight text-gray-new-80 xl:text-xl md:mt-3 md:text-lg">
        Achieve optimal performance during traffic peaks without overprovisioning.
      </p>
    </Container>
  </section>
);

export default Hero;
