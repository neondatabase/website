'use client';

/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

import ICONS_CONFIG from 'config/docs-icons-config';
import { DOCS_BASE_PATH } from 'constants/docs';
import sendGtagEvent from 'utils/send-gtag-event';

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
              'relative flex h-full flex-col justify-between overflow-hidden border border-gray-new-80 bg-[#E4F1EB]/40 p-5 transition-colors duration-200',
              'hover:border-gray-new-70 hover:bg-[#E4F1EB]',
              'dark:border-gray-new-30 dark:bg-gray-new-8 dark:hover:border-gray-new-40 dark:hover:bg-gray-new-10'
            )}
            key={index}
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            onClick={() => sendGtagEvent('Link Clicked', { text: title, tag_name: 'TechCard' })}
          >
            <div className="relative z-10">
              <img
                className={clsx('h-8 w-auto shrink-0', darkIconPath && 'dark:hidden')}
                src={lightIconPath}
                width={32}
                height={32}
                alt={`${icon} logo`}
                loading={index > 3 ? 'lazy' : 'eager'}
              />
              {darkIconPath && (
                <img
                  className="hidden dark:block"
                  src={darkIconPath}
                  width={32}
                  height={32}
                  alt={`${icon} logo`}
                  loading={index > 3 ? 'lazy' : 'eager'}
                />
              )}
              <h3 className="mt-8 text-lg font-medium leading-snug tracking-extra-tight text-gray-new-8 dark:text-white">
                {title}
              </h3>
              <p className="mt-1.5 text-base leading-snug tracking-extra-tight text-gray-new-50 dark:text-gray-new-60">
                {description}
              </p>
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
