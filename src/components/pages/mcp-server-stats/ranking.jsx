import PropTypes from 'prop-types';

import Container from 'components/shared/container';

import ShareChange from './share-change';
import { formatWeekRange } from './weeks';

const Ranking = ({ latestWeek, clients }) => {
  const maxShare = Math.max(...clients.map(({ share }) => share));

  return (
    <section
      className="mt-40 safe-paddings xl:mt-32 lg:mt-24 md:mt-16"
      aria-labelledby="mcp-stats-ranking-heading"
    >
      <Container size="1280">
        <h2
          className="max-w-206 text-[2.75rem] leading-dense font-normal tracking-tighter text-gray-new-50 xl:text-4xl lg:max-w-3xl lg:text-3xl md:text-[1.75rem]"
          id="mcp-stats-ranking-heading"
        >
          <span className="text-white">Every client, last week.</span> Share of sessions from{' '}
          {formatWeekRange(latestWeek)}, with the change from the week before.
        </h2>
        <ol className="mt-16 border-t border-gray-new-20 lg:mt-12 md:mt-8">
          {clients.map(({ client, label, color, share, change }, index) => (
            <li
              key={client}
              className="grid grid-cols-[3rem_12rem_minmax(0,1fr)_5rem_8rem] items-center gap-x-4 border-b border-gray-new-15 py-3.5 md:grid-cols-[2rem_minmax(0,1fr)_4.5rem] md:gap-y-2"
            >
              <span className="font-mono text-sm text-gray-new-50 tabular-nums">
                {client === 'other' ? '' : String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-lg leading-snug tracking-extra-tight text-white lg:text-base">
                {label}
              </span>
              <span
                className="h-2 bg-gray-new-10 md:col-span-3 md:col-start-1 md:row-start-2"
                aria-hidden="true"
              >
                <span
                  className="block h-full"
                  style={{ width: `${(share / maxShare) * 100}%`, backgroundColor: color }}
                />
              </span>
              <span className="text-right text-lg tracking-extra-tight text-white tabular-nums lg:text-base md:col-start-3 md:row-start-1">
                {share.toFixed(1)}%
              </span>
              <ShareChange
                className="text-right text-sm tracking-extra-tight tabular-nums md:hidden"
                change={change}
              />
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-[672px] text-sm leading-normal tracking-extra-tight text-gray-new-50">
          Other is every client outside this list, including scripts that only report an HTTP
          library. Shares are rounded to 0.1%, so a week can total 99.9% or 100.1%.
        </p>
      </Container>
    </section>
  );
};

Ranking.propTypes = {
  latestWeek: PropTypes.string.isRequired,
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      client: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      share: PropTypes.number.isRequired,
      change: PropTypes.number,
    })
  ).isRequired,
};

export default Ranking;
