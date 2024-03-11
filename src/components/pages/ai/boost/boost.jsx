import Image from 'next/image';

import Container from 'components/shared/container/container';
import GradientLabel from 'components/shared/gradient-label';
import Link from 'components/shared/link/link';

import increase from './images/increase.svg';

const Boost = () => (
  <section className="boost safe-paddings mt-48 xl:mt-[124px] lg:mt-28 md:mt-20">
    <Container className="flex flex-col items-center" size="medium">
      <GradientLabel>Perfomance</GradientLabel>
      <h2 className="mt-3 text-center text-5xl font-medium leading-dense tracking-extra-tight xl:text-[44px] lg:text-4xl md:text-[32px]">
        Boost AI performance
        <br />
        with parallel index building
      </h2>
      <p className="mt-3 max-w-[485px] text-center text-lg font-light leading-snug tracking-normal xl:text-base">
        Experience up to 30x&nbsp;
        {/* TODO: insert href */}
        <Link className="underline-offset-[3px]" theme="green-underlined" to="/" size="sm">
          faster index builds
        </Link>
        , ensuring seamless scaling for your AI applications.
      </p>
    </Container>
    <Container className="mt-2 flex justify-center !p-0" size="medium">
      <Image className="sm:w-[150%] sm:max-w-none" src={increase} width={1472} height={568} />
    </Container>
  </section>
);

export default Boost;
