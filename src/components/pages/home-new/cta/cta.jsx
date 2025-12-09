import Button from 'components/shared/button';
import PauseableVideo from 'components/shared/pauseable-video';
import links from 'constants/links';

import CopyCodeButton from './copy-code-button';

const CTA = () => (
  <section className="cta safe-paddings relative border-b border-gray-new-20">
    <div className="absolute inset-0 z-30 mx-auto flex max-w-[1920px] flex-col px-16 pb-9 pt-14 text-white xl:px-8 xl:pb-5 xl:pt-12 lg:pt-9 md:px-5 md:pb-6 md:pt-[52px]">
      <h2 className="text-[80px] leading-none tracking-tighter xl:text-[64px] lg:text-[44px] md:text-[32px]">
        Features of tomorrow. <br /> Available today.
      </h2>

      <div className="mt-auto flex items-end justify-between gap-x-14 lg:flex-col lg:items-start lg:gap-y-5 md:gap-y-6">
        <p className="max-w-[860px] text-[32px] leading-tight tracking-tighter xl:max-w-[440px] xl:text-[24px] lg:max-w-[520px] lg:text-[20px] md:text-[18px]">
          Trusted by database developers, this serverless platform helps you build reliable,
          scalable apps faster.
        </p>
        <div className="mb-2 flex items-center gap-5 xl:gap-4 lg:mb-0 md:w-full md:flex-col md:items-stretch md:gap-y-3">
          <Button theme="white-filled" size="new" to={links.signup}>
            Get started
          </Button>
          <Button
            className="bg-[rgba(255,255,255,0.02)] !font-normal"
            theme="gray-40-outline"
            size="new"
            to={links.docsBranching}
          >
            Read the docs
          </Button>
          <CopyCodeButton
            className="inline-flex items-center gap-x-3 font-mono-new !font-medium"
            code="npx neon init"
          />
        </div>
      </div>
    </div>

    <div className="pointer-events-none relative z-10 overflow-hidden">
      {/*
          Video optimization parameters:
            mp4: ffmpeg -i cta-origin.mp4 -c:v libx265 -crf 26 -vf scale=3840:-2 -preset veryslow -tag:v hvc1 -movflags faststart -an cta.mp4
            webm: ffmpeg -i cta-origin.mp4 -c:v libvpx-vp9 -crf 36 -vf scale=3840:-2 -deadline best -an cta.webm
        */}
      <PauseableVideo
        className="aspect-[1920/944] max-h-[944px] w-full lg:w-[1024px] md:hidden"
        videoClassName="size-full object-cover"
        width={1920}
        height={944}
      >
        <source src="/videos/pages/home-new/cta/cta.mp4" type="video/mp4" />
        <source src="/videos/pages/home-new/cta/cta.webm" type="video/webm" />
      </PauseableVideo>

      {/*
          Mobile video optimization parameters:
            mp4: ffmpeg -i footer-crop.mov -c:v libx265 -crf 26 -vf scale=1888:-2 -preset veryslow -tag:v hvc1 -movflags faststart -an cta.mp4
            webm: ffmpeg -i footer-crop.mov -c:v libvpx-vp9 -crf 35 -vf scale=1888:-2 -deadline best -an cta.webm
        */}
      <PauseableVideo
        className="hidden aspect-square w-screen min-w-[510px] md:block"
        videoClassName="size-full object-cover"
        width={944}
        height={944}
      >
        <source src="/videos/pages/home-new/cta/cta-md.mp4" type="video/mp4" />
        <source src="/videos/pages/home-new/cta/cta-md.webm" type="video/webm" />
      </PauseableVideo>
    </div>
  </section>
);

export default CTA;
