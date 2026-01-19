import Contents from 'components/pages/branching/contents';
import Hero from 'components/pages/branching/hero';
import DocFooter from 'components/shared/doc-footer';
import SEO_DATA from 'constants/seo-data';
import { getIndexContent, getLatestUpdateDate } from 'utils/api-branching';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.branching);

const BranchingIndexPage = async () => {
  const contents = await getIndexContent();
  const updatedOn = await getLatestUpdateDate();

  return (
    <>
      <Hero />
      <Contents contents={contents} />
      <DocFooter className="mt-20" updatedOn={updatedOn} withFeedback={false} />
    </>
  );
};

export default BranchingIndexPage;
