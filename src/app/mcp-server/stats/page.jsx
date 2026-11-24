import { notFound } from 'next/navigation';

import McpServerStats from 'components/pages/mcp-server-stats/mcp-server-stats';
import Layout from 'components/shared/layout';
import VERCEL_URL from 'constants/base';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import { getMcpStats } from 'utils/api-mcp-stats';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({
  ...SEO_DATA.mcpServerStats,
  imagePath: `${VERCEL_URL}${LINKS.mcpServerStats}/og`,
});

export const revalidate = 3600;

const McpServerStatsPage = async () => {
  const stats = await getMcpStats();
  if (!stats) notFound();

  const { clients, tools, access, surfaces, customerSize, publishedAt } = stats;

  return (
    <Layout className="bg-black-pure" isHeaderSticky>
      <McpServerStats
        clients={clients}
        tools={tools}
        access={access}
        surfaces={surfaces}
        customerSize={customerSize}
        publishedAt={publishedAt}
      />
    </Layout>
  );
};

export default McpServerStatsPage;
