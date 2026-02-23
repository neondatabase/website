import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import PauseableVideo from 'components/shared/pauseable-video';
import LINKS from 'constants/links';

const Hero = () => (
  <section className="hero safe-paddings relative h-[820px] border-b border-gray-new-20 xl:h-[904px] lg:h-[665px] md:h-[587px]">
    <Container
      className="flex h-full w-full flex-col items-center justify-between pb-12 pt-[402px] lg:pb-10 lg:pt-[210px] md:justify-end md:gap-y-36 md:pt-0"
      size="1600"
    >
      <Heading
        className="text-center lg:max-w-[544px] md:max-w-80"
        tag="h1"
        theme="white"
        size="md-new"
      >
        Neon is the Postgres layer for the internet
      </Heading>
      <div className="flex w-full items-center justify-between xl:items-end lg:flex-col lg:items-start lg:gap-y-6">
        <p className="max-w-[704px] font-sans text-xl font-normal leading-snug tracking-extra-tight text-gray-new-80 xl:max-w-md lg:max-w-[640px] lg:text-lg md:max-w-80 md:text-[15px] ">
          Neon is built on a distributed architecture that separates storage and compute, unlocking
          a new level of performance, reliability, and scale.
        </p>
        <div className="flex items-center justify-center gap-x-5 xl:gap-4 xl:pb-2 lg:pb-0 md:w-full md:flex-col">
          <Button
            size="lg-new"
            theme="white-filled"
            className="shrink-0 font-medium xl:min-w-0 md:w-full"
            to={LINKS.signup}
          >
            Create an account
          </Button>
          <Button
            size="lg-new"
            theme="outlined"
            className="shrink-0 font-normal xl:min-w-0 md:w-full"
            to={LINKS.careers}
          >
            View open roles at Databricks
          </Button>
        </div>
      </div>
    </Container>

    {/*
       Video optimization parameters:
       mp4: ffmpeg -i input.mov -c:v libx265 -crf 28 -pix_fmt yuv420p10le -vf scale=2880:-2 -preset veryslow -x265-params tune=animation -tag:v hvc1 -movflags faststart -an hero.mp4
       webm: ffmpeg -i input.mov -c:v libsvtav1 -pix_fmt yuv420p10le -b:v 3681k -vf scale=2880:-2 -svtav1-params preset=4:lookahead=120:keyint=80 -pass 1 -an -f null /dev/null && ffmpeg -i input.mov -c:v libsvtav1 -pix_fmt yuv420p10le -b:v 3681k -vf scale=2880:-2 -svtav1-params preset=4:lookahead=120:keyint=80 -pass 2 -an -y hero.webm
    */}

    <div className="absolute inset-0 -z-10 mx-auto max-w-[1920px]">
      <PauseableVideo
        className="h-full w-full"
        videoClassName="h-full w-full object-cover top-12 xl:top-0 lg:scale-[1.2] lg:-top-12 md:scale-100 md:-top-24"
        width={2880}
        height={1328}
      >
        <source src={`${LINKS.cdn}/public/pages/about/hero/hero-anim.mp4`} type="video/mp4" />
        <source src={`${LINKS.cdn}/public/pages/about/hero/hero-anim.webm`} type="video/webm" />
      </PauseableVideo>
    </div>
  </section>
);

export default Hero;
