import Button from 'components/shared/button';
import PauseableVideo from 'components/shared/pauseable-video';
import LINKS from 'constants/links';

import CopyCodeButton from './copy-code-button';

const CTA = () => (
  <section className="cta safe-paddings relative bg-[#151617]">
    <div className="absolute inset-0 z-10 mx-auto flex max-w-[1920px] flex-col px-16 pb-9 pt-14 text-white xl:px-8 xl:pb-5 xl:pt-12 lg:pt-9 md:px-5 md:pb-6 md:pt-[52px]">
      <h2 className="text-[80px] leading-none tracking-tighter xl:text-[64px] lg:text-[44px] md:text-[32px]">
        Features of tomorrow. <br /> Available today.
      </h2>

      <div className="mt-auto flex items-end justify-between gap-x-14 lg:flex-col lg:items-start lg:gap-y-5 md:gap-y-6">
        <p className="max-w-[860px] text-[32px] leading-tight tracking-tighter xl:max-w-[440px] xl:text-[24px] lg:max-w-[520px] lg:text-[20px] md:text-[18px]">
          Trusted by developers, ready for agents. Build and scale applications faster with Neon.
        </p>
        <div className="mb-2 flex items-center gap-5 xl:gap-4 lg:mb-0 md:w-full md:flex-col md:items-stretch md:gap-y-3">
          <Button theme="white-filled" size="new" to={LINKS.signup}>
            Get started
          </Button>
          <Button
            className="bg-[rgba(255,255,255,0.02)] !font-normal"
            theme="gray-40-outline"
            size="new"
            to={LINKS.docsBranching}
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

    <div className="pointer-events-none relative overflow-hidden">
      {/*
        Video optimization parameters:
          mp4 av1: ffmpeg -i cta-origin.mov -c:v libaom-av1 -crf 25 -b:v 0 -pix_fmt yuv420p10le -vf scale=2880:-2 -cpu-used 0 -tiles 4x2 -row-mt 1 -threads 16 -strict experimental -tag:v av01 -movflags faststart -an cta-av1.mp4
          mp4: ffmpeg -i cta-origin.mov -c:v libx265 -crf 25 -pix_fmt yuv420p10le -vf scale=2880:-2 -preset veryslow -tag:v hvc1 -movflags faststart -an cta.mp4
          webm: ffmpeg -i cta-origin.mov -c:v libvpx-vp9 -pix_fmt yuv420p10le -crf 35 -vf scale=2880:-2 -deadline best -an cta.webm
      */}
      <PauseableVideo
        className="aspect-[1920/944] max-h-[944px] w-full lg:w-[1024px] md:hidden"
        videoClassName="size-full object-cover"
        width={1920}
        height={944}
      >
        <source
          src={`${LINKS.cdn}/public/pages/home/cta/cta-av1.mp4`}
          type="video/mp4; codecs=av01.0.05M.08,opus"
        />
        <source src={`${LINKS.cdn}/public/pages/home/cta/cta.mp4`} type="video/mp4" />
        <source src={`${LINKS.cdn}/public/pages/home/cta/cta.webm`} type="video/webm" />
      </PauseableVideo>

      {/*
        Mobile video optimization parameters:
          mp4 av1: ffmpeg -i cta-mob-origin.mov -c:v libaom-av1 -crf 25 -b:v 0 -pix_fmt yuv420p10le -vf scale=1000:-2 -cpu-used 0 -tiles 4x2 -row-mt 1 -threads 16 -strict experimental -tag:v av01 -movflags faststart -an cta-mob-av1.mp4
          mp4: ffmpeg -i cta-mob-origin.mov -c:v libx265 -crf 26 -vf scale=1000:-2 -preset veryslow -tag:v hvc1 -movflags faststart -an cta-mob.mp4
          webm: ffmpeg -i cta-mob-origin.mov -c:v libvpx-vp9 -crf 35 -vf scale=1000:-2 -deadline best -an cta-mob.webm
      */}
      <PauseableVideo
        className="hidden h-[500px] w-full md:block"
        videoClassName="size-full object-cover"
        width={767}
        height={767}
      >
        <source
          src={`${LINKS.cdn}/public/pages/home/cta/cta-mob-av1.mp4`}
          type="video/mp4; codecs=av01.0.05M.08,opus"
        />
        <source src={`${LINKS.cdn}/public/pages/home/cta/cta-mob.mp4`} type="video/mp4" />
        <source src={`${LINKS.cdn}/public/pages/home/cta/cta-mob.webm`} type="video/webm" />
      </PauseableVideo>
    </div>
  </section>
);

export default CTA;
