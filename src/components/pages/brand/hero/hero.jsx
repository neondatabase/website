import Button from 'components/shared/button';
import Container from 'components/shared/container';

const Hero = () => (
  <section className="hero pt-36 xl:pt-32 lg:pt-[52px] md:pt-10">
    <Container size="768" className="lg:!max-w-3xl">
      <h1 className="text-[56px] leading-dense tracking-tighter xl:text-5xl lg:text-4xl md:text-[32px]">
        Brand Guidelines
      </h1>
      <p className="mt-4 max-w-[544px] text-xl tracking-extra-tight text-gray-new-60 xl:mt-3.5 xl:text-base lg:mt-3 md:mt-2">
        Official assets and guidelines to help you reference the Neon brand, including our logo,
        content and trademarks.
      </p>
      <Button
        className="mt-8 xl:mt-7 lg:mt-6 md:mt-5"
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
