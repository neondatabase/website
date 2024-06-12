import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import PauseableVideo from 'components/shared/pauseable-video';
import LINKS from 'constants/links';

const Try = () => (
  <section className="safe-paddings pb-36 pt-[80px] md:pb-32 md:pt-16 sm:py-10 sm:pb-20">
    <Container size="1152">
      <div className="flex justify-center gap-24 xl:px-8 lg:gap-16 lg:px-0 md:flex-col md:justify-center md:gap-10">
        <div className="flex-1 md:flex md:flex-col md:items-center">
          <Heading
            className="max-w-sm text-[52px] font-medium leading-none tracking-extra-tight xl:max-w-[640px] xl:text-[44px] lg:max-w-xl lg:text-4xl md:max-w-md md:text-center md:text-[32px]"
            tag="h2"
          >
            Try Neon on the command&nbsp;line
          </Heading>
          <p className="mt-4 text-lg font-light leading-snug xl:text-lg lg:mt-4 md:mt-2.5 md:text-center md:text-base">
            The Neon CLI brings serverless Postgres to&nbsp;your&nbsp;terminal.
          </p>
          <AnimatedButton
            className="relative mt-9 px-6 py-[17px] text-lg font-semibold tracking-[-0.02em] lg:mt-7 md:mt-6"
            theme="primary"
            to={LINKS.cliInstall}
            isAnimated
          >
            View setup instructions
          </AnimatedButton>
        </div>
        <div className="w-1/2 rounded-[10px] md:w-full">
          <PauseableVideo width={1152} height={698}>
            <source src="/videos/pages/cli/code.mp4" type="video/mp4" />
            <source src="/videos/pages/cli/code.webm" type="video/webm" />
          </PauseableVideo>
        </div>
      </div>
    </Container>
  </section>
);

export default Try;
