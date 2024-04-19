import Image from 'next/image';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import PauseableVideo from 'components/shared/pauseable-video';
import phoneIllustration from 'images/pages/home/lightning/phone.png';

const Lightning = () => (
  <section className="lightning safe-paddings mt-[209px] xl:mt-32 lg:mt-24 sm:mt-20">
    <Container
      className="pb-[280px] xl:max-w-[704px] xl:pb-[178px] lg:!max-w-[640px] lg:pb-6 md:!max-w-none md:pl-[84px] sm:pl-5"
      size="960"
    >
      <h2 className="inline-block bg-home-lightning-title bg-clip-text pb-6 font-title text-[128px] font-medium leading-[0.95] -tracking-wider text-transparent xl:text-[96px] lg:max-w-lg lg:text-[72px] sm:bg-home-lightning-title-sm sm:text-[52px]">
        Lightning fast. Edge&nbsp;ready.
      </h2>
      {/* 
          Video optimization parameters:
          -mp4: -pix_fmt yuv420p -vf scale=1656:-2 -movflags faststart -vcodec libx264 -crf 20
          -webm: -c:v libvpx-vp9 -crf 20 -vf scale=1656:-2 -deadline best -an
        */}
      <PauseableVideo
        className="z-10 ml-32 mt-[-113px] aspect-[1.181818] mix-blend-plus-lighter [mask-image:radial-gradient(120%_120%_at_45%_-10%,black_77%,transparent_90%)] xl:ml-24 xl:mt-[-103px] xl:min-w-[647px] lg:ml-20 lg:mt-[-91px] lg:min-w-0 lg:max-w-[482px] md:ml-[27px] md:max-w-[484px] sm:ml-0 sm:mt-[-85px] sm:min-w-[484px]"
        width={828}
        height={684}
      >
        <source src="/videos/pages/home/lightning.mp4" type="video/mp4" />
        <source src="/videos/pages/home/lightning.webm" type="video/webm" />
      </PauseableVideo>

      <p className="relative z-10 ml-32 mt-[-347px] max-w-[288px] font-light tracking-extra-tight text-gray-new-80 xl:ml-24 xl:mt-[-283px] xl:leading-snug lg:ml-8 lg:mt-[-201px] lg:max-w-[250px] md:ml-[27px] sm:ml-0 sm:mt-[-203px] sm:max-w-[212px] sm:text-[15px]">
        <span className="font-medium text-white">The Neon serverless driver</span>, designed for
        JavaScript and TypeScript, ensures low-latency Postgres queries. It unlocks database
        connectivity for both serverless and edge environments, utilizing HTTP.
      </p>
      <Link
        className="relative z-10 ml-32 mt-[22px] flex w-fit items-center text-sm font-medium leading-none tracking-[-0.03em] text-white xl:ml-24 lg:ml-8 md:ml-[27px] sm:ml-0"
        to="#"
        withArrow
      >
        Get the Serverless Driver
      </Link>
      <Image
        className="absolute right-[-21px] top-[130px] xl:right-[-57px] xl:top-[84px] xl:max-w-[362px] lg:left-[338px] lg:right-auto lg:top-14 lg:max-w-[271px] sm:left-[247px] sm:top-6 sm:min-w-[271px]"
        sizes="(max-width: 1280px) 362px, (max-width: 1024px) 271px, 464px"
        src={phoneIllustration}
        width={464}
        height={840}
        quality={50}
        alt=""
      />
    </Container>
  </section>
);

export default Lightning;
