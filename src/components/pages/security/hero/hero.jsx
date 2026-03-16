import Container from 'components/shared/container/container';

const Hero = () => (
  <section className="hero relative pt-40 safe-paddings md:pt-10 lg:pt-12 xl:pt-[150px]">
    <Container className="relative z-10 flex flex-col items-center text-center" size="960">
      <h1 className="mx-auto font-title text-6xl leading-[0.9] font-medium tracking-extra-tight md:text-4xl lg:text-5xl xl:text-[56px]">
        Neon’s Security & Compliance
      </h1>
      <p className="mx-auto mt-4 max-w-[714px] text-lg leading-snug tracking-extra-tight text-gray-new-80 sm:mt-3 lg:mt-3.5 lg:max-w-[580px] lg:text-base xl:max-w-[772px]">
        At Neon, security, compliance, privacy, and transparency are core to our platform. We
        protect customer data through industry leading security controls, independent audits, and
        strict adherence to global compliance standards.
      </p>
    </Container>
  </section>
);

export default Hero;
