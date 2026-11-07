import McpServerStats from 'components/pages/mcp-server-stats/mcp-server-stats';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import { getMcpStats } from 'utils/api-mcp-stats';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.mcpServerStats);

export const revalidate = 3600;

const McpServerStatsPage = async () => {
  const { clients, tools, access, publishedAt } = await getMcpStats();

  return (
    <Layout className="bg-black-pure" isHeaderSticky>
      <McpServerStats clients={clients} tools={tools} access={access} publishedAt={publishedAt} />
    </Layout>
  );
};

export default McpServerStatsPage;
