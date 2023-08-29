import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container/container';
import LINKS from 'constants/links';

import awsLogo from './images/aws-logo.svg';
import neonLogo from './images/neon-logo.svg';

const Hero = () => (
  <section className="hero safe-paddings relative overflow-hidden pb-[198px] pt-36 2xl:pt-[150px] xl:pb-[120px] xl:pt-[120px] lg:pb-28 lg:pt-[52px] md:pb-20 md:pt-10">
    <Container className="container relative z-10 flex flex-col items-center" size="medium">
      <div className="flex items-center gap-x-[26px]">
        <img
          className="xl:h-20 xl:w-20 md:h-16 md:w-16"
          src={neonLogo}
          alt="Neon Logo"
          width={92}
          height={92}
          loading="eager"
        />
        <span className="relative block h-[18px] w-[18px] before:absolute before:inset-x-0 before:top-1/2 before:h-0.5 before:w-full before:-translate-y-1/2 before:bg-white after:absolute after:inset-y-0 after:left-1/2 after:h-full after:w-0.5 after:-translate-x-1/2 after:bg-white" />
        <img
          className="xl:h-20 xl:w-20 md:h-16 md:w-16"
          src={awsLogo}
          alt="AWS Logo"
          width={92}
          height={92}
          loading="eager"
        />
      </div>
      <h1 className="mt-16 text-center text-6xl font-medium leading-none tracking-extra-tight xl:mt-12 xl:text-[56px] lg:mt-10 lg:text-5xl md:mt-9 md:text-4xl">
        AWS Launches in Israel
      </h1>
      <p className="mt-5 text-center text-xl font-light leading-snug xl:text-lg lg:mt-4 md:mt-2.5 md:max-w-xs">
        Neon is delighted to support the 2023 launch of AWS in Israel.
      </p>
      <AnimatedButton
        className="relative mt-9 px-[75px] py-[17px] text-lg font-semibold tracking-extra-tight lg:mt-8 md:mt-6"
        theme="primary"
        to={LINKS.signup}
        isAnimated
      >
        Sign up
      </AnimatedButton>
    </Container>
  </section>
);

export default Hero;
