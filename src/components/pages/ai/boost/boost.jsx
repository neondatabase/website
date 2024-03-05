import Container from 'components/shared/container/container';
import GradientLabel from 'components/shared/gradient-label';
import Link from 'components/shared/link/link';

import Increase from './images/increase.inline.svg';

const Boost = () => (
  <section className="boost mt-[154px]">
    <Container className="flex flex-col items-center" size="medium">
      <GradientLabel>Perfomance</GradientLabel>
      <h2 className="mt-3 text-center text-5xl font-medium leading-dense tracking-extra-tight xl:text-[44px] lg:text-4xl md:text-[32px]">
        Boosting AI performance
        <br />
        with parallel index building
      </h2>
      <p className="mt-3 max-w-[485px] text-center text-lg font-light leading-snug tracking-normal xl:text-base">
        Experience up to 30x&nbsp;
        {/* TODO: insert href */}
        <Link
          className="!text-lg tracking-extra-tight underline-offset-[5px] xl:!text-base"
          theme="green-underlined"
          to="/"
          // target={linkTarget}
          // rel={linkTarget ? 'noopener noreferrer' : undefined}
          size="sm"
        >
          faster index builds
        </Link>
        , ensuring seamless scaling for your AI applications.
      </p>
    </Container>
    <Container className="mt-[78px] !p-0" size="medium">
      <div className="aspect-[1472/521] w-full overflow-hidden">
        {/* TODO: optimize svg rendering */}
        <Increase className="relative right-1.5 aspect-[1472/858] h-auto w-full [shape-rendering:geometricprecision]" />
      </div>
    </Container>
  </section>
);

export default Boost;
