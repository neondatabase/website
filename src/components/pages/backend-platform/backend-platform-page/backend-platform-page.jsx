import PropTypes from 'prop-types';

import BackedBy from 'components/pages/backend-platform/backed-by';
import BackendServices from 'components/pages/backend-platform/backend-services';
import BuiltForAgents from 'components/pages/backend-platform/built-for-agents';
import CTANew from 'components/shared/cta-new';
import Faq from 'components/shared/faq';
import Layout from 'components/shared/layout';
import { sharedBackendPlatformContent } from 'constants/backend-platform-page-content';
import LINKS from 'constants/links';

const { cta, faqTitleLines } = sharedBackendPlatformContent;

const BackendPlatformPage = ({ children, faqItems }) => (
  <Layout
    className="bg-black-pure"
    headerClassName="h-15! lg:h-14!"
    isHeaderSticky
    isHeaderStickyOverlay
  >
    {children}
    <Faq items={faqItems} titleLines={faqTitleLines} variant="light" />
    <BackendServices />
    <BuiltForAgents />
    <BackedBy />
    <CTANew
      className="mt-0 bg-gray-new-10"
      title={cta.title}
      description={cta.description}
      label={cta.label}
      buttonText={cta.buttonText}
      buttonUrl={LINKS[cta.linkKey]}
    />
  </Layout>
);

BackendPlatformPage.propTypes = {
  children: PropTypes.node.isRequired,
  faqItems: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
      id: PropTypes.string,
      initialState: PropTypes.oneOf(['open', 'closed']),
    })
  ).isRequired,
};

export default BackendPlatformPage;
