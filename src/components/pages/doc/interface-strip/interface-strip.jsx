'use client';

import PropTypes from 'prop-types';
import { useContext } from 'react';

import { InterfaceTabsContext } from 'contexts/interface-tabs-context';
import { cn } from 'utils/cn';

const LABELS = {
  api: 'REST API',
  cli: 'CLI',
  sdk: 'SDK',
  mcp: 'MCP',
  console: 'Console',
};

const ALL_IDS = ['api', 'cli', 'sdk', 'mcp', 'console'];

// interfaces = [{ id, code, available }, ...]
// When used standalone (e.g. from MDX), omit interfaces to show all tabs with labels only.
const InterfaceStrip = ({ interfaces }) => {
  const { activeIface, setActiveIface } = useContext(InterfaceTabsContext);

  const tabs = interfaces ?? ALL_IDS.map((id) => ({ id, code: null, available: true }));
  const current =
    activeIface && tabs.some((x) => x.id === activeIface)
      ? activeIface
      : (tabs.find((x) => x.available)?.id ?? 'api');

  return (
    <div className="not-prose mt-6 flex overflow-hidden rounded-xl border border-gray-new-90 bg-gray-new-98 dark:border-gray-new-20 dark:bg-gray-new-10">
      {tabs.map(({ id, code, available }, i) => {
        const active = id === current;
        const displayCode = available ? code : '—';
        return (
          <button
            key={id}
            type="button"
            onClick={() => setActiveIface(id)}
            style={{ opacity: available ? 1 : 0.55 }}
            className={cn(
              'flex flex-1 flex-col gap-0.5 px-3.5 py-3 text-left transition-colors duration-150',
              i < tabs.length - 1 && 'border-r border-gray-new-90 dark:border-gray-new-20',
              active
                ? cn(
                    available
                      ? 'border-b-2 border-b-green-45 bg-[rgba(0,229,153,0.04)] dark:bg-[rgba(0,229,153,0.05)]'
                      : 'bg-gray-new-96 border-b-2 border-b-gray-new-50 dark:border-b-gray-new-50 dark:bg-gray-new-15'
                  )
                : 'border-b-2 border-b-transparent hover:bg-gray-new-95 dark:hover:bg-gray-new-15'
            )}
          >
            <span
              className={cn(
                'text-[10px] font-semibold tracking-widest uppercase',
                active
                  ? available
                    ? 'text-green-45'
                    : 'text-gray-new-50 dark:text-gray-new-60'
                  : 'text-gray-new-50 dark:text-gray-new-60'
              )}
            >
              {LABELS[id] ?? id}
            </span>
            {displayCode && (
              <code
                className={cn(
                  'block overflow-hidden font-mono text-[11px] font-medium text-ellipsis whitespace-nowrap',
                  active
                    ? available
                      ? 'text-black-pure dark:text-white'
                      : 'text-gray-new-50 dark:text-gray-new-60'
                    : 'text-gray-new-40 dark:text-gray-new-60'
                )}
              >
                {displayCode}
              </code>
            )}
          </button>
        );
      })}
    </div>
  );
};

InterfaceStrip.propTypes = {
  interfaces: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      code: PropTypes.string,
      available: PropTypes.bool,
    })
  ),
};

export default InterfaceStrip;
