'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Link from 'components/shared/link';
import AiIcon from 'icons/docs/sidebar/ai.inline.svg';
import ApiIcon from 'icons/docs/sidebar/api.inline.svg';
import ArchitectureIcon from 'icons/docs/sidebar/architecture.inline.svg';
import ArrowExternalIcon from 'icons/docs/sidebar/arrow-external.inline.svg';
import BillingIcon from 'icons/docs/sidebar/billing.inline.svg';
import ChangelogIcon from 'icons/docs/sidebar/changelog.inline.svg';
import CliIcon from 'icons/docs/sidebar/cli.inline.svg';
import CommunityIcon from 'icons/docs/sidebar/community.inline.svg';
import FeaturesIcon from 'icons/docs/sidebar/features.inline.svg';
import FrameworksIcon from 'icons/docs/sidebar/frameworks.inline.svg';
import GetStartedIcon from 'icons/docs/sidebar/get-started.inline.svg';
import GlossaryIcon from 'icons/docs/sidebar/glossary.inline.svg';
import HomeIcon from 'icons/docs/sidebar/home.inline.svg';
import IntegrationsIcon from 'icons/docs/sidebar/integrations.inline.svg';
import ManagementIcon from 'icons/docs/sidebar/management.inline.svg';
import PartnerGuide from 'icons/docs/sidebar/partner-guide.inline.svg';
import PostgresDocs from 'icons/docs/sidebar/postgres-docs.inline.svg';
import PostgresGuides from 'icons/docs/sidebar/postgres-guides.inline.svg';
import Regions from 'icons/docs/sidebar/regions.inline.svg';
import Sdk from 'icons/docs/sidebar/sdk.inline.svg';
import Status from 'icons/docs/sidebar/status.inline.svg';
import Support from 'icons/docs/sidebar/support.inline.svg';
import WhyNeon from 'icons/docs/sidebar/why-neon.inline.svg';

import Tag from '../../tag';
import Menu from '../menu';

const icons = {
  ai: AiIcon,
  api: ApiIcon,
  architecture: ArchitectureIcon,
  billing: BillingIcon,
  changelog: ChangelogIcon,
  cli: CliIcon,
  community: CommunityIcon,
  features: FeaturesIcon,
  frameworks: FrameworksIcon,
  'get-started': GetStartedIcon,
  glossary: GlossaryIcon,
  home: HomeIcon,
  integrations: IntegrationsIcon,
  management: ManagementIcon,
  'partner-guide': PartnerGuide,
  'postgres-docs': PostgresDocs,
  'postgres-guides': PostgresGuides,
  regions: Regions,
  sdk: Sdk,
  status: Status,
  support: Support,
  'why-neon': WhyNeon,
};

const isActiveItem = (items, currentSlug) =>
  items?.some(
    ({ slug, items }) => slug === currentSlug || (items && isActiveItem(items, currentSlug))
  );

const Item = ({
  basePath,
  title,
  section = null,
  slug = null,
  icon = null,
  tag = null,
  ariaLabel = null,
  items = null,
  parentMenu = null,
  onToggleSubmenu = null,
  closeMobileMenu = null,
}) => {
  const pathname = usePathname();
  const currentSlug = pathname.replace(basePath, '');
  const hasActiveChild = isActiveItem(items, currentSlug);
  const Icon = icons[icon];
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(() => hasActiveChild);

  const externalSlug = slug && slug.startsWith('http') ? slug : null;
  const docSlug = `${basePath}${slug}/`;

  const LinkTag = slug ? Link : 'button';

  const handleOpenSubmenu = () => {
    setIsSubmenuOpen(true);
    onToggleSubmenu();
  };

  const handleCloseSubmenu = () => {
    setIsSubmenuOpen(false);
    onToggleSubmenu();
  };

  const handleClick = () => {
    if (items?.length) handleOpenSubmenu();
    if (slug && closeMobileMenu) closeMobileMenu();
  };

  if (section)
    return (
      <li className="border-b border-gray-new-94 py-2.5 first:pt-0 last:border-0 dark:border-gray-new-10">
        {section !== 'noname' && (
          <span className="block py-1.5 text-[10px] font-medium uppercase leading-tight text-gray-new-50">
            {section}
          </span>
        )}
        {items && (
          <ul>
            {items.map((item, index) => (
              <Item
                {...item}
                key={index}
                basePath={basePath}
                parentMenu={parentMenu}
                closeMobileMenu={closeMobileMenu}
                onToggleSubmenu={onToggleSubmenu}
              />
            ))}
          </ul>
        )}
      </li>
    );

  return (
    <li className="group/item flex flex-col">
      <LinkTag
        className={clsx(
          'group flex w-full items-center gap-2 py-1.5 text-left text-sm leading-tight tracking-extra-tight transition-colors duration-200',
          currentSlug === slug
            ? 'font-medium text-black-new dark:text-white'
            : 'font-normal text-gray-new-40 hover:text-black-new dark:text-gray-new-80 dark:hover:text-white'
        )}
        type={slug ? undefined : 'button'}
        to={slug ? externalSlug || docSlug : undefined}
        target={externalSlug ? '_blank' : '_self'}
        onClick={handleClick}
      >
        {ariaLabel && <span className="sr-only">{ariaLabel}</span>}
        {icon && Icon && <Icon className="size-4.5" />}
        <span
          className="[&_code]:rounded-sm [&_code]:bg-gray-new-94 [&_code]:px-1.5 [&_code]:py-px [&_code]:font-mono [&_code]:font-normal [&_code]:leading-none dark:[&_code]:bg-gray-new-15"
          aria-hidden={!!ariaLabel}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {tag && <Tag className="ml-2 mt-0.5" label={tag} size="sm" />}
        {externalSlug && (
          <ArrowExternalIcon className="text-gray-new-90 dark:text-gray-new-15 lg:hidden" />
        )}
      </LinkTag>
      {items?.length && (
        <Menu
          title={title}
          slug={slug}
          Icon={Icon}
          parentMenu={parentMenu}
          basePath={basePath}
          items={items}
          isOpen={isSubmenuOpen}
          closeMobileMenu={closeMobileMenu}
          isSubMenu
          onClose={handleCloseSubmenu}
        />
      )}
    </li>
  );
};

Item.propTypes = {
  basePath: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  section: PropTypes.string,
  slug: PropTypes.string,
  icon: PropTypes.string,
  tag: PropTypes.string,
  ariaLabel: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string,
      tag: PropTypes.string,
      items: PropTypes.arrayOf(PropTypes.any),
      ariaLabel: PropTypes.string,
    })
  ),
  parentMenu: PropTypes.exact({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  onToggleSubmenu: PropTypes.func,
  closeMobileMenu: PropTypes.func,
};

export default Item;
