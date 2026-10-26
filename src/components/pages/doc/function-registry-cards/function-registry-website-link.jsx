import PropTypes from 'prop-types';

import { cn } from 'utils/cn';
import { registryWebsiteLinkText, registryWebsiteUrl } from 'utils/function-registry';

const FunctionRegistryWebsiteLink = ({ template, className = null }) => {
  const href = registryWebsiteUrl(template.website);
  if (!href) return null;

  const text = registryWebsiteLinkText(href, template.title);

  return (
    <a
      className={cn(
        'text-[15px] leading-snug tracking-extra-tight text-gray-new-50 transition-colors hover:text-green-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38A57D] dark:text-gray-new-60 dark:hover:text-green-45',
        className
      )}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {text}
    </a>
  );
};

FunctionRegistryWebsiteLink.propTypes = {
  template: PropTypes.shape({
    title: PropTypes.string.isRequired,
    website: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};

export default FunctionRegistryWebsiteLink;
