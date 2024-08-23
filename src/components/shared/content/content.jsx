/* eslint-disable react/prop-types */
import clsx from 'clsx';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import remarkGfm from 'remark-gfm';

import CaseCta from 'components/pages/case/case-cta';
import Testimonial from 'components/pages/case/testimonial';
import CodeTabs from 'components/pages/doc/code-tabs';
import CommunityBanner from 'components/pages/doc/community-banner';
import DefinitionList from 'components/pages/doc/definition-list';
import DetailIconCards from 'components/pages/doc/detail-icon-cards';
import DocsList from 'components/pages/doc/docs-list';
import IncludeBlock from 'components/pages/doc/include-block';
import InfoBlock from 'components/pages/doc/info-block';
import Tabs from 'components/pages/doc/tabs';
import TabItem from 'components/pages/doc/tabs/tab-item';
import TechnologyNavigation from 'components/pages/doc/technology-navigation';
import YoutubeIframe from 'components/pages/doc/youtube-iframe';
import Admonition from 'components/shared/admonition';
import AnchorHeading from 'components/shared/anchor-heading';
import CodeBlock from 'components/shared/code-block';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import getCodeProps from 'lib/rehype-code-props';

import sharedMdxComponents from '../../../../content/docs/shared-content';
import DocCta from '../doc-cta';
import ImageZoom from '../image-zoom';

const sharedComponents = Object.keys(sharedMdxComponents).reduce((acc, key) => {
  acc[key] = () => IncludeBlock({ url: sharedMdxComponents[key] });
  return acc;
}, {});

const Heading =
  (Tag) =>
  // eslint-disable-next-line react/prop-types
  ({ children, className = null }) => (
    <Tag className={clsx(className, 'postgres-heading')}>{children}</Tag>
  );

const getHeadingComponent = (heading, withoutAnchorHeading, isPostgres) => {
  if (withoutAnchorHeading) {
    return heading;
  }
  if (isPostgres) {
    return Heading(heading);
  }

  return AnchorHeading(heading);
};

const getComponents = (withoutAnchorHeading, isReleaseNote, isPostgres, isCase) => ({
  h2: getHeadingComponent('h2', withoutAnchorHeading, isPostgres),
  h3: getHeadingComponent('h3', withoutAnchorHeading, isPostgres),
  h4: getHeadingComponent('h4', withoutAnchorHeading, isPostgres),
  table: (props) => (
    <div className="table-wrapper">
      <table {...props} />
    </div>
  ),
  // eslint-disable-next-line react/jsx-no-useless-fragment
  undefined: (props) => <Fragment {...props} />,
  pre: (props) => <CodeBlock {...props} />,
  a: (props) => {
    const { href, children, ...otherProps } = props;
    if (children === '#id') {
      const id = href?.startsWith('#') ? href.replace('#', '') : undefined;
      return <span id={id} />;
    }

    const regex = /^(?!\/|https?:|#)[\w-]+$/;
    if (isPostgres && regex.test(href)) {
      const postgresHref = `${LINKS.postgres}/${href}`;

      return (
        <Link to={postgresHref} {...otherProps}>
          {children}
        </Link>
      );
    }

    return (
      <Link to={href} {...otherProps}>
        {children}
      </Link>
    );
  },
  img: (props) => {
    const { className, title, src, ...rest } = props;

    return (
      <ImageZoom src={src}>
        <Image
          className={clsx(className, { 'no-border': title === 'no-border' })}
          src={src}
          width={isReleaseNote ? 762 : 796}
          height={isReleaseNote ? 428 : 447}
          style={{ width: '100%', height: '100%' }}
          title={title !== 'no-border' ? title : undefined}
          {...rest}
        />
      </ImageZoom>
    );
  },
  p: (props) => {
    const { children, className } = props;
    const href =
      // eslint-disable-next-line react/prop-types
      Array.isArray(children) ? children.find((child) => child?.props?.href)?.props?.href : null;

    const id = href?.startsWith('#') ? href.replace('#', '') : undefined;

    if (isPostgres) {
      return <p className={clsx(className, { 'postgres-paragraph': id })} id={id} {...props} />;
    }

    return <p {...props} />;
  },
  YoutubeIframe,
  DefinitionList,
  Admonition,
  CodeTabs,
  DetailIconCards,
  TechnologyNavigation,
  CommunityBanner,
  Tabs,
  TabItem,
  InfoBlock,
  DocsList,
  CTA: isCase ? CaseCta : DocCta,
  Testimonial,
  ...sharedComponents,
});

// eslint-disable-next-line no-return-assign
const Content = ({
  className = null,
  content,
  asHTML = false,
  withoutAnchorHeading = false,
  isReleaseNote = false,
  isPostgres = false,
  isCase = false,
}) => (
  <div className={clsx('prose-doc prose dark:prose-invert xs:prose-code:break-words', className)}>
    {asHTML ? (
      <div dangerouslySetInnerHTML={{ __html: content }} />
    ) : (
      <MDXRemote
        components={getComponents(withoutAnchorHeading, isReleaseNote, isPostgres, isCase)}
        source={content}
        options={{
          mdxOptions: {
            remarkPlugins: [
              // Adds support for GitHub Flavored Markdown
              remarkGfm,
            ],
            rehypePlugins: [getCodeProps],
          },
        }}
      />
    )}
  </div>
);
Content.propTypes = {
  className: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  asHTML: PropTypes.bool,
  withoutAnchorHeading: PropTypes.bool,
  isReleaseNote: PropTypes.bool,
  isPostgres: PropTypes.bool,
};

export default Content;
