// import Image from 'next/image';

import Container from 'components/shared/container';
import PauseableVideo from 'components/shared/pauseable-video';
import SectionLabel from 'components/shared/section-label';
// import background from 'images/pages/branching/bg.png';

const Hero = () => (
  <section className="hero relative min-h-[848px] w-full overflow-hidden border-b border-gray-new-20 pb-20 pt-[104px] xl:min-h-[650px] xl:pb-[136px] xl:pt-20 lg:min-h-[525px] lg:pb-[88px] lg:pt-16 md:min-h-[509px] md:pb-20 md:pt-12">
    <Container className="w-full text-left" size="branching">
      <SectionLabel>Branching</SectionLabel>
      <h1 className="mt-5 font-sans text-[60px] font-normal leading-dense tracking-tighter xl:mt-[18px] xl:text-[52px] lg:mt-4 lg:text-[44px] md:text-[32px]">
        Mastering Database
        <br /> Branching Workflows
      </h1>
      <p className="mt-6 text-lg leading-normal tracking-extra-tight text-gray-new-60 xl:mt-5 lg:mt-[18px] lg:text-base md:mt-4 md:text-[15px]">
        Ship software faster using Neon branches
      </p>
    </Container>

    <div className="absolute inset-0 -z-10 mx-auto h-full w-full max-w-[1920px]">
      <PauseableVideo
        className="relative h-full w-full"
        width={1920}
        height={848}
        videoClassName="h-full w-full object-cover"
      >
        <source src="/videos/pages/branching/branching.mp4" type="video/mp4" />
        <source src="/videos/pages/branching/branching.webm" type="video/webm" />
      </PauseableVideo>
    </div>
  </section>
);

export default Hero;
