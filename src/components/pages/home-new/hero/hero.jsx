import HeadingLabel from 'components/pages/home-new/heading-label';
import Button from 'components/shared/button';
import Container from 'components/shared/container';
import CopyIcon from 'icons/home-new/copy.inline.svg';

const Hero = () => (
  <section className="hero safe-paddings relative h-screen bg-black-pure">
    <Container className="relative flex h-full flex-col items-center justify-center" size="1600">
      <HeadingLabel className="-ml-80">Ship faster with Postgres</HeadingLabel>
      <div className="mt-20 flex gap-x-5">
        <Button className="!font-medium" theme="white-filled" size="xs">
          Get started
        </Button>
        <Button className="!font-normal" theme="gray-15-outline" size="xs">
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
