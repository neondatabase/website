import BackendPlatformPage from 'components/pages/backend-platform/backend-platform-page';

const TEMPLATES_CTA = {
  title: 'Deploy your first function',
  description: 'Add a template with the Neon CLI and deploy it to a branch.',
  label: 'Get started',
  buttonText: 'Start building',
  linkKey: 'signup',
};

// eslint-disable-next-line react/prop-types
const FunctionTemplatesLayout = ({ children }) => (
  <div className="dark bg-black-pure text-white">
    <BackendPlatformPage cta={TEMPLATES_CTA}>{children}</BackendPlatformPage>
  </div>
);

export default FunctionTemplatesLayout;
