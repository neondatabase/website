import Image from 'next/image';

import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

import illustration from './images/cta-elephant.jpg';

const CTA = () => (
  <section className="safe-paddings mt-[200px] overflow-hidden bg-black-new 2xl:mt-40 xl:mt-[125px]">
    <Container size="medium" className="grid grid-cols-12 gap-x-10 xl:gap-x-6 md:gap-x-4">
      <div className="z-10 col-span-4 col-start-2 flex flex-col pb-[164px] pt-12 2xl:col-span-5 2xl:col-start-2 2xl:pb-36 xl:pb-[78px] xl:pt-20">
        <Heading tag="h2" size="2sm">
          Try pg_embedding now with Neon
        </Heading>
        <p className="mt-3 text-lg font-light leading-snug xl:text-base">
          Interested in increasing your free tier limits or learning about pricing? Complete the
          form below to get in touch
        </p>
        <div className="mt-9 flex items-center gap-x-8 xl:mt-7">
          <AnimatedButton
            className="inline-flex px-14 py-5 text-lg tracking-tight hover:bg-[#00FFAA] xl:px-10 xl:py-[17px]"
            theme="primary"
            to="/docs/extensions/pg_embedding"
            animationSize="sm"
            animationClassName="w-[126%]"
            spread={3}
            isAnimated
          >
            Explore docs
          </AnimatedButton>
          <Link
            className="tracking-extra-tight underline decoration-green-45/40 underline-offset-[5px] hover:decoration-transparent"
            theme="green"
            to="https://github.com/neondatabase/pg_embedding"
            size="sm"
          >
            Learn more on GitHub
          </Link>
        </div>
      </div>
      <div className="relative col-span-7 col-start-6 2xl:col-span-6 2xl:col-start-7">
        <Image
          className="absolute bottom-0 left-0 w-[842px] max-w-none 2xl:w-[750px] xl:-left-20 xl:w-[652px]"
          src={illustration}
          width={842}
          height={482}
          alt=""
        />
      </div>
    </Container>
  </section>
);

export default CTA;
