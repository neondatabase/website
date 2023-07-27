import Image from 'next/image';

import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const CTA = () => (
  <section className="safe-paddings mt-[200px] bg-black-new">
    <Container size="medium" className="grid grid-cols-12 gap-x-10 xl:gap-x-6 lt:gap-x-4">
      <div className="z-10 col-span-4 col-start-2 mt-12 flex flex-col">
        <Heading tag="h2" size="2sm">
          Try pg_embedding now with Neon
        </Heading>
        <p className="mt-3 text-lg font-light leading-snug">
          Interested in increasing your free tier limits or learning about pricing? Complete the
          form below to get in touch
        </p>
        <div className="mt-9 flex items-center gap-x-8">
          <AnimatedButton
            className="inline-flex !px-14 !py-5 !text-lg tracking-tight hover:bg-[#00FFAA]"
            theme="primary"
            to="/docs/extensions/pg_embedding"
            size="sm"
            animationSize="sm"
            animationClassName="w-[126%]"
            spread={3}
            isAnimated
          >
            Explore docs
          </AnimatedButton>
          <Link
            to="https://github.com/neondatabase/pg_embedding"
            theme="underline-primary-1"
            size="sm"
          >
            Learn more on GitHub
          </Link>
        </div>
      </div>
      <Image
        className="col-span-7 col-start-6"
        src="/images/pages/ai/cta-elephant.jpg"
        width={842}
        height={482}
        loading="lazy"
        alt=""
      />
    </Container>
  </section>
);

export default CTA;
