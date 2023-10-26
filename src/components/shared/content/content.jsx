'use client';

// eslint-disable-next-line import/no-extraneous-dependencies
import clsx from 'clsx';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote';
import PropTypes from 'prop-types';
import React, { Fragment, forwardRef } from 'react';

import Admonition from 'components/pages/doc/admonition';
import CodeTabs from 'components/pages/doc/code-tabs';
import CommunityBanner from 'components/pages/doc/community-banner';
import DefinitionList from 'components/pages/doc/definition-list';
import DetailIconCards from 'components/pages/doc/detail-icon-cards';
import TechnologyNavigation from 'components/pages/doc/technology-navigation';
import YoutubeIframe from 'components/pages/doc/youtube-iframe';
import AnchorHeading from 'components/shared/anchor-heading';
import CodeBlock from 'components/shared/code-block';
import Link from 'components/shared/link';

const getComponents = (withoutAnchorHeading, isReleaseNote) => ({
  h2: withoutAnchorHeading ? 'h2' : AnchorHeading('h2'),
  h3: withoutAnchorHeading ? 'h3' : AnchorHeading('h3'),
  h4: withoutAnchorHeading ? 'h4' : AnchorHeading('h4'),
  table: (props) => (
    <div className="table-wrapper">
      <table {...props} />
    </div>
  ),
  // eslint-disable-next-line react/jsx-no-useless-fragment
  undefined: (props) => <Fragment {...props} />,
  code: (props) => {
    if (props?.className?.startsWith('language-') && props?.children) {
      return <CodeBlock as="figure" {...props} />;
    }
    return <code {...props} />;
  },
  pre: (props) => <div><CodeBlock {...props} /></div>,
  a: (props) => {
    const { href, children, ...otherProps } = props;
    return (
      <Link to={href} {...otherProps}>
        {children}
      </Link>
    );
  },
  img: (props) => (
    <Image
      {...props}
      loading="lazy"
      width={isReleaseNote ? 762 : 796}
      height={isReleaseNote ? 428 : 447}
      style={{ width: '100%', height: '100%' }}
    />
  ),
  YoutubeIframe,
  DefinitionList,
  Admonition,
  CodeBlock,
  CodeTabs,
  DetailIconCards,
  TechnologyNavigation,
  CommunityBanner,
});

// eslint-disable-next-line no-return-assign
const Content = forwardRef(
  (
    {
      className = null,
      content,
      asHTML = false,
      withoutAnchorHeading = false,
      isReleaseNote = false,
    },
    ref
  ) => (
    <div
      className={clsx('prose-doc prose dark:prose-invert xs:prose-code:break-words', className)}
      ref={ref}
    >
      {asHTML ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <MDXRemote components={getComponents(withoutAnchorHeading, isReleaseNote)} {...content} />
      )}
    </div>
  )
);

Content.propTypes = {
  className: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  asHTML: PropTypes.bool,
  withoutAnchorHeading: PropTypes.bool,
  isReleaseNote: PropTypes.bool,
};

export default Content;
