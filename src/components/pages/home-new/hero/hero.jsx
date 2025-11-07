import HeadingLabel from 'components/pages/home-new/heading-label';
import Button from 'components/shared/button';
import Container from 'components/shared/container';
import CopyIcon from 'icons/home-new/copy.inline.svg';

const Hero = () => (
  <section className="hero safe-paddings relative h-screen">
    <Container className="relative flex h-full flex-col justify-center" size="1600">
      <HeadingLabel>Ship faster with Postgres</HeadingLabel>
      <div className="mt-20 flex gap-5 md:flex-col">
        <Button theme="white-filled" size="new">
          Get started
        </Button>
        <Button theme="gray-40-outline" size="new">
          Read the docs
        </Button>
        <Button
          className="inline-flex items-center gap-x-3 font-mono !font-medium"
          theme="green-filled"
          size="xs"
        >
          $ npx neon init
          <CopyIcon className="" aria-hidden />
        </Button>
      </div>
    </Container>
  </section>
);

export default Hero;
