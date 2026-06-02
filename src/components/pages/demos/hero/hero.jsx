import Container from 'components/shared/container';

const Hero = () => (
  <section className="hero pt-36 safe-paddings xl:pt-32 lg:pt-14 md:pt-10">
    <Container className="grid grid-cols-12 grid-gap-x lg:grid-cols-1" size="medium">
      <div className="col-span-10 col-start-2 lg:col-span-full lg:col-start-1">
        <h1 className="font-title text-6xl leading-none font-medium tracking-extra-tight xl:text-[56px] lg:text-5xl md:text-4xl sm:text-3xl">
          <span className="text-green-45">Serverless showcase:</span>
          <br /> build with Neon
        </h1>
        <p className="mt-5 text-xl leading-snug font-light tracking-extra-tight lg:text-xl md:text-base">
          Explore interactive demos from the community and the Neon team.
        </p>
      </div>
    </Container>
  </section>
);

export default Hero;
