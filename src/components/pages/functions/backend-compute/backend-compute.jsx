import Image from 'next/image';

import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';
import aiAgentsIcon from 'icons/functions/backend-compute/ai-agents.svg';
import apiIcon from 'icons/functions/backend-compute/api.svg';
import mcpServersIcon from 'icons/functions/backend-compute/mcp-servers.svg';
import sseIcon from 'icons/functions/backend-compute/sse.svg';
import websocketsIcon from 'icons/functions/backend-compute/websockets.svg';

import ConnectedServicesIllustration from './connected-services-illustration';
import LongRunningIllustration from './long-running-illustration';

const WORKLOADS = [
  { label: 'APIs', icon: apiIcon, nodeId: '3122:2153' },
  { label: 'AI agents', icon: aiAgentsIcon, nodeId: '3122:2161' },
  { label: 'MCP servers', icon: mcpServersIcon, nodeId: '3122:2167' },
  { label: 'WebSockets', icon: websocketsIcon, nodeId: '3122:2173' },
  { label: 'SSE', icon: sseIcon, nodeId: '3122:2183' },
];

const BackendCompute = () => (
  <section
    className="bg-black-pure py-20 safe-paddings text-white lg:py-16 md:py-12"
    data-figma-node-id="3122:2070"
    aria-labelledby="backend-compute-heading"
  >
    <Container size="1344">
      <div className="grid grid-cols-[240px_656px_416px] gap-x-4 min-[1024px]:max-[1407px]:grid-cols-[200px_minmax(0,1.58fr)_minmax(0,1fr)] lg:grid-cols-1">
        <SectionLabel className="mt-3.5 lg:mt-0" theme="white">
          Backend compute
        </SectionLabel>

        <h2
          className="col-span-2 text-5xl leading-[1.125] tracking-tighter xl:text-[44px] lg:col-span-1 lg:mt-5 lg:text-[40px] md:text-[32px]"
          id="backend-compute-heading"
        >
          Run backend logic where your data lives{' '}
          <span className="text-gray-new-50">— and keep it running when the job takes time.</span>
        </h2>

        <div className="col-span-2 col-start-2 mt-[72px] grid grid-cols-[minmax(0,1.577fr)_minmax(0,1fr)] items-end gap-x-4 lg:col-span-1 lg:col-start-1 lg:mt-12 md:grid-cols-1 md:gap-y-10">
          <div className="flex flex-col gap-8">
            <p className="text-lg leading-normal tracking-extra-tight text-gray-new-60 md:text-base">
              <strong className="font-medium text-white">Next to Lakebase Postgres.</strong>{' '}
              Functions run in the same region as your Neon branch, with its{' '}
              <code className="rounded border border-gray-new-30 bg-black-pure px-1 py-px font-mono text-base leading-[1.2] tracking-extra-tight text-white md:text-sm">
                DATABASE_URL
              </code>{' '}
              and credentials for AI Gateway and Object Storage injected automatically.
            </p>

            <ConnectedServicesIllustration />
          </div>

          <div className="flex flex-col gap-8">
            <p className="max-w-[392px] text-lg leading-normal tracking-extra-tight text-gray-new-60 md:max-w-none md:text-base">
              <strong className="font-medium text-white">Serverless and long-running.</strong> Start
              responding quickly, then keep streaming as agents call models and tools, WebSockets
              stay open, or SSE sends live updates.
            </p>

            <LongRunningIllustration />
          </div>
        </div>

        <div className="col-span-2 col-start-2 mt-14 flex items-start justify-between gap-8 border-t border-gray-new-20 pt-[31px] lg:col-span-1 lg:col-start-1 lg:mt-8 lg:flex-col lg:gap-6">
          <p className="pt-1.5 text-xl leading-normal tracking-extra-tight text-gray-new-85 lg:pt-0 md:text-lg">
            For backend work that needs more than a quick response
          </p>

          <ul className="flex max-w-[416px] flex-wrap gap-3.5 lg:max-w-none">
            {WORKLOADS.map(({ label, icon, nodeId }) => (
              <li
                className="relative flex h-10 items-center gap-2 px-3.5 font-mono text-[15px] leading-none font-medium text-gray-new-70 uppercase after:pointer-events-none after:absolute after:inset-0 after:border after:border-gray-new-20 md:h-9 md:px-3 md:text-xs"
                key={label}
              >
                <span
                  className="flex size-4 shrink-0 items-center justify-center overflow-hidden"
                  data-figma-node-id={nodeId}
                >
                  <Image className="max-h-full max-w-full" src={icon} alt="" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  </section>
);

export default BackendCompute;
