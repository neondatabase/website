import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import PauseableVideo from 'components/shared/pauseable-video';
import LINKS from 'constants/links';

const Hero = () => (
  <section className="hero safe-paddings relative h-[904px] border-b border-gray-new-20 lg:h-[665px] md:h-[555px]">
    <Container
      className="flex h-full w-full flex-col items-center justify-between pb-12 pt-[432px] lg:items-start lg:pb-10 lg:pt-[226px] md:justify-end md:gap-y-4 md:pt-0"
      size="1600"
    >
      <Heading className="lg:max-w-[544px] md:max-w-80" tag="h1" theme="white" size="md-new">
        Neon is the Postgres layer for the internet
      </Heading>
      <div className="flex w-full items-center justify-between xl:items-end lg:flex-col lg:items-start lg:gap-y-6">
        <p className="max-w-[704px] font-sans text-xl font-normal leading-snug tracking-extra-tight text-gray-new-80 xl:max-w-md lg:max-w-[640px] lg:text-lg md:max-w-80 md:text-[15px] md:text-gray-new-60">
          Neon is built on a distributed architecture that separates storage and compute, unlocking
          the level of performance, reliability, and scale.
        </p>
        <div className="flex items-center justify-center gap-x-5 xl:gap-x-4 xl:pb-2 lg:pb-0">
          <Button
            size="lg-new"
            theme="white-filled"
            className="min-w-[230px] shrink-0 font-medium xl:min-w-0"
            to={LINKS.signup}
          >
            Create an account
          </Button>
          <Button
            size="lg-new"
            theme="outlined"
            className="min-w-[230px] shrink-0 font-normal xl:min-w-0"
            to={LINKS.careers}
          >
            View open positions
          </Button>
        </div>
      </div>
    </Container>
    <div className="absolute inset-0 -z-10">
      <PauseableVideo
        className="h-full w-full"
        videoClassName="h-full w-full object-cover top-10 scale-[1.2] lg:top-0 lg:scale-[1.4]"
        width={2390}
        height={1102}
        poster="/images/pages/about/hero.jpg"
      >
        <source src="/videos/pages/about/hero.mp4" type="video/mp4" />
        <source src="/videos/pages/about/hero.webm" type="video/webm" />
      </PauseableVideo>
    </div>
  </section>
);

export default Hero;
