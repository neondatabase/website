/* eslint-disable @next/next/no-img-element */
import PropTypes from 'prop-types';

import ICONS_CONFIG from 'config/docs-icons-config';
import { cn } from 'utils/cn';
import {
  isNeonRegistryTemplate,
  isRegistryLogoUrl,
  registryLogoAlt,
  registryProviderLabel,
} from 'utils/function-registry';

import CodeIcon from '../detail-icon-cards/images/code.inline.svg';

const NEON_LOGO = ICONS_CONFIG.neon;

const FunctionRegistryTemplateLogo = ({ template, eager = false, variant = 'card' }) => {
  const isCard = variant === 'card';
  const loading = eager ? 'eager' : 'lazy';
  const sizeClass = isCard ? 'mb-8 size-7' : 'size-8';
  const alt = registryLogoAlt(template, {
    decorative: isCard || !registryProviderLabel(template),
  });

  if (isRegistryLogoUrl(template.logo)) {
    return (
      <img
        className={
          isCard
            ? 'mb-8 h-7 w-auto max-w-10 shrink-0 object-contain object-left'
            : 'h-8 w-8 shrink-0 object-contain'
        }
        src={template.logo.trim()}
        width={isCard ? 28 : 32}
        height={isCard ? 28 : 32}
        alt={alt}
        loading={loading}
        decoding="async"
        referrerPolicy="no-referrer"
      />
    );
  }

  if (isNeonRegistryTemplate(template)) {
    return (
      <span
        className={cn('flex shrink-0 items-center', isCard ? 'mb-8 h-7' : 'h-8 w-8 justify-center')}
      >
        <img
          className={cn(
            isCard ? 'h-7 w-auto shrink-0' : 'h-8 w-8',
            NEON_LOGO.darkIconPath && 'dark:hidden'
          )}
          src={NEON_LOGO.lightIconPath}
          width={isCard ? 28 : 32}
          height={isCard ? 28 : 32}
          alt={alt}
          loading={loading}
        />
        {NEON_LOGO.darkIconPath && (
          <img
            className={cn(isCard ? 'h-7 w-auto shrink-0' : 'h-8 w-8', 'hidden dark:block')}
            src={NEON_LOGO.darkIconPath}
            width={isCard ? 28 : 32}
            height={isCard ? 28 : 32}
            alt=""
            aria-hidden
            loading={loading}
          />
        )}
      </span>
    );
  }

  return (
    <CodeIcon
      className={cn(sizeClass, 'shrink-0 text-gray-new-50 dark:text-gray-new-60')}
      aria-hidden
      focusable="false"
    />
  );
};

FunctionRegistryTemplateLogo.propTypes = {
  template: PropTypes.shape({
    title: PropTypes.string.isRequired,
    logo: PropTypes.string,
    provider: PropTypes.string,
  }).isRequired,
  eager: PropTypes.bool,
  variant: PropTypes.oneOf(['card', 'title']),
};

export default FunctionRegistryTemplateLogo;
