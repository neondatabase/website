import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import StraightLineSvg from 'images/pages/developer-days/straight-line.inline.svg';

import LineSvg from './images/line.inline.svg';

const CTA = () => (
  <section className="safe-paddings cta sm:pt[190px] bg-black pb-[366px] pt-[568px] text-white xl:pb-[258px] xl:pt-[408px] lg:pb-[226px] md:pb-36 md:pt-[364px] sm:pb-24 sm:pt-[190px]">
    <Container className="relative flex flex-col items-center" size="md">
      <LineSvg className="absolute bottom-[calc(100%+2rem)] left-1/2 h-auto w-[392px] -translate-x-[calc(50%-11.3rem)] xl:hidden" />
      <StraightLineSvg className="absolute bottom-[calc(100%+1rem)] left-1/2 hidden h-auto w-8 -translate-x-1/2 xl:block lg:w-[30px] md:w-7 sm:w-3.5" />
      <Heading className="text-center" size="lg" tag="h2" theme="white">
        Have you tried it yet?
      </Heading>
      <Button
        className="relative mt-8 px-9 py-6 !text-lg xl:!text-base"
        theme="primary"
        size="sm"
        to="https://console.neon.tech/sign_in"
      >
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-[232px] w-full rounded-[32px] opacity-40 blur-[30px] lg:h-[146px] sm:h-[92px]"
          style={{ background: 'linear-gradient(180deg, #00E599 0%, rgba(0, 229, 153, 0) 100%)' }}
        />
        <span className="relative z-10">Try Neon now</span>
      </Button>
    </Container>
  </section>
);

export default CTA;
