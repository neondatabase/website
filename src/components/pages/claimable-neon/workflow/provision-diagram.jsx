'use client';

import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import AgentIcon from './images/agent.inline.svg';
import ApiIcon from './images/api.inline.svg';
import RowTableIcon from './images/row-table.inline.svg';

const CORNER_CLASSES = [
  'top-[-0.0822cqw] left-[-0.0822cqw] border-t border-l',
  'top-[-0.0822cqw] right-[-0.0822cqw] border-t border-r',
  'bottom-[-0.0822cqw] left-[-0.0822cqw] border-b border-l',
  'right-[-0.0822cqw] bottom-[-0.0822cqw] border-r border-b',
];

const EASE_OUT = [0.22, 1, 0.36, 1];
const SHARP_EXPAND_EASE = [0.16, 1, 0.3, 1];
const PROJECT_ROW_OFFSET = '-1.25cqw';

const TIMING = {
  agent: { delay: 0, duration: 0.26, ease: SHARP_EXPAND_EASE },
  agentContent: { delay: 0.04, duration: 0.2 },
  firstConnector: { delay: 0.72, duration: 0.3 },
  request: { delay: 1.05, duration: 0.2 },
  secondConnector: { delay: 1.4, duration: 0.3 },
  project: { delay: 1.74, duration: 0.26, ease: SHARP_EXPAND_EASE },
  projectHeader: { delay: 2.14, duration: 0.2 },
  projectDividers: { delay: 2.34, duration: 0.2 },
  databaseRow: { delay: 2.36, duration: 0.2 },
  dataApiRow: { delay: 2.58, duration: 0.2 },
};

