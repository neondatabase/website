import PauseableVideo from 'components/shared/pauseable-video';

import ParallaxVocabulary from './parallax-vocabulary';

const Animation = () => (
  <div className="relative z-0 mx-auto -mt-48 aspect-square max-w-[1160px] xl:mt-[-152px] xl:max-w-[860px] lg:mt-[-117px] lg:max-w-[680px] sm:-mt-[52px] sm:max-w-[91%]">
    <PauseableVideo
      className="mix-blend-lighten [filter:brightness(1)_contrast(105%)_saturate(100%)]"
      width={1160}
      height={1160}
    >
      <source src="/videos/pages/home/ai-loop.mp4" type="video/mp4" />
      <source src="/videos/pages/home/ai-loop.webm" type="video/webm" />
    </PauseableVideo>
    <ParallaxVocabulary className="absolute left-1/2 top-[15.5%] w-[1280px] -translate-x-1/2 xl:top-8 xl:w-[930px] lg:-top-14 lg:w-[740px] md:top-[48%] md:w-[110%] md:-translate-x-1/2 md:-translate-y-1/2" />
  </div>
);

export default Animation;
