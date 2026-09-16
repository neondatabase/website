import PropTypes from 'prop-types';

import BackedBy from 'components/pages/backend-platform/backed-by';
import CTANew from 'components/shared/cta-new';
import Layout from 'components/shared/layout';
import { sharedBackendPlatformContent } from 'constants/backend-platform-page-content';
import LINKS from 'constants/links';

const { cta } = sharedBackendPlatformContent;

const BackendPlatformPage = ({ children }) => (
  <Layout
    className="bg-black-pure"
    headerClassName="h-15! lg:h-14!"
    isHeaderSticky
    isHeaderStickyOverlay
  >
    {children}
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
};

export default BackendPlatformPage;
