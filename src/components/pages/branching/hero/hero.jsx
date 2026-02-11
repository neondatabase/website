import Image from 'next/image';

import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';
import background from 'images/pages/branching/bg.png';

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
    <Image
      className="absolute bottom-0 left-0 -z-10 h-full min-h-[1150px] w-full object-cover xl:min-h-[864px] xl:object-[56.5%_50%] lg:min-h-[625px] lg:object-[56%_50%] md:min-h-[509px] md:object-[80%_50%]"
      width={1920}
      height={1150}
      src={background}
      sizes="(max-width: 767px) 850px, (max-width: 1023px) 1044px, (max-width: 1279px) 1442px, 100vw"
      aria-hidden="true"
      alt=""
      priority
    />
    {/*

    TODO: Replace the static <Image /> background with <PauseableVideo /> once the motion asset is ready.
    Import PauseableVideo and hook up /videos/pages/branching/branching.{mp4,webm} (+ poster) when available.

    Recommended video omtimization parameters:
       mp4: -pix_fmt yuv420p -vf scale=2392:-2 -movflags faststart -vcodec libx264 -crf 20
       webm: -c:v libvpx-vp9 -crf 20 -vf scale=2392:-2 -deadline best -an

    <PauseableVideo
      className="absolute inset-0 -z-10 h-full w-full"
      width={1920}
      height={848}
      poster="/images/pages/branching/branching.jpg"
    >
      <source src="/videos/pages/branching/branching.mp4" type="video/mp4" />
      <source src="/videos/pages/branching/branching.webm" type="video/webm" />
    </PauseableVideo>
    
    */}
  </section>
);

export default Hero;
