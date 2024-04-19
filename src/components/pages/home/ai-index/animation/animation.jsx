import PauseableVideo from 'components/shared/pauseable-video';

import ParallaxVocabulary from './parallax-vocabulary';

const Animation = () => (
  <div className="relative z-0 mx-auto mt-[-218px] aspect-square max-w-[1160px] xl:mt-[-147px] xl:max-w-[860px] lg:-mt-36 lg:max-w-[680px] sm:-mt-12 sm:max-w-[91%]">
    {/* 
      Video optimization parameters:
      mp4: ai-loop.mp4 -c:v libx265 -crf 28 -color_primaries 5 -colorspace 5 -vf scale=2000:-2 -preset veryslow -tag:v hvc1 -movflags faststart -an ai-loop.mp4
      webm: -c:v libvpx-vp9 -crf 48 -color_primaries 5 -colorspace 5  -vf scale=2000:2000 -deadline best -an ai-loop.webm
    */}
    <PauseableVideo width={1160} height={1160}>
      <source src="/videos/pages/home/ai-loop.mp4" type="video/mp4" />
      <source src="/videos/pages/home/ai-loop.webm" type="video/webm" />
    </PauseableVideo>
    <ParallaxVocabulary className="absolute left-1/2 top-[15.5%] w-[1280px] -translate-x-1/2 xl:top-8 xl:w-[930px] lg:-top-14 lg:w-[740px] md:top-[48%] md:w-[110%] md:-translate-x-1/2 md:-translate-y-1/2" />
  </div>
);

export default Animation;
