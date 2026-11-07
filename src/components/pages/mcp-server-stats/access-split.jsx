import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

import { formatDayRange } from './weeks';

const BAR_COLOR = '#00E599';

const rowsShape = PropTypes.arrayOf(
  PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    share: PropTypes.number.isRequired,
  })
);

const SplitList = ({ title, rows }) => (
  <div className="min-w-0">
    <h3 className="font-mono text-sm leading-none tracking-extra-tight text-gray-new-60 uppercase">
      {title}
    </h3>
    <ul className="mt-5 border-t border-gray-new-20">
      {rows.map(({ key, label, share }) => (
        <li
          key={key}
          className="grid grid-cols-[12rem_minmax(0,1fr)_4.5rem] items-center gap-x-4 border-b border-gray-new-15 py-3.5 lg:grid-cols-[10rem_minmax(0,1fr)_4rem]"
        >
          <span className="text-lg leading-snug tracking-extra-tight text-pretty text-white lg:text-base">
            {label}
          </span>
          <span className="h-2 bg-gray-new-10" aria-hidden="true">
            <span
              className="block h-full"
              style={{ width: `${share}%`, backgroundColor: BAR_COLOR }}
            />
          </span>
          <span className="text-right text-lg tracking-extra-tight text-white tabular-nums lg:text-base">
            {share.toFixed(1)}%
          </span>
        </li>
      ))}
    </ul>
  </div>
);

SplitList.propTypes = {
  title: PropTypes.string.isRequired,
  rows: rowsShape.isRequired,
};

const AccessSplit = ({ signIn, access, windowStart, windowEnd }) => (
  <section
    className="mt-40 safe-paddings xl:mt-32 lg:mt-24 md:mt-16"
    aria-labelledby="mcp-stats-access-heading"
  >
    <Container size="1280">
      <h2
        className="max-w-206 text-[2.75rem] leading-dense font-normal tracking-tighter text-gray-new-50 xl:text-4xl lg:max-w-3xl lg:text-3xl md:text-[1.75rem]"
        id="mcp-stats-access-heading"
      >
        <span className="text-white">How agents connect.</span> Share of users reporting each
        setting, {formatDayRange(windowStart, windowEnd)}.
      </h2>
      <div className="mt-16 grid grid-cols-2 gap-x-16 xl:gap-x-10 lg:mt-12 md:mt-8 md:grid-cols-1 md:gap-y-12">
        <SplitList title="Sign-in" rows={signIn} />
        <SplitList title="Access" rows={access} />
      </div>
      <p className="mt-6 max-w-[672px] text-sm leading-normal tracking-extra-tight text-gray-new-50">
        Full access means none of the restrictions below, which you set in the{' '}
        <Link className="underline" to={LINKS.mcpServerConfigGenerator} theme="gray-50">
          config generator
        </Link>
        . Clients that don&apos;t report a setting are left out, and a user can count under several
        settings.
      </p>
    </Container>
  </section>
);

AccessSplit.propTypes = {
  signIn: rowsShape.isRequired,
  access: rowsShape.isRequired,
  windowStart: PropTypes.string.isRequired,
  windowEnd: PropTypes.string.isRequired,
};

export default AccessSplit;
