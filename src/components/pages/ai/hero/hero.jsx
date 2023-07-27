import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container/container';

const Hero = () => (
  <section className="hero safe-paddings pt-36">
    <Container
      className="container relative z-10 flex flex-col items-center text-center"
      size="medium"
    >
      <div className="absolute left-1/2 top-0 -z-10 h-[270px] w-3/4 -translate-x-1/2 rounded-[1000px] bg-black-new blur-[30px] lg:w-full" />
      <h1 className="max-w-[967px] text-6xl font-medium leading-none tracking-extra-tight">
        Build your next <span className="text-green-45">AI and LLM</span> application on top of
        Postgres
      </h1>
      <p className="mt-5 max-w-[716px] text-[21px] font-light leading-snug tracking-extra-tight">
        Introducing pg_embedding for AI vector search a faster alternative
        <br /> to pgvector that scales to millions of rows
      </p>
      <AnimatedButton
        className="relative mt-9 px-[34px] py-[17px] text-lg font-semibold tracking-extra-tight lg:mt-7 md:mt-6"
        theme="primary"
        spread={5}
        // TODO: add link to "Get Started" button
        to="#"
        isAnimated
      >
        Get Started
      </AnimatedButton>
    </Container>
  </section>
);

Hero.propTypes = {};

export default Hero;
