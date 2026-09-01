import RiveAnimation from 'components/shared/rive-animation';

const Illustration = () => (
  <div
    className="pointer-events-none relative aspect-[1344/502] w-full overflow-hidden bg-[#151617] select-none"
    data-figma-node-id="3122:1275"
    role="img"
    aria-label="An application connects to long-running serverless Node.js Functions inside a Neon branch. Functions connect to Lakebase Postgres, AI Gateway, and Object Storage."
  >
    <RiveAnimation
      className="pointer-events-none size-full select-none"
      wrapperClassName="absolute inset-0 size-full"
      src="/animations/pages/functions/hero.riv?20260901"
    />
  </div>
);

export default Illustration;
