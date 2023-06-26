import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container/container';

const Hero = () => (
  <section className="hero safe-paddings pb-52 pt-48">
    <Container
      className="relative z-10 text-center"
      size="lg"
      style={{
        '--accentColor': '#00E599',
        '--hoverColor': '#00ffaa',
      }}
    >
      <h1 className="mx-auto max-w-[968px] text-[72px] font-medium leading-none tracking-tighter">
        Unlock <mark className="bg-transparent text-green-45">additional revenue</mark> stream by
        partnering with Neon
      </h1>
      <p className="mt-5 text-xl font-light">
        Bring familiar, reliable and scalable Postgres experience to your customers.
      </p>
      {/* TODO: add link become a partner */}
      <AnimatedButton
        className="relative mt-8 px-[34px] py-[17px] text-lg font-semibold tracking-[-0.02em]"
        theme="primary"
        animationColor="var(--accentColor)"
        spread={5}
        //  to="/"
        isAnimated
      >
        Become a partner
      </AnimatedButton>
    </Container>
  </section>
);

export default Hero;
