import PropTypes from 'prop-types';

import RiveAnimation from 'components/shared/rive-animation';
import { aiGatewayPageContent } from 'constants/backend-platform-page-content';
import { cn } from 'utils/cn';

const HeroDiagram = ({ className }) => (
  <div
    className={cn('w-full overflow-hidden', className)}
    role="img"
    aria-label={aiGatewayPageContent.hero.illustrationDescription}
  >
    <div className="relative aspect-[672/251] w-full bg-[#151617] sm:w-[110%] sm:translate-x-[-3.6%]">
      <RiveAnimation
        className="pointer-events-none size-full select-none"
        wrapperClassName="absolute inset-0 size-full"
        src="/animations/pages/ai-gateway/hero.riv?20260901"
      />
    </div>
  </div>
);

HeroDiagram.propTypes = {
  className: PropTypes.string,
};

export default HeroDiagram;
