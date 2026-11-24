import AgentSetupPage from 'components/pages/onboard/agent-setup/agent-setup-page';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

// Standalone landing page that emails link to. It copies the agent onboarding
// prompt on load, so it skips the site header and footer.
export const metadata = getMetadata(SEO_DATA.onboardAgentSetup);

const Page = () => <AgentSetupPage />;

export default Page;
