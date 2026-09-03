const CANVAS_WIDTH = 416;

const toCanvasUnit = (value) => `${(value / CANVAS_WIDTH) * 100}cqw`;

const HORIZONTAL_DASH = `repeating-linear-gradient(90deg, #494b50 0 ${toCanvasUnit(
  4
)}, transparent ${toCanvasUnit(4)} ${toCanvasUnit(8)})`;
const VERTICAL_DASH = `repeating-linear-gradient(180deg, #494b50 0 ${toCanvasUnit(
  4
)}, transparent ${toCanvasUnit(4)} ${toCanvasUnit(8)})`;

const PATHS = [
  { left: 159, top: 68, width: 336, height: 129, showLeft: true },
  { left: 159, top: 119, width: 215, height: 78, showLeft: false },
  { left: 159, top: 167, width: 118, height: 30, showLeft: false },
];

const PATH_LABELS = [
  { label: 'WebSocket stays open', left: 240, top: 39 },
  { label: 'SSE streaming', left: 217, top: 91 },
  { label: 'AI + tools', left: 180, top: 139 },
];

const TIMELINE_POINTS = [
  { label: 'Request', left: 51, labelLeft: 29, outlined: true },
  { label: 'Respond', left: 154, labelLeft: 158.5, centered: true },
  { label: 'Work', left: 272, labelLeft: 276.5, centered: true },
  { label: 'Stream', left: 370, labelLeft: 352 },
];

const LongRunningIllustration = () => (
  <div
    className="pointer-events-none relative aspect-[416/275] w-full overflow-hidden bg-gray-new-8 font-sans select-none"
    style={{ containerType: 'inline-size' }}
    data-figma-node-id="3122:2129"
    aria-hidden="true"
  >
    {PATHS.map(({ left, top, width, height, showLeft }) => (
      <span
        className="absolute"
        style={{
          left: toCanvasUnit(left),
          top: toCanvasUnit(top),
          width: toCanvasUnit(width),
          height: toCanvasUnit(height),
        }}
        key={`${top}-${width}`}
      >
        <span
          className="absolute top-0 left-0 h-px w-full -translate-y-1/2"
          style={{ backgroundImage: HORIZONTAL_DASH }}
        />
        {showLeft ? (
          <span
            className="absolute top-0 left-0 h-full w-px -translate-x-1/2"
            style={{ backgroundImage: VERTICAL_DASH }}
          />
        ) : null}
        <span
          className="absolute top-0 right-0 h-full w-px translate-x-1/2"
          style={{ backgroundImage: VERTICAL_DASH }}
        />
      </span>
    ))}

    {PATH_LABELS.map(({ label, left, top }) => (
      <span
        className="absolute font-mono leading-[1.375] whitespace-nowrap text-gray-new-60"
        style={{
          left: toCanvasUnit(left),
          top: toCanvasUnit(top),
          fontSize: toCanvasUnit(13),
          letterSpacing: toCanvasUnit(-0.26),
        }}
        key={label}
      >
        {label}
      </span>
    ))}

    <span
      className="absolute h-px -translate-y-1/2 bg-green-44"
      style={{
        left: toCanvasUnit(54),
        top: toCanvasUnit(197),
        width: toCanvasUnit(468),
      }}
    />

    {TIMELINE_POINTS.map(({ label, left, labelLeft, outlined, centered }) => (
      <span className="contents" key={label}>
        <span
          className={`absolute rounded-full ${
            outlined ? 'border border-green-44 bg-gray-new-8' : 'bg-green-44'
          }`}
          style={{
            left: toCanvasUnit(left),
            top: toCanvasUnit(192),
            width: toCanvasUnit(10),
            height: toCanvasUnit(10),
          }}
        />
        <span
          className={`absolute leading-[1.375] whitespace-nowrap text-gray-new-90 ${
            centered ? '-translate-x-1/2' : ''
          }`}
          style={{
            left: toCanvasUnit(labelLeft),
            top: toCanvasUnit(218),
            fontSize: toCanvasUnit(14),
            letterSpacing: toCanvasUnit(-0.28),
          }}
        >
          {label}
        </span>
      </span>
    ))}
  </div>
);

export default LongRunningIllustration;
