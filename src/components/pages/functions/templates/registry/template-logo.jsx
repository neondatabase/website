/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import PropTypes from 'prop-types';

import CodeIcon from 'components/pages/doc/detail-icon-cards/images/code.inline.svg';
import ICONS_CONFIG from 'config/docs-icons-config';
import { cn } from 'utils/cn';
import {
  isNeonRegistryTemplate,
  isRegistryLogoUrl,
  registryLogoAlt,
} from 'utils/function-registry';

const NEON_LOGO = ICONS_CONFIG.neon;

const RegistryLogoImage = ({ className, src, alt, isCard, loading }) => (
  <Image
    className={cn(
      'shrink-0 object-contain',
      isCard ? 'h-7 w-auto max-w-10 object-left' : 'h-8 w-8',
      className
    )}
    src={src.trim()}
    width={isCard ? 28 : 32}
    height={isCard ? 28 : 32}
    alt={alt}
    loading={loading}
  />
);

RegistryLogoImage.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  isCard: PropTypes.bool.isRequired,
  loading: PropTypes.oneOf(['eager', 'lazy']).isRequired,
};

// Branded 40x40 tiles, keyed by lowercased provider. Brands with an accent color get it as the
// tile with a white mark; monochrome brands get a dark mark on a white tile.
const TILE_LOGOS = {
  neon: '/images/function-registry/neon-tile.svg',
  'context.dev': '/images/function-registry/context-dev-tile.svg',
  workos: '/images/function-registry/workos-tile.png',
  mastra: '/images/function-registry/mastra-tile.svg',
  'ai inbx': '/images/function-registry/aiinbx-tile.svg',
  tanstack: '/images/function-registry/tanstack-tile.svg',
};

const TILE_SIZES = {
  md: {
    tile: 'size-10 xl:size-9 lg:size-[34px] sm:size-8',
    logo: 'size-6 xl:size-[22px] lg:size-5 sm:size-[19px]',
  },
  sm: { tile: 'size-5', logo: 'size-3' },
};

const TemplateLogoTile = ({ template, loading, size = 'md' }) => {
  const sizes = TILE_SIZES[size];
  const provider = isNeonRegistryTemplate(template)
    ? 'neon'
    : template.provider.trim().toLowerCase();
  const tileSrc = TILE_LOGOS[provider];

  if (tileSrc) {
    return (
      <img
        className={cn('shrink-0', sizes.tile)}
        src={tileSrc}
        width={40}
        height={40}
        alt=""
        loading={loading}
      />
    );
  }

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center',
        sizes.tile,
        // Partner logos are usually dark marks, so they sit on a light tile.
        isRegistryLogoUrl(template.logo) ? 'bg-white' : 'bg-gray-new-15'
      )}
    >
      {isRegistryLogoUrl(template.logo) ? (
        <img
          className={cn('object-contain', sizes.logo)}
          src={template.logo.trim()}
          width={24}
          height={24}
          alt=""
          loading={loading}
          decoding="async"
          referrerPolicy="no-referrer"
        />
      ) : (
        <CodeIcon className={cn('text-gray-new-60', sizes.logo)} aria-hidden focusable="false" />
      )}
    </span>
  );
};

TemplateLogoTile.propTypes = {
  template: PropTypes.shape({
    logo: PropTypes.string,
    provider: PropTypes.string,
  }).isRequired,
  loading: PropTypes.string,
  size: PropTypes.oneOf(['md', 'sm']),
};

const FunctionRegistryTemplateLogo = ({ template, eager = false, variant = 'card' }) => {
  const isCard = variant === 'card';
  const loading = eager ? 'eager' : 'lazy';

  if (variant === 'tile') return <TemplateLogoTile template={template} loading={loading} />;
  if (variant === 'tile-sm') {
    return <TemplateLogoTile template={template} loading={loading} size="sm" />;
  }

  const sizeClass = isCard ? 'mb-8 size-7' : 'size-8';
  // Cards already announce the title, so their logo stays decorative.
  const alt = registryLogoAlt(template, { decorative: isCard });

  if (isRegistryLogoUrl(template.logo)) {
    if (!isRegistryLogoUrl(template.logoDark)) {
      return (
        <RegistryLogoImage
          className={cn(isCard && 'mb-8')}
          src={template.logo}
          alt={alt}
          isCard={isCard}
          loading={loading}
        />
      );
    }

    return (
      <span className={cn('flex shrink-0', isCard && 'mb-8')}>
        <RegistryLogoImage
          className="dark:hidden"
          src={template.logo}
          alt={alt}
          isCard={isCard}
          loading={loading}
        />
        <RegistryLogoImage
          className="hidden dark:block"
          src={template.logoDark}
          alt={alt}
          isCard={isCard}
          loading={loading}
        />
      </span>
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
    logoDark: PropTypes.string,
    provider: PropTypes.string,
  }).isRequired,
  eager: PropTypes.bool,
  variant: PropTypes.oneOf(['card', 'title', 'tile', 'tile-sm']),
};

export default FunctionRegistryTemplateLogo;
