import PropTypes from 'prop-types';

import Container from 'components/shared/container';

import ShareChart from './share-chart';
import { formatWeekShort } from './weeks';

const Trend = ({ weeks, series }) => (
  <section
    className="mt-40 safe-paddings xl:mt-32 lg:mt-24 md:mt-16"
    aria-labelledby="mcp-stats-trend-heading"
  >
    <Container size="1280">
      <h2
        className="max-w-206 text-[2.75rem] leading-dense font-normal tracking-tighter text-gray-new-50 xl:text-4xl lg:max-w-3xl lg:text-3xl md:text-[1.75rem]"
        id="mcp-stats-trend-heading"
      >
        <span className="text-white">Week by week.</span> Each client&apos;s share of active users
        since the week of {formatWeekShort(weeks[0])}.
      </h2>
      <div className="mt-16 border border-gray-new-20 bg-[#080808] p-8 lg:mt-12 lg:p-6 md:mt-8 md:p-4">
        <ShareChart weeks={weeks} series={series} />
      </div>
      <p className="mt-6 max-w-[672px] text-sm leading-normal tracking-extra-tight text-gray-new-50">
        A week runs Monday to Sunday and appears once it is complete. The chart shows clients that
        reached 5% of active users in at least one week.
      </p>
    </Container>
  </section>
);

Trend.propTypes = {
  weeks: PropTypes.arrayOf(PropTypes.string).isRequired,
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Trend;
