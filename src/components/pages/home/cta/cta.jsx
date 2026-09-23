import Button from 'components/shared/button';
import Container from 'components/shared/container';
import PauseableVideo from 'components/shared/pauseable-video';
import LINKS from 'constants/links';

import CopyCodeButton from './copy-code-button';

const CTA = () => (
  <section className="cta relative bg-[#151617] safe-paddings">
    <div className="absolute inset-0 z-10 pt-14 pb-9 xl:pt-12 xl:pb-5 lg:pt-9 md:pt-[52px] md:pb-6">
      <Container className="flex h-full flex-col" size="1920">
        <h2 className="text-[5rem] leading-none tracking-tighter 2xl:text-[4.5rem] xl:text-[3.5rem] lg:text-[2.75rem] md:text-[2rem]">
          The world&apos;s most advanced <br /> backend platform.
        </h2>

        <div className="mt-auto flex items-end justify-between gap-x-14 lg:flex-col lg:items-start lg:gap-y-5 md:gap-y-6">
          <p className="max-w-[860px] text-[32px] leading-tight tracking-tighter xl:max-w-[480px] xl:text-[24px] lg:max-w-[520px] lg:text-[20px] md:text-[18px]">
            Trusted by developers, ready for agents. <br className="xs:hidden" /> Build and scale
            applications faster with Neon.
          </p>
          <div className="mb-2 flex items-center gap-5 xl:gap-4 lg:mb-0 md:w-full md:flex-col md:items-stretch md:gap-y-3">
            <Button theme="white-filled" size="new" to={LINKS.signup}>
              Get started
            </Button>
            <Button
              className="bg-[rgba(255,255,255,0.02)]"
              theme="outlined"
              size="new"
              to={LINKS.docsHome}
            >
              Read the docs
            </Button>
            <CopyCodeButton
              className="inline-flex items-center gap-x-3 font-mono font-medium!"
              code="npx neon init"
              copyText="npx neon@latest init"
            />
          </div>
        </div>
      </Container>
    </div>

    <div className="pointer-events-none relative overflow-hidden">
      {/* Footer: 3840×1888, 30 FPS, 14 seconds, no audio. AV1 CRF 40 / HEVC CRF 30 / VP9 CRF 34. */}
      <PauseableVideo
        className="aspect-[1920/944] max-h-[944px] w-full lg:left-1/2 lg:w-[1024px] lg:-translate-x-1/2 md:hidden"
        videoClassName="size-full object-cover"
        width={1920}
        height={944}
      >
        <source
          src={`${LINKS.cdn}/public/images/pages/home/cta/cta-new-av1.mp4?updated=20260922`}
          type='video/mp4; codecs="av01.0.12M.08"'
        />
        <source
          src={`${LINKS.cdn}/public/images/pages/home/cta/cta-new.mp4?updated=20260922`}
          type='video/mp4; codecs="hvc1"'
        />
        <source
          src={`${LINKS.cdn}/public/images/pages/home/cta/cta-new.webm?updated=20260922`}
          type="video/webm"
        />
      </PauseableVideo>

      <div className="relative hidden h-170 w-full overflow-hidden bg-[#484848] md:block xs:aspect-3/5 xs:h-auto">
        <PauseableVideo
          className="absolute top-1/2 left-1/2 aspect-512/680 w-full min-w-128 -translate-x-1/2 -translate-y-1/2 xs:aspect-auto xs:min-h-full xs:min-w-[105%]"
          videoClassName="size-full object-cover"
          width={512}
          height={680}
        >
          <source
            src={`${LINKS.cdn}/public/images/pages/home/cta/cta-mob-v1-av1.mp4`}
            type='video/mp4; codecs="av01.0.08M.08"'
          />
          <source
            src={`${LINKS.cdn}/public/images/pages/home/cta/cta-mob-v1.mp4`}
            type='video/mp4; codecs="hvc1"'
          />
          <source
            src={`${LINKS.cdn}/public/images/pages/home/cta/cta-mob-v1.webm`}
            type="video/webm"
          />
        </PauseableVideo>
      </div>
    </div>
  </section>
);

export default CTA;
