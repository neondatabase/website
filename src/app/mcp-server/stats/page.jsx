import McpServerStats from 'components/pages/mcp-server-stats/mcp-server-stats';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import { getMcpClientShare } from 'utils/api-mcp-client-share';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.mcpServerStats);

export const revalidate = 3600;

const McpServerStatsPage = async () => {
  const rows = await getMcpClientShare();

  return (
    <Layout className="bg-black-pure" isHeaderSticky>
      <McpServerStats rows={rows} />
    </Layout>
  );
};

export default McpServerStatsPage;
