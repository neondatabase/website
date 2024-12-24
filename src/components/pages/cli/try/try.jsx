import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import PauseableVideo from 'components/shared/pauseable-video';
import LINKS from 'constants/links';

const Try = () => (
  <section className="try safe-paddings mb-36 mt-20 md:mb-32 md:mt-16 sm:mb-20 sm:mt-10">
    <Container size="1152">
      <div className="flex items-center justify-center gap-24 xl:px-8 lg:gap-16 lg:px-0 md:flex-col md:justify-center md:gap-10">
        <div className="flex-1 md:flex md:flex-col md:items-center">
          <Heading
            className="max-w-sm text-[52px] font-medium leading-none tracking-extra-tight tracking-tighter xl:max-w-[640px] xl:text-[44px] lg:max-w-xl lg:text-4xl md:max-w-md md:text-center md:text-[32px]"
            tag="h2"
          >
            Try Neon on the command&nbsp;line
          </Heading>
          <p className="mt-4 text-lg font-light leading-snug tracking-extra-tight xl:text-lg lg:mt-4 md:mt-2.5 md:text-center md:text-base">
            The Neon CLI brings serverless Postgres to&nbsp;your&nbsp;terminal.
          </p>
          <AnimatedButton
            className="relative mt-12 px-6 py-[17px] text-lg font-semibold tracking-[-0.02em] lg:mt-7 md:mt-6"
            theme="primary"
            to={LINKS.cliInstall}
            isAnimated
          >
            View setup instructions
          </AnimatedButton>
        </div>
        <div className="w-1/2 md:w-full">
          {/* 
            Recommended video omtimization parameters:
            mp4: -pix_fmt yuv420p -vf scale=1152:-2 -movflags faststart -vcodec libx264 -crf 20
            webm: -c:v libvpx-vp9 -crf 20 -vf scale=1152:-2 -deadline best -an
          */}
          <PauseableVideo className="overflow-hidden rounded-[10px]" width={1152} height={698}>
            <source src="/videos/pages/cli/code.mp4" type="video/mp4" />
            <source src="/videos/pages/cli/code.webm" type="video/webm" />
          </PauseableVideo>
        </div>
      </div>
    </Container>
  </section>
);

export default Try;
