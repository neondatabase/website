import Hero from 'components/pages/use-cases/hero';
import UseCaseCards from 'components/pages/use-cases/use-case-cards';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import { getUseCasesData } from 'utils/api-local-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.useCases);

const UseCasesPage = () => {
  const useCasesData = getUseCasesData();

  return (
    <Layout>
      <Hero />
      <UseCaseCards
        className="pt-24 pb-48 lg:pt-20 lg:pb-32 md:pt-16 md:pb-24"
        items={useCasesData}
      />
    </Layout>
  );
};

export const dynamic = 'force-static';

export default UseCasesPage;
