import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container/container';
import Link from 'components/shared/link/link';
import LINKS from 'constants/links';

import CodeTabs from './code-tabs';

const Hero = () => (
  <section className="hero safe-paddings relative mb-20 overflow-hidden pt-[152px] xl:pt-[120px] lg:pt-11 md:mb-16 md:pt-8 sm:mb-10">
    <Container className="relative z-10 flex flex-col items-center" size="medium">
      <h1 className="xs:flat-breaks mx-auto text-center font-title text-[72px] font-medium leading-none tracking-tighter xl:text-[56px] lg:text-5xl md:text-4xl sm:text-[36px]">
        Your Neon workflow lives
        <br />
        <span className="text-green-45">in the terminal</span>
      </h1>
      <p className="mt-4 text-center text-xl font-light leading-snug tracking-extra-tight xl:text-lg lg:mt-4 md:mt-2.5 md:text-base">
        The Neon CLI brings serverless Postgres to the command line.
      </p>
      <AnimatedButton
        className="relative mt-9 px-8 py-[17px] text-lg font-semibold tracking-[-0.02em] lg:mt-7 md:mt-6"
        theme="primary"
        to={LINKS.cliReference}
        linesOffsetTop={22}
        linesOffsetSide={22}
        linesOffsetBottom={40}
        isAnimated
      >
        View CLI commands
      </AnimatedButton>
      <CodeTabs className="mt-[60px] w-[640px] sm:w-full" />
      <Link
        className="mt-[18px] flex items-center text-[15px] leading-none tracking-extra-tight"
        to={LINKS.cliInstall}
        theme="green"
        withArrow
      >
        Neon CLI setup instructions
      </Link>
    </Container>
  </section>
);

export default Hero;
