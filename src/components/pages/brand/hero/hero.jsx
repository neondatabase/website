import Container from 'components/shared/container';

const Hero = () => (
  <section className="hero pt-36 xl:pt-32 lg:pt-11 md:pt-8">
    <Container size="768">
      <h1 className="font-title text-[56px] leading-none tracking-extra-tight xl:text-5xl lg:text-4xl md:text-[32px]">
        Brand Guidelines
      </h1>
      <p className="mt-3 max-w-[512px] font-light leading-snug tracking-extra-tight text-gray-new-80 lg:mt-2.5 md:mt-2">
        Official assets and guidelines to help you reference the Neon brand, including our logo,
        content and trademarks.
      </p>
      <a
        className="mt-8 inline-flex items-center justify-center whitespace-nowrap rounded-full bg-primary-1 px-5 py-3 text-center text-base font-semibold leading-none tracking-tighter text-black outline-none transition-colors duration-200 hover:bg-[#00e5bf] lg:mt-6 md:mt-5"
        href="/brand/neon-brand-assets.zip"
        download="neon-brand-assets.zip"
      >
        Download brand assets
      </a>
    </Container>
  </section>
);

export default Hero;
