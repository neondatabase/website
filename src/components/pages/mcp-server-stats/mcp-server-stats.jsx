import PropTypes from 'prop-types';

import CTANew from 'components/shared/cta-new';
import LINKS from 'constants/links';

import Hero from './hero';
import HowItWorks from './how-it-works';
import ShareList from './share-list';
import { buildClientShares, buildToolShares } from './share-series';
import Trend from './trend';
import { formatWeekRange } from './weeks';

const rowsShape = PropTypes.arrayOf(
  PropTypes.shape({
    weekStart: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    share: PropTypes.number.isRequired,
  })
);

const McpServerStats = ({ clients, tools, publishedAt }) => {
  const clientShares = buildClientShares(clients);
  const toolShares = buildToolShares(tools);

  return (
    <>
      <Hero publishedAt={publishedAt} />
      <ShareList
        className="mt-28 xl:mt-24 lg:mt-20 md:mt-14"
        id="mcp-stats-clients-heading"
        title="Agents, last week."
        description={
          <>
            Share of active users who called tools from each client,{' '}
            {formatWeekRange(clientShares.latestWeek)}.
          </>
        }
        rows={clientShares.ranked}
        footnote="An active user is a Neon account that called at least one tool that week. People use more than one client, so the shares add up to more than 100%. Custom code is scripts that only report their HTTP library, such as Node's undici or Python's httpx. Changes are against the week before."
      />
      <Trend weeks={clientShares.weeks} series={clientShares.series} />
      <ShareList
        id="mcp-stats-tools-heading"
        title="What agents do."
        description={
          <>Share of active users who called each tool, {formatWeekRange(toolShares.latestWeek)}.</>
        }
        rows={toolShares.ranked}
        isMono
        footnote="The ten most used tools. Agents call several tools, so the shares add up to more than 100%."
      />
      <HowItWorks />
      <CTANew
        label="Get started"
        title="Connect your agent to Neon"
        description="Run npx neon@latest mcp to add the Neon MCP server to Claude Code, Cursor, Codex, or another MCP client."
        buttonText="Read the MCP server docs"
        buttonUrl={LINKS.mcpServerDocs}
        copyWrapperClassName="lg:max-w-[720px] md:max-w-none"
      />
    </>
  );
};

McpServerStats.propTypes = {
  clients: rowsShape.isRequired,
  tools: rowsShape.isRequired,
  publishedAt: PropTypes.string.isRequired,
};

export default McpServerStats;
