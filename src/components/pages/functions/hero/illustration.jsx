import Image from 'next/image';

import appIllustration from 'images/pages/functions/hero/app.svg';
import arrowIllustration from 'images/pages/functions/hero/arrow.svg';
import branchIllustration from 'images/pages/functions/hero/branch-diagram.svg';

const CANVAS_WIDTH = 1344;
const CANVAS_HEIGHT = 502;

const toPercentage = (value, dimension) => `${(value / dimension) * 100}%`;
const toCanvasUnit = (value) => `${(value / CANVAS_WIDTH) * 100}cqw`;

const getFrameStyle = (left, top, width, height) => ({
  left: toPercentage(left, CANVAS_WIDTH),
  top: toPercentage(top, CANVAS_HEIGHT),
  width: toPercentage(width, CANVAS_WIDTH),
  height: toPercentage(height, CANVAS_HEIGHT),
});

const Illustration = () => (
  <div
    className="pointer-events-none relative aspect-[1344/502] w-full overflow-hidden bg-[#141517] select-none"
    style={{
      containerType: 'inline-size',
      backgroundImage: `repeating-linear-gradient(90deg, rgba(163, 163, 163, 0.02) 0 ${toPercentage(
        1,
        CANVAS_WIDTH
      )}, transparent ${toPercentage(1, CANVAS_WIDTH)} ${toPercentage(4, CANVAS_WIDTH)})`,
    }}
    data-figma-node-id="3122:1275"
    role="img"
    aria-label="An application connects to long-running serverless Node.js Functions inside a Neon branch. Functions connect to Lakebase Postgres, AI Gateway, and Object Storage."
  >
    <Image
      className="absolute max-w-none"
      style={{
        ...getFrameStyle(111, 145, 346, 213),
        boxShadow: `0 ${toCanvasUnit(6.759)} ${toCanvasUnit(13.517)} rgba(0, 0, 0, 0.06)`,
      }}
      src={appIllustration}
      width={346}
      height={213}
      unoptimized
      priority
      alt=""
    />
    <Image
      className="absolute max-w-none"
      style={getFrameStyle(464.5, 248, 122, 6)}
      src={arrowIllustration}
      width={122}
      height={6}
      unoptimized
      priority
      alt=""
    />
    <Image
      className="absolute max-w-none"
      style={getFrameStyle(594, 60, 640, 382)}
      src={branchIllustration}
      width={640}
      height={382}
      unoptimized
      priority
      alt=""
    />
    <svg
      className="absolute max-w-none overflow-visible"
      style={getFrameStyle(594, 60, 640, 382)}
      viewBox="0 0 640 382"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="0.5" y="0.5" width="639" height="381" stroke="#61646B" strokeDasharray="4 4" />
    </svg>
  </div>
);

export default Illustration;
