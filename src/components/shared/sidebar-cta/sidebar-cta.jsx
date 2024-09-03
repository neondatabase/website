import PropTypes from 'prop-types';

import Button from 'components/shared/button';
import links from 'constants/links';

const SidebarCta = ({
  title = 'Sign Up for Neon',
  description = 'Start on the free plan - No credit card required.',
  cta_text = 'Get Started',
  cta_url = links.signup,
}) => (
  <div className="w-full rounded-lg border border-[#1e2024] bg-[#0D0E10] p-4">
    <div className="justify items-left flex flex-col gap-4">
      <h4 className="text-lg font-bold">{title}</h4>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
      <Button
        className="pointer-events-auto relative !font-semibold tracking-tighter"
        theme="primary"
        size="xs"
        to={cta_url}
        tag_name="Sidebar"
      >
        {cta_text}
      </Button>
    </div>
  </div>
);

SidebarCta.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  cta_text: PropTypes.string,
  cta_url: PropTypes.string,
};

export default SidebarCta;
