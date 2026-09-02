import RiveAnimation from 'components/shared/rive-animation';
import { functionsPageContent } from 'constants/backend-platform-page-content';

const Illustration = () => (
  <div
    className="pointer-events-none relative aspect-[1344/502] w-full overflow-hidden bg-[#151617] select-none"
    data-figma-node-id="3122:1275"
    role="img"
    aria-label={functionsPageContent.hero.illustrationDescription}
  >
    <RiveAnimation
      className="pointer-events-none size-full select-none"
      wrapperClassName="absolute inset-0 size-full"
      src="/animations/pages/functions/hero.riv?20260902"
    />
  </div>
);

export default Illustration;
