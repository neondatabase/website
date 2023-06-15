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
import IntroNavigation from 'components/pages/doc/intro-navigation';
import TechnologyNavigation from 'components/pages/doc/technology-navigation';
import YoutubeIframe from 'components/pages/doc/youtube-iframe';
import AnchorHeading from 'components/shared/anchor-heading';
import CodeBlock from 'components/shared/code-block';
import Link from 'components/shared/link';

const components = {
  h2: AnchorHeading('h2'),
  h3: AnchorHeading('h3'),
  table: (props) => (
    <div className="table-wrapper">
      <table {...props} />
    </div>
  ),
  // eslint-disable-next-line react/jsx-no-useless-fragment
  undefined: (props) => <Fragment {...props} />,
  code: (props) => {
    if (props?.className?.startsWith('language-') && props?.children) {
      return <CodeBlock {...props} />;
    }
    return <code {...props} />;
  },
  pre: (props) => <div {...props} />,
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
      width={796}
      height={447}
      style={{ width: '100%', height: '100%' }}
    />
  ),
  YoutubeIframe,
  DefinitionList,
  Admonition,
  CodeBlock,
  CodeTabs,
  IntroNavigation,
  TechnologyNavigation,
  CommunityBanner,
};

// eslint-disable-next-line no-return-assign
const Content = forwardRef(({ className = null, content, asHTML = false }, ref) => (
  <div
    className={clsx('prose-doc prose dark:prose-invert xs:prose-code:break-words', className)}
    ref={ref}
  >
    {asHTML ? (
      <div dangerouslySetInnerHTML={{ __html: content }} />
    ) : (
      <MDXRemote components={components} {...content} />
    )}
  </div>
));

Content.propTypes = {
  className: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  asHTML: PropTypes.bool,
};

export default Content;