const ProvisionDiagram = () => {
  const [ref, isInView] = useInView({ threshold: 0.35, triggerOnce: true });
  const shouldReduceMotion = useReducedMotion();
  const isActive = isInView || shouldReduceMotion;

  const getTransition = ({ delay, duration, ease = EASE_OUT }) => ({
    delay: shouldReduceMotion ? 0 : delay,
    duration: shouldReduceMotion ? 0 : duration,
    ease,
  });

  return (
    <div
      className="@container relative aspect-[38/26.5] w-full overflow-hidden bg-gray-new-8"
      aria-hidden="true"
      ref={ref}
    >
      <LazyMotion features={domAnimation}>
        <span
          className="absolute top-[18.2566cqw] left-1/2 h-[12.3355cqw]"
          data-diagram-node="connector"
        >
          <m.span
            className="absolute top-0 left-0 h-[3.6184cqw] origin-top border-l border-dashed border-gray-new-30"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isActive ? 1 : 0 }}
            transition={getTransition(TIMING.firstConnector)}
            data-animation-step="connector-to-request"
          />
          <m.span
            className="absolute top-[8.7171cqw] left-0 h-[3.6184cqw] origin-top border-l border-dashed border-gray-new-30"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isActive ? 1 : 0 }}
            transition={getTransition(TIMING.secondConnector)}
            data-animation-step="connector-to-project"
          />
        </span>

        <div
          className="absolute top-[8.7171cqw] left-[25.1645cqw] z-10 h-[9.5395cqw] w-[49.8355cqw]"
          data-diagram-node="agent"
        >
          <m.span
            className="absolute inset-0 border border-gray-new-15 bg-black-new"
            initial={{ opacity: 0, scaleX: 0.86 }}
            animate={{ opacity: isActive ? 1 : 0, scaleX: isActive ? 1 : 0.86 }}
            transition={getTransition(TIMING.agent)}
            data-animation-step="agent-background"
          />
          <m.div
            className="relative flex h-full items-center px-[2.4671cqw]"
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={getTransition(TIMING.agentContent)}
            data-animation-step="agent-content"
          >
            <span className="relative size-[4.6053cqw] shrink-0 bg-green-52 text-black-pure">
              <AgentIcon className="absolute top-[0.8224cqw] left-[0.8224cqw] size-[3.125cqw]" />
            </span>
            <span className="ml-[2.3026cqw] text-[2.9605cqw] leading-[1.375] tracking-extra-tight text-gray-new-98">
              Agent
            </span>
            <span className="ml-auto flex h-[4.1118cqw] w-[20.2303cqw] items-center bg-gray-new-15 px-[1.3158cqw] text-[2.1382cqw] leading-[1.2308] whitespace-nowrap text-gray-new-85">
              Provision request
            </span>
          </m.div>
        </div>

        <div
          className="absolute top-[21.875cqw] left-[41.2829cqw] z-10 h-[5.0987cqw] w-[17.5987cqw]"
          data-diagram-node="request"
        >
          <m.span
            className="flex h-full items-center border border-gray-new-15 bg-gray-new-8 pr-[1.9737cqw] pl-[1.6447cqw] text-[2.1382cqw] leading-[1.125] tracking-extra-tight whitespace-nowrap text-gray-new-70"
            initial={{ opacity: 0, scaleX: 0.9 }}
            animate={{ opacity: isActive ? 1 : 0, scaleX: isActive ? 1 : 0.9 }}
            transition={getTransition(TIMING.request)}
            data-animation-step="request"
          >
            Create project
          </m.span>
        </div>

        <div
          className="absolute top-[30.5921cqw] left-[14.1447cqw] z-10 h-[30.5921cqw] w-[71.875cqw]"
          data-diagram-node="project"
        >
          <m.div
            className="absolute inset-0 border border-gray-new-15 bg-black-new"
            initial={{ opacity: 0, scaleX: 0.86 }}
            animate={{ opacity: isActive ? 1 : 0, scaleX: isActive ? 1 : 0.86 }}
            transition={getTransition(TIMING.project)}
            data-animation-step="project-background"
          >
            {CORNER_CLASSES.map((className) => (
              <span
                className={`absolute size-[1.727cqw] border-gray-new-90 ${className}`}
                key={className}
              />
            ))}
          </m.div>

          <div className="absolute top-[2.1382cqw] left-[2.7961cqw] h-[25cqw] w-[66.2829cqw]">
            <m.div
              className="flex h-[7.2368cqw] items-center justify-between"
              initial={{ opacity: 0, y: PROJECT_ROW_OFFSET }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? '0cqw' : PROJECT_ROW_OFFSET }}
              transition={getTransition(TIMING.projectHeader)}
              data-animation-step="project-header"
              data-project-row=""
            >
              <div className="flex w-[16.9408cqw] flex-col gap-[0.3289cqw]">
                <p className="text-[2.9605cqw] leading-[1.375] tracking-extra-tight text-gray-new-98">
                  New project
                </p>
                <p className="font-mono text-[2.3026cqw] leading-[1.2] tracking-[-0.04em] text-gray-new-40">
                  agent-project
                </p>
              </div>
              <span className="inline-flex h-[3.9474cqw] w-[12.6645cqw] items-center gap-[1.3158cqw] bg-gray-new-15 px-[0.9868cqw] text-[2.3026cqw] leading-none tracking-extra-tight text-green-52">
                <span className="size-[0.8224cqw] rounded-full bg-green-52" />
                Created
              </span>
            </m.div>

            <div className="absolute top-[12.5cqw] left-0 h-[3.6184cqw] w-[64.9671cqw]">
              <m.span
                className="absolute top-[-2.6316cqw] left-0 w-[66.2829cqw] border-t border-gray-new-15"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={getTransition(TIMING.projectDividers)}
                data-animation-step="project-divider"
              />
              <m.div
                className="flex size-full items-center"
                initial={{ opacity: 0, y: PROJECT_ROW_OFFSET }}
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? '0cqw' : PROJECT_ROW_OFFSET }}
                transition={getTransition(TIMING.databaseRow)}
                data-diagram-node="database-url"
                data-animation-step="database-row"
                data-project-row=""
              >
                <span className="flex w-[32.8125cqw] shrink-0 items-center gap-[1.3158cqw]">
                  <RowTableIcon className="size-[2.6316cqw] shrink-0 text-green-44" />
                  <span className="font-mono text-[2.6316cqw] leading-[1.375] tracking-extra-tight whitespace-nowrap text-gray-new-90">
                    DATABASE_URL
                  </span>
                </span>
                <span className="ml-auto w-[20.0658cqw] overflow-hidden text-[2.6316cqw] leading-[1.375] tracking-extra-tight whitespace-nowrap text-gray-new-50">
                  ••••••••••••••
                </span>
              </m.div>
            </div>

            <div className="absolute top-[21.3816cqw] left-0 h-[3.6184cqw] w-[64.9671cqw]">
              <m.span
                className="absolute top-[-2.6316cqw] left-0 w-full border-t border-gray-new-15"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={getTransition(TIMING.projectDividers)}
                data-animation-step="project-divider"
              />
              <m.div
                className="flex size-full items-center"
                initial={{ opacity: 0, y: PROJECT_ROW_OFFSET }}
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? '0cqw' : PROJECT_ROW_OFFSET }}
                transition={getTransition(TIMING.dataApiRow)}
                data-diagram-node="data-api-url"
                data-animation-step="data-api-row"
                data-project-row=""
              >
                <span className="flex shrink-0 items-center gap-[1.3158cqw]">
                  <ApiIcon className="size-[2.6316cqw] shrink-0 text-green-44" />
                  <span className="font-mono text-[2.6316cqw] leading-[1.375] tracking-extra-tight whitespace-nowrap text-gray-new-90">
                    NEON_DATA_API_URL
                  </span>
                </span>
                <span className="ml-auto w-[20.0658cqw] overflow-hidden text-[2.6316cqw] leading-[1.375] tracking-extra-tight whitespace-nowrap text-gray-new-50">
                  ••••••••••••••
                </span>
              </m.div>
            </div>
          </div>
        </div>
      </LazyMotion>
    </div>
  );
};

export default ProvisionDiagram;
