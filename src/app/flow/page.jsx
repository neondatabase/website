import Contents from 'components/pages/flow/contents';
import Hero from 'components/pages/flow/hero';
import DocFooter from 'components/shared/doc-footer';
import SEO_DATA from 'constants/seo-data';
import { getIndexContent } from 'utils/api-flow';
import getMetadata from 'utils/get-metadata';

const updatedOn = '2025-07-08T12:47:21.296Z';

export const metadata = getMetadata(SEO_DATA.flow);

const FlowsPage = async () => {
  const contents = await getIndexContent();

  return (
    <>
      <Hero />
      <Contents contents={contents} />
      <DocFooter className="mt-20" updatedOn={updatedOn} slug={SEO_DATA.flow.pathname} />
    </>
  );
};

export default FlowsPage;
