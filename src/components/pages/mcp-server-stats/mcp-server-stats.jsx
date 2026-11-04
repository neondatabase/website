import PropTypes from 'prop-types';

import CTANew from 'components/shared/cta-new';
import LINKS from 'constants/links';

import Hero from './hero';
import HowItWorks from './how-it-works';
import Ranking from './ranking';
import { buildShareSeries } from './share-series';
import Trend from './trend';

const McpServerStats = ({ rows }) => {
  const { weeks, latestWeek, chartSeries, latest } = buildShareSeries(rows);

  return (
    <>
      <Hero latestWeek={latestWeek} clients={latest} />
      <Ranking latestWeek={latestWeek} clients={latest} />
      <Trend weeks={weeks} series={chartSeries} />
      <HowItWorks />
      <CTANew
        label="Get started"
        title="Connect your agent to Neon"
        description="Add the Neon MCP server to Claude Code, Cursor, Codex, ChatGPT, or any other MCP client."
        buttonText="Read the MCP server docs"
        buttonUrl={LINKS.mcpServerDocs}
        copyWrapperClassName="lg:max-w-[720px] md:max-w-none"
      />
    </>
  );
};

McpServerStats.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      weekStart: PropTypes.string.isRequired,
      client: PropTypes.string.isRequired,
      share: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default McpServerStats;
