import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import LINKS from 'constants/links';

import sparks from './images/sparks.png';

const Hero = () => (
  <section className="hero safe-paddings relative pt-[136px] xl:pt-[120px] lg:pb-8 lg:pt-20 md:pt-16">
    <Container size="768">
      <div className="relative mb-10 size-[72px]">
        <Image
          className="relative z-10 rounded-2xl shadow-[0px_5px_14px_0px_rgba(0,0,0,0.6)]"
          src={sparks}
          alt=""
          width={72}
          height={72}
          quality={100}
          priority
        />
        <span
          className="absolute -right-1 -top-1 size-1/2 rounded-full bg-[#4265CD] blur-xl"
          aria-hidden
        />
        <span
          className="absolute -bottom-1 -left-1 size-1/2 rounded-full bg-[#39D6BE] blur-xl"
          aria-hidden
        />
      </div>
      <h1 className="max-w-[646px] font-title text-[60px] font-medium leading-none tracking-extra-tight lg:text-5xl md:text-4xl sm:text-[36px]">
        Neon is Postgres for AI.
        <span className="block text-gray-new-60">
          Perfect for Agents,
          <br />
          AI coding, or just vibing.
        </span>
      </h1>
      <Button
        className="mt-9 min-w-40 font-semibold"
        theme="primary"
        size="md-new"
        to={LINKS.signup}
        target="_blank"
        tagName="AI Page Hero"
      >
        Get started
      </Button>
    </Container>
  </section>
);

export default Hero;
