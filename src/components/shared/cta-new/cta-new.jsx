import clsx from 'clsx';
import PropTypes from 'prop-types';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import PauseableVideo from 'components/shared/pauseable-video';
import LINKS from 'constants/links';

import Label from './label';

const CtaNew = ({
  className,
  title = "The world's most advanced <br /> Postgres platform.",
  description = 'Trusted by developers, ready for agents. Build and scale applications faster with Neon.',
  label = 'Get started',
  buttonText = 'Get started',
  buttonUrl = LINKS.signup,
}) => (
  <section className={clsx('cta safe-paddings relative bg-[#151617]', className)}>
    <div className="absolute inset-0 z-10">
      <Container className="top-1/2 -translate-y-1/2" size="1600">
        <Label>{label}</Label>
        <h2
          className="mt-6 max-w-[700px] text-[44px] leading-dense tracking-tighter text-white xl:text-[40px] md:mt-4 md:max-w-none md:text-[32px]"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="max-w-[700px] text-[44px] leading-dense tracking-tighter text-gray-new-50 xl:text-[40px] md:max-w-none md:text-[32px]">
          {description}
        </p>
        <Button className="mt-10 " theme="white-filled" size="new" to={buttonUrl}>
          {buttonText}
        </Button>
      </Container>
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
          src={`${LINKS.cdn}/public/pages/home/cta/cta-av1.mp4?updated=20260113`}
          type="video/mp4; codecs=av01.0.05M.08,opus"
        />
        <source
          src={`${LINKS.cdn}/public/pages/home/cta/cta.mp4?updated=20260113`}
          type="video/mp4"
        />
        <source
          src={`${LINKS.cdn}/public/pages/home/cta/cta.webm?updated=20260113`}
          type="video/webm"
        />
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

CtaNew.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  label: PropTypes.string,
  buttonText: PropTypes.string,
  buttonUrl: PropTypes.string,
};

export default CtaNew;
