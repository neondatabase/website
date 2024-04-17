import Container from 'components/shared/container';
import PauseableVideo from 'components/shared/pauseable-video';

const Multitenancy = () => (
  <section className="multitenancy safe-paddings mt-8 overflow-hidden xl:-mt-9 lg:-mt-7 md:mt-12">
    <Container className="relative z-10 xl:max-w-[704px] lg:pl-24" size="960">
      <h2 className="font-title text-[68px] font-medium leading-[0.9] tracking-extra-tight text-white xl:text-[56px] lg:text-[44px] sm:text-[32px]">
        Thousands of databases.
        <br />
        Zero overhead.
      </h2>
    </Container>
    {/* 
        Video optimization parameters:
        -mp4: -pix_fmt yuv420p -vf scale=:3840-2 -movflags faststart -vcodec libx264 -crf 20
        -webm: -c:v libvpx-vp9 -crf 20 -vf scale=3840:-2 -deadline best -an
    */}
    <PauseableVideo
      className="relative left-1/2 mt-[54px] max-w-[1920px] -translate-x-1/2 xl:mt-11 xl:max-w-[1380px] lg:mt-10 lg:max-w-[1150px] sm:mt-6 sm:max-w-[790px]"
      height={474}
      width={1920}
    >
      <source src="/videos/pages/home/next-gen.mp4?updated=20240411193959" type="video/mp4" />
      <source src="/videos/pages/home/next-gen.webm?updated=20240411193959" type="video/webm" />
    </PauseableVideo>
    <Container
      className="relative z-10 mt-14 xl:mt-[50px] xl:max-w-[704px] lg:mt-[42px] lg:pl-24 md:mt-11 sm:mt-[22px]"
      size="960"
    >
      <p className="max-w-[608px] text-xl leading-snug tracking-extra-tight text-gray-new-50 xl:max-w-xl xl:text-lg lg:max-w-[480px] lg:text-sm sm:text-base">
        Use the Neon API to deploy{` `}
        <span className="font-medium text-white">database-per-tenant architectures</span>. Scale to
        fleets of thousands of databases without touching a server. Rest easy knowing scale to zero
        keeps costs low.
      </p>
    </Container>
  </section>
);

export default Multitenancy;
