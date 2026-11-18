import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';

import { SURFACES } from './surfaces';
import { formatDayRange } from './weeks';

const COLORS = {
  cli_only: { background: '#00E599', text: 'text-black-pure' },
  cli_and_mcp: { background: '#00A372', text: 'text-black-pure' },
  mcp_only: { background: '#0B5F45', text: 'text-white' },
};

// Below these shares a label doesn't fit inside its segment.
const MIN_LABEL_SHARE = 4;
const MIN_MOBILE_LABEL_SHARE = 9;

const segmentsShape = PropTypes.arrayOf(
  PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    share: PropTypes.number.isRequired,
  })
);

const SurfaceBar = ({ label, segments }) => (
  <li className="grid grid-cols-[12rem_minmax(0,1fr)] items-center gap-x-4 border-b border-gray-new-15 py-3.5 lg:grid-cols-[10rem_minmax(0,1fr)] md:grid-cols-1 md:gap-y-2">
    <span className="truncate text-lg tracking-extra-tight text-white lg:text-base">{label}</span>
    <span className="flex h-8 overflow-hidden bg-gray-new-10" aria-hidden="true">
      {segments
        .filter(({ share }) => share > 0)
        .map(({ key, share }) => (
          <span
            key={key}
            className={clsx(
              'flex h-full items-center justify-center font-mono text-sm tabular-nums',
              COLORS[key].text
            )}
            style={{ width: `${share}%`, backgroundColor: COLORS[key].background }}
          >
            {share >= MIN_LABEL_SHARE && (
              <span className={clsx(share < MIN_MOBILE_LABEL_SHARE && 'md:hidden')}>
                {Math.round(share)}%
              </span>
            )}
          </span>
        ))}
    </span>
    <span className="sr-only">
      {segments.map(({ label: surface, share }) => `${surface} ${share.toFixed(1)}%`).join(', ')}
    </span>
  </li>
);

SurfaceBar.propTypes = {
  label: PropTypes.string.isRequired,
  segments: segmentsShape.isRequired,
};

const AgentSurfaces = ({ agents, windowStart, windowEnd }) => (
  <section
    className="mt-40 safe-paddings xl:mt-32 lg:mt-24 md:mt-16"
    aria-labelledby="mcp-stats-surfaces-heading"
  >
    <Container size="1280">
      <h2
        className="max-w-206 text-[2.75rem] leading-dense font-normal tracking-tighter text-gray-new-50 xl:text-4xl lg:max-w-3xl lg:text-3xl md:text-[1.75rem]"
        id="mcp-stats-surfaces-heading"
      >
        <span className="text-white">How agents reach Neon.</span> Share of each agent&apos;s
        accounts that used the Neon CLI, the MCP server, or both,{' '}
        {formatDayRange(windowStart, windowEnd)}.
      </h2>
      <ul className="mt-16 flex flex-wrap gap-x-6 gap-y-2 lg:mt-12 md:mt-8" aria-hidden="true">
        {SURFACES.map(({ value, label }) => (
          <li
            key={value}
            className="flex items-center gap-2 text-sm tracking-extra-tight text-gray-new-70"
          >
            <span className="size-3" style={{ backgroundColor: COLORS[value].background }} />
            {label}
          </li>
        ))}
      </ul>
      <ul className="mt-5 border-t border-gray-new-20">
        {agents.map(({ key, label, segments }) => (
          <SurfaceBar key={key} label={label} segments={segments} />
        ))}
      </ul>
      <p className="mt-6 max-w-[672px] text-sm leading-normal tracking-extra-tight text-gray-new-50">
        Accounts that ran the Neon CLI from a coding agent or called MCP tools from it. Only recent
        CLI versions report the agent, so CLI shares are a floor. ChatGPT and Claude Desktop have no
        CLI.
      </p>
    </Container>
  </section>
);

AgentSurfaces.propTypes = {
  agents: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      segments: segmentsShape.isRequired,
    })
  ).isRequired,
  windowStart: PropTypes.string.isRequired,
  windowEnd: PropTypes.string.isRequired,
};

export default AgentSurfaces;
