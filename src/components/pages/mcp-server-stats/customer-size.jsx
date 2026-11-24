import PropTypes from 'prop-types';

import Container from 'components/shared/container';

import { CUSTOMER_SIZE_SURFACES } from './size-bands';
import { formatDayRange } from './weeks';

const COLORS = { mcp: '#00E599', cli: '#D9DCE1' };

const CustomerSize = ({ bands, windowStart, windowEnd }) => (
  <section
    className="mt-40 safe-paddings xl:mt-32 lg:mt-24 md:mt-16"
    aria-labelledby="mcp-stats-customer-size-heading"
  >
    <Container size="1280">
      <h2
        className="max-w-206 text-[2.75rem] leading-dense font-normal tracking-tighter text-gray-new-50 xl:text-4xl lg:max-w-3xl lg:text-3xl md:text-[1.75rem]"
        id="mcp-stats-customer-size-heading"
      >
        <span className="text-white">
          Neon&apos;s largest customers build with MCP and the CLI.
        </span>{' '}
        Share of paying customers using each, {formatDayRange(windowStart, windowEnd)}.
      </h2>
      <ul className="mt-16 flex flex-wrap gap-x-6 gap-y-2 lg:mt-12 md:mt-8" aria-hidden="true">
        {CUSTOMER_SIZE_SURFACES.map(({ value, label }) => (
          <li
            key={value}
            className="flex items-center gap-2 text-sm tracking-extra-tight text-gray-new-70"
          >
            <span className="size-3" style={{ backgroundColor: COLORS[value] }} />
            {label}
          </li>
        ))}
      </ul>
      <ul className="mt-5 border-t border-gray-new-20">
        {bands.map(({ key, label, surfaces }) => (
          <li
            key={key}
            className="grid grid-cols-[12rem_minmax(0,1fr)] items-center gap-x-4 border-b border-gray-new-15 py-3.5 lg:grid-cols-[10rem_minmax(0,1fr)] md:grid-cols-1 md:gap-y-2"
          >
            <span className="text-lg tracking-extra-tight text-white lg:text-base">{label}</span>
            <span className="flex flex-col gap-1.5">
              {surfaces.map(({ key: surface, label: surfaceLabel, share }) => (
                <span
                  key={surface}
                  className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-x-4 lg:grid-cols-[minmax(0,1fr)_4rem]"
                >
                  <span className="h-2 bg-gray-new-10" aria-hidden="true">
                    <span
                      className="block h-full"
                      style={{ width: `${share}%`, backgroundColor: COLORS[surface] }}
                    />
                  </span>
                  <span className="text-right text-base tracking-extra-tight text-white tabular-nums">
                    <span className="sr-only">{surfaceLabel} </span>
                    {share.toFixed(1)}%
                  </span>
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-[672px] text-sm leading-normal tracking-extra-tight text-gray-new-50">
        Paying customers ranked by size. An account counts under each tool someone on it used, so
        the two shares overlap.
      </p>
    </Container>
  </section>
);

CustomerSize.propTypes = {
  bands: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      surfaces: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          share: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  windowStart: PropTypes.string.isRequired,
  windowEnd: PropTypes.string.isRequired,
};

export default CustomerSize;
