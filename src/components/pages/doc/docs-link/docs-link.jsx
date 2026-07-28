'use client';

import PropTypes from 'prop-types';
import { Children, isValidElement } from 'react';

import LinkPreview from 'components/pages/doc/link-preview';
import Link from 'components/shared/link';
import getGlossaryItem from 'utils/get-glossary-item';

const DocsLink = ({ href, children, ...otherProps }) => {
  const baseUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;
  const isExternal = href?.startsWith('http') && !href?.startsWith(baseUrl);
  const isGlossary =
    href?.startsWith('/docs/reference/glossary') ||
    href?.startsWith(`${baseUrl}/docs/reference/glossary`);

  // Links wrapping inline code (e.g. [`pkg`](https://...)) get their external
  // arrow from the `a:has(> code)` CSS rule in doc-content.css. Skip the
  // component-level icon here to avoid rendering a second, duplicate arrow.
  const childArray = Children.toArray(children);
  const wrapsInlineCode =
    childArray.length === 1 && isValidElement(childArray[0]) && childArray[0].type === 'code';

  const icon = (isExternal && !wrapsInlineCode && 'external') || (isGlossary && 'glossary') || null;

  if (children === '#id') {
    const id = href?.startsWith('#') ? href.replace('#', '') : undefined;
    return <span id={id} />;
  }

  // Automatically generate previews for glossary links
  if (isGlossary) {
    const glossaryItem = getGlossaryItem(href);
    if (glossaryItem) {
      const { title, preview } = glossaryItem;
      return (
        <LinkPreview href={href} title={title} preview={preview} {...otherProps}>
          {children}
        </LinkPreview>
      );
    }
  }

  return (
    <Link
      to={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      icon={icon}
      tagName="DocsInlineLink"
      {...otherProps}
    >
      {children}
    </Link>
  );
};

DocsLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default DocsLink;
