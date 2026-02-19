import Container from 'components/shared/container';
import PauseableVideo from 'components/shared/pauseable-video';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';

const Hero = () => (
  <section className="hero relative min-h-[848px] w-full overflow-hidden border-b border-gray-new-20 pb-20 pt-[104px] xl:min-h-[650px] xl:pb-[136px] xl:pt-20 lg:min-h-[525px] lg:pb-[88px] lg:pt-16 md:min-h-[509px] md:pb-20 md:pt-12">
    <Container className="w-full text-left" size="branching">
      <SectionLabel>Branching</SectionLabel>
      <h1 className="mt-5 font-sans text-[60px] font-normal leading-dense tracking-tighter xl:mt-[18px] xl:text-[52px] lg:mt-4 lg:text-[44px] md:text-[32px]">
        Mastering Database
        <br /> Branching Workflows
      </h1>
      <p className="mt-6 text-lg leading-normal tracking-extra-tight text-gray-new-60 xl:mt-5 lg:mt-[18px] lg:text-base md:mt-4 md:text-[15px]">
        Ship software faster using Neon branches
      </p>
    </Container>

    {/*
     Video optimization parameters:
     mp4: ffmpeg -i input.mov -c:v libx265 -crf 32 -pix_fmt yuv420p10le -vf "scale=2560:-2,unsharp=3:3:2.5:3:3:0.8" -preset veryslow -x265-params "tune=animation:deblock=-1,-1" -tag:v hvc1 -movflags faststart -an hero.mp4
     webm: ffmpeg -i input.mov -c:v libsvtav1 -pix_fmt yuv420p10le -b:v 1140k -vf scale=2560:-2:flags=lanczos,unsharp=3:3:2.5:3:3:0.8 -svtav1-params preset=4:lookahead=120:keyint=80:tune=0:sharpness=7:film-grain-denoise=0 -pass 1 -an -f null /dev/null && ffmpeg -i input.mov -c:v libsvtav1 -pix_fmt yuv420p10le -b:v 1140k -vf scale=2560:-2:flags=lanczos,unsharp=3:3:2.5:3:3:0.8 -svtav1-params preset=4:lookahead=120:keyint=80:tune=0:sharpness=7:film-grain-denoise=0 -pass 2 -an -y hero.webm
    */}

    <div className="absolute inset-0 -z-10 mx-auto h-full w-full max-w-[1920px] [@media(min-width:1921px)]:[mask-image:linear-gradient(to_right,black_85%,transparent_100%)]">
      <PauseableVideo
        className="relative h-full w-full"
        width={1920}
        height={848}
        videoClassName="h-full w-full object-cover"
      >
        <source
          src={`${LINKS.cdn}/public/pages/branching/hero/branching-anim.mp4`}
          type="video/mp4"
        />
        <source
          src={`${LINKS.cdn}/public/pages/branching/hero/branching-anim.webm`}
          type="video/webm"
        />
      </PauseableVideo>
    </div>
  </section>
);

export default Hero;
