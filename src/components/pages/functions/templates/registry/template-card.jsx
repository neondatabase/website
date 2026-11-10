import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';
import { cn } from 'utils/cn';

import FunctionRegistrySourceLabel from './source-label';
import FunctionRegistryTemplateLogo from './template-logo';

export const TEMPLATE_CARD_FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38A57D]';

const FunctionRegistryTemplateCard = ({ template, href, eager = false }) => (
  <li className="flex min-h-[169px]">
    <Link
      className={cn(
        'relative flex w-full flex-col overflow-hidden border border-gray-new-20 bg-[#080808] p-4 text-white transition-colors duration-200 hover:border-gray-new-30 hover:bg-gray-new-8 md:p-5',
        TEMPLATE_CARD_FOCUS_RING
      )}
      to={href}
    >
      <FunctionRegistrySourceLabel
        className="absolute top-4 right-4 z-10 border px-1.5 py-1 text-[11px] md:top-5 md:right-5"
        template={template}
      />
      <div className="relative z-10 flex h-full flex-col">
        <FunctionRegistryTemplateLogo template={template} eager={eager} />
        <h3 className="text-lg leading-snug font-medium tracking-extra-tight">{template.title}</h3>
        <p
          className="mt-1.5 line-clamp-2 text-[0.9375rem] leading-snug tracking-extra-tight text-gray-new-60 md:text-base/snug"
          title={template.description}
        >
          {template.description}
        </p>
      </div>
    </Link>
  </li>
);

FunctionRegistryTemplateCard.propTypes = {
  eager: PropTypes.bool,
  href: PropTypes.string.isRequired,
  template: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    provider: PropTypes.string,
    logo: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default FunctionRegistryTemplateCard;
