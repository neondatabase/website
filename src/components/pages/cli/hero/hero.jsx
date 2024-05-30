import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container/container';
import Link from 'components/shared/link/link';
import LINKS from 'constants/links';

import CodeTabs from './code-tabs';

const Hero = () => (
  <section className="hero safe-paddings relative overflow-hidden pb-[80px] pt-[152px] md:pb-16 md:pt-32 sm:pb-10 sm:pt-20">
    <Container className="relative z-10 flex flex-col items-center" size="medium">
      <div className="absolute left-1/2 top-0 -z-10 h-[270px] w-3/4 -translate-x-1/2 rounded-[1000px] bg-black-pure blur-[30px] lg:w-full" />
      <h1 className="xs:flat-breaks mx-auto text-center font-title text-6xl font-medium leading-none tracking-[-0.02em] xl:text-[56px] lg:text-5xl md:text-4xl sm:text-[36px]">
        Your Neon workflow lives
        <br />
        <span className="text-green-45">in the terminal</span>
      </h1>
      <p className="mt-4 text-center text-xl font-light leading-snug xl:text-lg lg:mt-4 md:mt-2.5 md:text-base">
        The Neon CLI brings serverless Postgres to your terminal.
      </p>
      <AnimatedButton
        className="relative mt-12 px-8 py-[17px] text-lg font-semibold tracking-[-0.02em] lg:mt-7 md:mt-6"
        theme="primary"
        to={LINKS.cliReference}
        linesOffsetTop={22}
        linesOffsetSide={22}
        linesOffsetBottom={40}
        isAnimated
      >
        View setup instructions
      </AnimatedButton>
      <CodeTabs className="mt-[60px] w-[640px] sm:w-full" />
      <Link
        className="mt-[18px] flex items-center text-[15px] leading-none tracking-extra-tight"
        to={LINKS.cliReference}
        theme="green"
        withArrow
      >
        View all Neon CLI commands
      </Link>
    </Container>
  </section>
);

export default Hero;
