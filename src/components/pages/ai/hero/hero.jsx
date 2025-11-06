import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import LINKS from 'constants/links';

import sparks from './images/sparks.png';

const Hero = () => (
  <section className="hero safe-paddings relative mt-[136px] xl:mt-[126px] lg:mt-14 md:mt-12">
    <Container className="lg:!max-w-[640px]" size="832">
      <div className="relative mb-10 size-[72px] lg:mb-8 lg:size-16 lg:rounded-[14px] md:mb-7 md:size-14">
        <Image
          className="relative z-10 size-full rounded-2xl shadow-[0px_5px_14px_0px_rgba(0,0,0,0.6)] md:rounded-xl"
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
      <h1 className="max-w-3xl font-title text-[60px] font-medium leading-none tracking-extra-tight xl:text-[56px] lg:max-w-xl lg:text-5xl md:max-w-full md:text-[36px]">
        Neon for&nbsp;AI.{' '}
        <span className="text-gray-new-60">
          Designed for agents. Optimized for vectors. Backed{' '}
          <br className="hidden md:inline-block" />
          by Postgres.
        </span>
      </h1>
      <Button
        className="mt-9 h-12 min-w-40 px-[38px] font-semibold tracking-tighter lg:mt-7 md:mt-6 md:h-11 md:min-w-min md:px-10"
        theme="primary"
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
