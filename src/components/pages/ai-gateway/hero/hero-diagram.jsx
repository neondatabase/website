import RiveAnimation from 'components/shared/rive-animation';
import { aiGatewayPageContent } from 'constants/backend-platform-page-content';

const HeroDiagram = () => (
  <div
    className="w-full overflow-hidden"
    role="img"
    aria-label={aiGatewayPageContent.hero.illustrationDescription}
  >
    <div className="relative aspect-[672/251] w-full bg-[#151617] sm:w-[110%] sm:translate-x-[-3.6%]">
      <RiveAnimation
        className="pointer-events-none size-full select-none"
        wrapperClassName="absolute inset-0 size-full"
        src="/animations/pages/ai-gateway/hero.riv?20260902"
      />
    </div>
  </div>
);

export default HeroDiagram;
