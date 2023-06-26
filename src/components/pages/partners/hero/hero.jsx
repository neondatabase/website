import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container/container';

const Hero = () => (
  <section className="hero safe-paddings relative overflow-hidden pb-52 pt-48">
    <img
      className="absolute -top-[1.5px] left-1/2 h-[827px] w-[1920px] -translate-x-1/2 object-cover"
      src="/images/pages/partners/logo-pattern.svg"
      width={1920}
      height={827}
      alt=""
      loading="eager"
      aria-hidden
    />
    <Container className="relative z-10 flex flex-col items-center text-center" size="lg">
      <img
        className="h-28 w-28"
        src="/images/pages/partners/logo.svg"
        alt="Neon logo"
        loading="eager"
        width={112}
        height={112}
      />
      <h1 className="mx-auto mt-10 max-w-[968px] text-[72px] font-medium leading-none tracking-tighter">
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
