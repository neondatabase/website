'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';

const LinkPreview = ({ href, title, preview, children, ...otherProps }) => {
  const isExternal = href?.startsWith('http');
  const isGlossary = href?.startsWith('/docs/reference/glossary');
  const icon = (isExternal && 'external') || (isGlossary && 'glossary') || null;

  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Link
            to={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            icon={icon}
            {...otherProps}
          >
            {children}
          </Link>
        </Tooltip.Trigger>
        <Tooltip.Portal className="TooltipPortal">
          <Tooltip.Content className="TooltipContent">
            <h4 className="font-medium tracking-tight">{title}</h4>
            <p className="mt-1 text-sm leading-snug tracking-tight text-gray-new-20 dark:text-gray-new-80">
              {preview}
            </p>
            <Tooltip.Arrow className="TooltipArrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

LinkPreview.propTypes = {
  href: PropTypes.string.isRequired,
  title: PropTypes.string,
  preview: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default LinkPreview;
