import PropTypes from 'prop-types';

import { cn } from 'utils/cn';
import { registryWebsiteUrl } from 'utils/function-registry';

const FunctionRegistryWebsiteLink = ({ template, className = null, children }) => {
  const href = registryWebsiteUrl(template.website);
  if (!href) return children;

  return (
    // Partner backlink: must stay followable (no nofollow/ugc/sponsored) and keep the referrer.
    // eslint-disable-next-line react/jsx-no-target-blank
    <a
      className={cn(
        'underline decoration-gray-new-40 underline-offset-2 transition-colors hover:text-green-45 hover:decoration-green-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38A57D]',
        className
      )}
      href={href}
      target="_blank"
      rel="noopener"
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
};

FunctionRegistryWebsiteLink.propTypes = {
  template: PropTypes.shape({
    website: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default FunctionRegistryWebsiteLink;
