import Image from 'next/image';

import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';
import background from 'images/pages/branching/bg.png';

const Hero = () => (
  <section className="hero relative h-[848px] w-full border-b border-gray-new-20 pb-20 pt-[104px] xl:h-[650px] xl:pb-[136px] xl:pt-20 lg:h-[525px] lg:pb-[88px] lg:pt-16 md:h-[509px] md:pb-20 md:pt-12">
    <Container className="w-full text-left" size="branching">
      <SectionLabel>Branching</SectionLabel>
      <h1 className="mx-auto mt-5 font-sans text-[60px] font-normal leading-dense tracking-tighter xl:mt-[18px] xl:text-[52px] lg:mt-4 lg:text-[44px] md:text-[32px]">
        Mastering Database
        <br /> Branching Workflows
      </h1>
      <p className="mt-6 text-lg leading-normal tracking-extra-tight text-gray-new-60 xl:mt-5 lg:mt-[18px] lg:text-base md:mt-4 md:text-[15px]">
        Ship software faster using Neon branches
      </p>
    </Container>
    <Image
      className="absolute inset-0 -z-10 h-full w-full object-cover"
      width={1920}
      height={848}
      alt="Hero background image of an abstract branching tree diagram labeled dev, preview, and production."
      src={background}
      sizes="100vw"
      priority
    />
  </section>
);

export default Hero;
