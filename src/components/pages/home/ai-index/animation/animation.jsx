import PauseableVideo from 'components/shared/pauseable-video';

import ParallaxVocabulary from './parallax-vocabulary';

const Animation = () => (
  <div className="relative z-0 mx-auto mt-[-218px] aspect-square max-w-[1160px] xl:mt-[-147px] xl:max-w-[860px] lg:mt-[-120px] lg:max-w-[680px] sm:-mx-4 sm:-mt-12 sm:w-[calc(100%+32px)]">
    {/* 
      Video optimization parameters:
      mp4: -pix_fmt yuv420p -vf scale=2000:-2 -movflags faststart -vcodec libx264 -crf 20
      webm: -c:v libvpx-vp9 -crf 20 -vf scale=2000:-2 -deadline best -an ai-loop.webm
    */}
    <PauseableVideo width={1160} height={1160}>
      <source src="/videos/pages/home/ai-loop.mp4?updated=20240422210955" type="video/mp4" />
      <source src="/videos/pages/home/ai-loop.webm?updated=20240422210955" type="video/webm" />
    </PauseableVideo>
    <ParallaxVocabulary className="absolute left-1/2 top-[15.5%] w-[1280px] -translate-x-1/2 xl:top-8 xl:w-[930px] lg:-top-14 lg:w-[740px] md:top-[48%] md:w-[110%] md:-translate-x-1/2 md:-translate-y-1/2" />
  </div>
);

export default Animation;
