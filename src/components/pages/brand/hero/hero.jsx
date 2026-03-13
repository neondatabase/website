import Button from 'components/shared/button';
import Container from 'components/shared/container';

const Hero = () => (
  <section className="hero pt-36 lg:pt-[52px] xl:pt-32 md:pt-10">
    <Container size="768" className="lg:max-w-3xl!">
      <h1 className="text-[56px] leading-dense tracking-tighter lg:text-4xl xl:text-5xl md:text-[32px]">
        Brand Guidelines
      </h1>
      <p className="mt-4 max-w-[544px] text-xl tracking-extra-tight text-gray-new-60 lg:mt-3 xl:mt-3.5 xl:text-base md:mt-2">
        Official assets and guidelines to help you reference the Neon brand, including our logo,
        content and trademarks.
      </p>
      <Button
        className="mt-8 lg:mt-6 xl:mt-7 md:mt-5"
        theme="white-filled"
        size="new"
        to="/brand/neon-brand-assets.zip"
        download="neon-brand-assets.zip"
        tagName="Brand Page Hero"
      >
        Download brand assets
      </Button>
    </Container>
  </section>
);

export default Hero;
