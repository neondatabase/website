import Contents from 'components/pages/branching/contents';
import Hero from 'components/pages/branching/hero';
import SEO_DATA from 'constants/seo-data';
import { getIndexContent } from 'utils/api-branching';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.branching);

const BranchingIndexPage = async () => {
  const contents = await getIndexContent();

  return (
    <>
      <Hero />
      <Contents contents={contents} />
    </>
  );
};

export default BranchingIndexPage;
