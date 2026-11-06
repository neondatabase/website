import PropTypes from 'prop-types';

import {
  formatInstallsCompact,
  formatInstallsWhole,
} from 'components/pages/functions/templates/weekly-installs/summary';
import Link from 'components/shared/link';
import ArrowRightIcon from 'icons/arrow-right.inline.svg';
import DownloadIcon from 'icons/download.inline.svg';
import { cn } from 'utils/cn';
import { registryTemplatePageHref } from 'utils/function-registry';

import FunctionRegistrySourceLabel from './source-label';
import TemplateCopy from './template-copy';
import FunctionRegistryTemplateLogo from './template-logo';
import getTemplatePrompt from './template-prompt';

export const TEMPLATE_CARD_FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38A57D]';

const SOURCE_BADGE_CLASS_NAME = 'shrink-0 whitespace-nowrap border px-1.5 py-1 text-[11px]';

export const templateCardType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  provider: PropTypes.string,
  logo: PropTypes.string,
  logoDark: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.string),
  installs: PropTypes.number,
});

const InstallCount = ({ installs }) =>
  installs > 0 ? (
    <span
      className="flex items-center gap-1 font-mono text-xs leading-none tracking-tight text-gray-new-70 tabular-nums"
      title={`${formatInstallsWhole(installs)} installs`}
    >
      <DownloadIcon className="size-3 shrink-0" aria-hidden />
      {formatInstallsCompact(installs)}
      <span className="sr-only"> installs</span>
    </span>
  ) : null;

InstallCount.propTypes = { installs: PropTypes.number };

const CompactTemplateCard = ({ template, href, eager = false }) => (
  <li className="flex min-h-[169px]">
    <Link
      className={cn(
        'relative flex w-full flex-col overflow-hidden border border-gray-new-20 bg-[#080808] p-4 text-white transition-colors duration-200 hover:border-gray-new-30 hover:bg-gray-new-8 md:p-5',
        TEMPLATE_CARD_FOCUS_RING
      )}
      to={href}
    >
      <div className="absolute top-4 right-4 z-10 flex items-center gap-3 md:top-5 md:right-5">
        <InstallCount installs={template.installs} />
        <FunctionRegistrySourceLabel className={SOURCE_BADGE_CLASS_NAME} template={template} />
      </div>
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

const FunctionRegistryTemplateCard = ({
  template,
  href = registryTemplatePageHref(template.id),
  eager = false,
  variant = 'compact',
  className = null,
}) =>
  variant === 'compact' ? (
    <CompactTemplateCard template={template} href={href} eager={eager} />
  ) : (
    <li className={cn('flex min-w-0', className)}>
      <article className="relative flex w-full min-w-0 flex-col border border-gray-new-20 bg-transparent px-[1.375rem] pt-[1.625rem] pb-5 text-pretty transition-colors duration-200 hover:border-gray-new-30 xl:px-5 xl:pt-6 sm:pt-5">
        <div className="mb-6 flex h-10 items-center justify-between gap-3 xl:mb-5 xl:h-9 lg:h-[34px] sm:h-8">
          <FunctionRegistryTemplateLogo template={template} variant="tile" eager={eager} />
          <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
            <InstallCount installs={template.installs} />
            <FunctionRegistrySourceLabel className={SOURCE_BADGE_CLASS_NAME} template={template} />
          </div>
        </div>
        <h3 className="m-0 text-2xl leading-[1.2] font-normal tracking-tighter [overflow-wrap:anywhere] text-white xl:text-[1.375rem] lg:text-xl md:text-[1.375rem] sm:text-xl">
          {template.title}
        </h3>
        <p className="mt-3.5 flex-1 text-base leading-normal text-[#b9bbbf] xl:mt-3 xl:text-[0.9375rem]">
          {template.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 xl:mt-5 xl:gap-x-4">
          <TemplateCopy
            value={getTemplatePrompt(template)}
            label={`Copy prompt for ${template.title}`}
            templateId={template.id}
            className="relative z-1 h-9 min-h-9 shrink-0 gap-1.5 rounded-full border border-gray-new-40 bg-white/[0.02] px-[18px] text-sm leading-none font-medium tracking-[-0.02em] whitespace-nowrap text-white hover:border-white xl:h-8 xl:min-h-8 xl:px-3.5 xl:text-[0.8125rem] [&_svg]:size-3.5"
          >
            Copy prompt
          </TemplateCopy>
          <Link
            to={href}
            className="inline-flex h-9 items-center gap-[.4375rem] text-sm whitespace-nowrap text-[#e5e5e5] after:absolute after:inset-0 after:content-[''] hover:text-white focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-3 focus-visible:after:outline-primary-1 xl:h-8 xl:text-[0.8125rem] [&_svg]:h-3 [&_svg]:w-4"
            aria-label={`View ${template.title} template`}
          >
            View template <ArrowRightIcon aria-hidden="true" />
          </Link>
        </div>
      </article>
    </li>
  );
FunctionRegistryTemplateCard.propTypes = {
  variant: PropTypes.oneOf(['compact', 'catalog']),
  href: PropTypes.string,
  template: templateCardType.isRequired,
  eager: PropTypes.bool,
  className: PropTypes.string,
};

CompactTemplateCard.propTypes = FunctionRegistryTemplateCard.propTypes;

export default FunctionRegistryTemplateCard;
