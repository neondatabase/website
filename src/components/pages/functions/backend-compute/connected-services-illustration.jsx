import Image from 'next/image';

import connectedCheckIcon from 'icons/functions/backend-compute/connected-check.svg';

const CANVAS_WIDTH = 656;

const toCanvasUnit = (value) => `${(value / CANVAS_WIDTH) * 100}cqw`;

const SERVICES = [
  { name: 'PostgreSQL', credential: 'database_url' },
  { name: 'AI Gateway', credential: 'credentials' },
  { name: 'Object Storage', credential: 'credentials' },
];

const ConnectedServicesIllustration = () => (
  <div
    className="pointer-events-none relative aspect-[656/413] w-full overflow-hidden bg-gray-new-8 font-sans select-none"
    style={{ containerType: 'inline-size' }}
    data-figma-node-id="3122:2084"
    aria-hidden="true"
  >
    <div
      className="absolute overflow-hidden bg-black-new"
      style={{
        left: toCanvasUnit(70),
        top: toCanvasUnit(73),
        width: toCanvasUnit(516),
        height: toCanvasUnit(360),
      }}
    >
      <div
        className="absolute flex flex-col font-normal"
        style={{
          left: toCanvasUnit(19),
          top: toCanvasUnit(19),
          gap: toCanvasUnit(2),
        }}
      >
        <span
          className="leading-[1.375] text-gray-new-98"
          style={{
            fontSize: toCanvasUnit(20),
            letterSpacing: toCanvasUnit(-0.4),
          }}
        >
          Function
        </span>
        <span
          className="font-mono leading-[1.2] text-gray-new-40"
          style={{
            fontSize: toCanvasUnit(14),
            letterSpacing: toCanvasUnit(-0.56),
          }}
        >
          /api/generate
        </span>
      </div>

      <div
        className="absolute flex items-center bg-gray-new-15"
        style={{
          left: toCanvasUnit(405),
          top: toCanvasUnit(19),
          gap: toCanvasUnit(8),
          padding: `${toCanvasUnit(5)} ${toCanvasUnit(6)}`,
        }}
      >
        <span
          className="shrink-0 rounded-full bg-[#ffcc66]"
          style={{ width: toCanvasUnit(5), height: toCanvasUnit(5) }}
        />
        <span
          className="leading-none whitespace-nowrap text-[#ffcc66]"
          style={{
            fontSize: toCanvasUnit(14),
            letterSpacing: toCanvasUnit(-0.28),
          }}
        >
          eu-west-1
        </span>
      </div>

      <span
        className="absolute leading-[1.375] whitespace-nowrap text-gray-new-98"
        style={{
          left: toCanvasUnit(20),
          top: toCanvasUnit(89),
          fontSize: toCanvasUnit(18),
          letterSpacing: toCanvasUnit(-0.36),
        }}
      >
        Automatically connected services
      </span>

      <div
        className="absolute flex flex-col"
        style={{
          left: toCanvasUnit(20),
          top: toCanvasUnit(134),
          width: toCanvasUnit(476),
          gap: toCanvasUnit(16),
        }}
      >
        {SERVICES.map(({ name, credential }, index) => (
          <div className="contents" key={name}>
            <div className="flex items-center justify-between" style={{ height: toCanvasUnit(41) }}>
              <div className="flex flex-col leading-[1.375] font-normal">
                <span
                  className="text-gray-new-90"
                  style={{
                    fontSize: toCanvasUnit(16),
                    letterSpacing: toCanvasUnit(-0.32),
                  }}
                >
                  {name}
                </span>
                <span
                  className="font-mono text-green-44"
                  style={{
                    fontSize: toCanvasUnit(13),
                    letterSpacing: toCanvasUnit(-0.26),
                  }}
                >
                  Connected
                </span>
              </div>

              <div className="flex items-center" style={{ gap: toCanvasUnit(8) }}>
                <span
                  className="relative block shrink-0 overflow-hidden"
                  style={{ width: toCanvasUnit(12), height: toCanvasUnit(12) }}
                >
                  <span
                    className="absolute"
                    style={{
                      left: toCanvasUnit(0.293),
                      top: toCanvasUnit(2.293),
                      width: toCanvasUnit(11.4142),
                      height: toCanvasUnit(7.91421),
                    }}
                  >
                    <Image src={connectedCheckIcon} fill unoptimized alt="" />
                  </span>
                </span>
                <span
                  className="leading-[1.375] whitespace-nowrap text-gray-new-50"
                  style={{
                    fontSize: toCanvasUnit(16),
                    letterSpacing: toCanvasUnit(-0.32),
                  }}
                >
                  {credential}
                </span>
              </div>
            </div>

            {index < SERVICES.length - 1 ? (
              <span className="relative h-0 w-full">
                <span
                  className="absolute left-0 w-full bg-gray-new-20"
                  style={{
                    top: toCanvasUnit(-0.5),
                    height: toCanvasUnit(1),
                  }}
                />
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <span className="pointer-events-none absolute inset-0 border border-gray-new-15" />
    </div>

    <span
      className="absolute border-t border-l border-gray-new-90"
      style={{
        left: toCanvasUnit(70),
        top: toCanvasUnit(73),
        width: toCanvasUnit(10),
        height: toCanvasUnit(10),
      }}
    />
    <span
      className="absolute border-t border-r border-gray-new-90"
      style={{
        left: toCanvasUnit(576),
        top: toCanvasUnit(73),
        width: toCanvasUnit(10),
        height: toCanvasUnit(10),
      }}
    />
  </div>
);

export default ConnectedServicesIllustration;
