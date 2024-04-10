import Container from 'components/shared/container/container';
import GradientLabel from 'components/shared/gradient-label';
import Heading from 'components/shared/heading';

import Compute from './compute';
import Storage from './storage';

const Features = () => (
  <section className="safe-paddings relative">
    <Container className="grid-gap-x grid grid-cols-12" size="medium">
      <div className="col-span-10 col-start-2">
        <GradientLabel className="mx-auto block w-fit">Details</GradientLabel>
        <Heading
          className="mt-4 text-center text-[48px] font-medium leading-none tracking-tight lg:text-4xl sm:text-[36px]"
          tag="h2"
          theme="white"
        >
          Neon billing fundamentals
        </Heading>
        <p className="mt-3 text-center text-lg font-light leading-snug sm:text-base">
          The Neon architecture is unique — and so is our billing.
        </p>
      </div>
      <div className="col-span-10 col-start-2 mt-[72px] flex flex-col items-center gap-y-20 xl:col-span-full xl:col-start-1 xl:gap-y-[104px] md:gap-y-16">
        <Storage />
        <Compute />
      </div>
    </Container>
  </section>
);

export default Features;
