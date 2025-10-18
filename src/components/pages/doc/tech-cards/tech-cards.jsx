/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

import ICONS_CONFIG from 'config/docs-icons-config';
import { DOCS_BASE_PATH } from 'constants/docs';

import TechCardsWrapper from './tech-cards-wrapper';

const TechCards = ({ children = null, withToggler = false }) => (
  <TechCardsWrapper withToggler={withToggler}>
    {React.Children.map(children, (child, index) => {
      if (!child) return null;

      const { href, title, description, icon } = child.props;

      const iconConfig = ICONS_CONFIG[icon];
      const { lightIconPath, darkIconPath } = iconConfig;

      const isExternal = href.startsWith('http') || !href.includes(DOCS_BASE_PATH);

      return (
        <li className="!m-0 before:hidden">
          <NextLink
            className={clsx(
              'relative flex h-full flex-col justify-between overflow-hidden rounded-[10px] border border-gray-new-90 px-6 py-5 transition-colors duration-200',
              'before:absolute before:inset-px before:rounded-[10px] before:bg-[linear-gradient(275.74deg,#FAFAFA_0%,rgba(250,250,250,0)100%)] before:opacity-0 before:transition-opacity before:duration-200',
              'hover:border-gray-new-80 hover:before:opacity-100',
              'dark:border-gray-new-15 dark:before:bg-[linear-gradient(275.74deg,rgba(36,38,40,0.8)_0%,rgba(36,38,40,0)_100%)] dark:hover:border-gray-new-30 xl:p-5'
            )}
            key={index}
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
          >
            <div className="relative z-10">
              <img
                className={clsx('h-9 w-auto shrink-0', darkIconPath && 'dark:hidden')}
                src={lightIconPath}
                width={36}
                height={36}
                alt={`${icon} logo`}
                loading={index > 3 ? 'lazy' : 'eager'}
              />
              {darkIconPath && (
                <img
                  className="hidden dark:block"
                  src={darkIconPath}
                  width={36}
                  height={36}
                  alt={`${icon} logo`}
                  loading={index > 3 ? 'lazy' : 'eager'}
                />
              )}
              <h3 className="mt-[18px] text-xl font-semibold leading-tight text-black-new dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm text-gray-new-50 dark:text-gray-new-80">{description}</p>
            </div>
          </NextLink>
        </li>
      );
    })}
  </TechCardsWrapper>
);

TechCards.propTypes = {
  children: PropTypes.node,
  withToggler: PropTypes.bool,
};

export default TechCards;
