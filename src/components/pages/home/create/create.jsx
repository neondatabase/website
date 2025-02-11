import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import GradientBorder from 'components/shared/gradient-border';
import PauseableVideo from 'components/shared/pauseable-video';
import bg from 'images/pages/home/hero/bg.jpg';

const Create = () => (
  <section className="hero safe-paddings relative pt-36 xl:pt-[120px] lg:pt-[104px] md:pt-24">
    <Container className="relative z-10 xl:px-8" size="1100">
      <div className="mx-auto max-w-[640px] text-center xl:max-w-xl lg:max-w-lg sm:max-w-xs">
        <span className="mx-auto mb-3.5 block text-sm font-medium uppercase leading-none text-[#66FFDB]/80 lg:mb-3 md:text-xs">
          Customer Spotlight
        </span>
        <h1 className="font-title text-[72px] font-medium leading-[0.94] tracking-extra-tight text-white xl:text-[64px] xl:-tracking-[0.03em] lg:text-[56px] sm:text-[32px]">
          <span className="bg-gradient-to-b from-white from-30% to-[#99FFE7] bg-clip-text text-transparent">
            Create.xyz
          </span>{' '}
          ships faster&nbsp;with&nbsp;Postgres
        </h1>
        <p className="mt-3 text-lg font-light leading-snug tracking-tighter text-gray-new-80 lg:mt-2 lg:text-base md:text-balance">
          Text to app platform Create.xyz uses the latest Al models to turn your prompts
          into&nbsp;deployable apps, Neon database included!
        </p>
        <Button
          className="pointer-events-auto relative mt-8 px-[46px] font-semibold xl:mt-6 lg:px-9"
          theme="primary"
          size="md-new"
          to="https://create.xyz"
          target="_blank"
          rel="noopener noreferrer"
          tag_name="Hero"
          analyticsEvent="home_hero_get_started_clicked"
        >
          Try Create.xyz
        </Button>
      </div>

      <div className="relative mx-auto mt-[90px] w-fit xl:mt-16 lg:mt-11 md:mt-10">
        <div className="relative z-20 rounded-[14px] shadow-[0_0_8px_0_rgba(0,0,0,0.25)] xl:rounded-[13px] lg:rounded-[10px] sm:rounded-md">
          {/* 
            Video optimization parameters:
            -mp4: -pix_fmt yuv420p -vf scale=1664:-2 -movflags faststart -vcodec libx264 -crf 20
            -webm: -c:v libvpx-vp9 -crf 20 -vf scale=1664:-2 -deadline best -an
          */}
          <PauseableVideo
            className="z-10 rounded-[inherit]"
            videoClassName="xl:w-full xl:max-w-3xl lg:max-w-xl"
            width={832}
            height={468}
            poster="/videos/pages/home/create/create.jpg"
          >
            <source src="/videos/pages/home/create/create.mp4" type="video/mp4" />
            <source src="/videos/pages/home/create/create.webm" type="video/webm" />
          </PauseableVideo>
          <GradientBorder className="-inset-px border-image-home-hero-video-border" />
        </div>
        {/* border */}
        <div
          className="pointer-events-none absolute -inset-1.5 z-10 rounded-[18px] bg-[#C4DAFB]/5 shadow-[0_0_40px_0_rgba(0,0,0,0.5)] xl:rounded-2xl lg:rounded-xl sm:rounded-md"
          aria-hidden
        >
          <GradientBorder className="border-image-home-hero-video-border" />
          <span className="absolute inset-0 rounded-[inherit] bg-home-hero-video-bg" />
        </div>
        {/* highlight */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-[9%] -top-[17%] aspect-square w-1/3 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,#174F4F_20%,transparent)] opacity-50" />
          <div className="absolute -left-[28%] -top-1/2 aspect-square w-4/5 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,#1E3A3E_20%,transparent)] opacity-50" />
          <div className="absolute -bottom-1/2 -right-[28%] aspect-square w-4/5 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,#1E2E3E_20%,transparent)] opacity-50" />
        </div>
      </div>
    </Container>

    <Image
      className="pointer-events-none absolute left-1/2 top-0 max-w-none -translate-x-1/2 xl:top-8 xl:w-[1588px] lg:top-6 lg:w-[1420px] md:top-[76px] md:w-[1058px]"
      src={bg}
      sizes="(max-width: 767px) 1058px"
      width={1920}
      height={1210}
      quality={100}
      alt=""
      priority
    />
  </section>
);

export default Create;
