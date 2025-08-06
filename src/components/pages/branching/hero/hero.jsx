import PauseableVideo from 'components/shared/pauseable-video';

const Hero = () => (
  <section className="hero safe-paddings">
    <div className="text-center">
      <div className="mx-auto max-w-[640px] md:max-w-xs">
        <h1 className="mx-auto font-title text-6xl font-medium leading-none tracking-extra-tight xl:text-[56px] lg:text-5xl md:text-[32px]">
          Mastering Database
          <br /> Branching Workflows
        </h1>
        <p className="mt-4 text-lg leading-snug tracking-extra-tight text-gray-new-80 xl:mt-3 lg:mx-auto lg:text-base">
          Ship software faster using Neon branches as ephemeral environments.
        </p>
      </div>
    </div>
    <div className="relative -z-10 mt-14 h-[600px] w-full xl:h-[560px] lg:h-[410px] md:h-[50vw]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* 
          Recommended video omtimization parameters:
          mp4: -pix_fmt yuv420p -vf scale=2392:-2 -movflags faststart -vcodec libx264 -crf 20
          webm: -c:v libvpx-vp9 -crf 20 -vf scale=2392:-2 -deadline best -an
        */}
        <PauseableVideo
          className="-left-[35px] -top-1 w-[1196px] xl:w-[1120px] lg:-left-5 lg:w-[820px] md:-left-3 md:-top-5 md:w-[100vw]"
          width={1196}
          height={900}
          poster="/images/pages/branching/workflow.jpg"
        >
          <source src="/videos/pages/branching/workflow.mp4" type="video/mp4" />
          <source src="/videos/pages/branching/workflow.webm" type="video/webm" />
        </PauseableVideo>
      </div>
    </div>
  </section>
);

export default Hero;
