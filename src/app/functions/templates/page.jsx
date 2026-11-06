import Catalog from 'components/pages/functions/templates/catalog';
import Hero from 'components/pages/functions/templates/hero';
import OpenSource from 'components/pages/functions/templates/open-source';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.functionsTemplates);

export const revalidate = 3600;

const FunctionTemplatesPage = () => (
  <>
    <Hero />
    <div id="library" className="scroll-mt-[4.5rem]">
      <Catalog />
    </div>
    <OpenSource />
  </>
);

export default FunctionTemplatesPage;
