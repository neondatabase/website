/* eslint-disable react/prop-types */
import clsx from 'clsx';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import remarkGfm from 'remark-gfm';

import CodeTabs from 'components/pages/doc/code-tabs';
import CommunityBanner from 'components/pages/doc/community-banner';
import DefinitionList from 'components/pages/doc/definition-list';
import DetailIconCards from 'components/pages/doc/detail-icon-cards';
import DocsList from 'components/pages/doc/docs-list';
import IncludeBlock from 'components/pages/doc/include-block';
import InfoBlock from 'components/pages/doc/info-block';
import LinkPreview from 'components/pages/doc/link-preview';
import NumberedSteps from 'components/pages/doc/numbered-steps';
import Tabs from 'components/pages/doc/tabs';
import TabItem from 'components/pages/doc/tabs/tab-item';
import TechnologyNavigation from 'components/pages/doc/technology-navigation';
import Video from 'components/pages/doc/video';
import YoutubeIframe from 'components/pages/doc/youtube-iframe';
import SubscriptionForm from 'components/pages/use-case/subscription-form';
import Testimonial from 'components/pages/use-case/testimonial';
import TestimonialsWrapper from 'components/pages/use-case/testimonials-wrapper';
import UseCaseContext from 'components/pages/use-case/use-case-context';
import UseCaseList from 'components/pages/use-case/use-case-list';
import Admonition from 'components/shared/admonition';
import AnchorHeading from 'components/shared/anchor-heading';
import CodeBlock from 'components/shared/code-block';
import ComputeCalculator from 'components/shared/compute-calculator';
import CtaBlock from 'components/shared/cta-block';
import Link from 'components/shared/link';
import getCodeProps from 'lib/rehype-code-props';
import getGlossaryItem from 'utils/get-glossary-item';

import sharedMdxComponents from '../../../../content/docs/shared-content';
import DocCta from '../doc-cta';
import ImageZoom from '../image-zoom';
import RegionRequest from '../region-request';

const sharedComponents = Object.keys(sharedMdxComponents).reduce((acc, key) => {
  acc[key] = () => IncludeBlock({ url: sharedMdxComponents[key] });
  return acc;
}, {});

const getHeadingComponent = (heading, withoutAnchorHeading) => {
  if (withoutAnchorHeading) {
    return heading;
  }
  return AnchorHeading(heading);
};

const getComponents = (withoutAnchorHeading, isReleaseNote, isPostgres, isUseCase) => ({
  h2: getHeadingComponent('h2', withoutAnchorHeading),
  h3: getHeadingComponent('h3', withoutAnchorHeading),
  h4: getHeadingComponent('h4', withoutAnchorHeading),
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
    const baseUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;
    const isExternal = href?.startsWith('http') && !href?.startsWith(baseUrl);
    const isGlossary =
      href?.startsWith('/docs/reference/glossary') ||
      href?.startsWith(`${baseUrl}/docs/reference/glossary`);
    const icon = (isExternal && 'external') || (isGlossary && 'glossary') || null;

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
        {...otherProps}
      >
        {children}
      </Link>
    );
  },
  img: (props) => {
    const { className, title, src, ...rest } = props;

    // No zoom on PostgreSQLTutorial Images
    if (!isPostgres) {
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
    }

    return src.includes('?') ? (
      // Authors can use anchor tags to make images float right/left
      <Image
        className={clsx(
          className,
          {
            'no-border':
              title === 'no-border' || src.includes('alignleft') || src.includes('alignright'),
          },
          { 'float-right clear-left p-4 grayscale filter': src.includes('alignright') },
          { 'float-left clear-right p-4 grayscale filter': src.includes('alignleft') }
        )}
        src={src.split('?')[0]}
        width={100}
        height={100}
        style={{ width: 'auto', height: 'auto', maxWidth: '128px', maxHeight: '128px' }}
        title={title !== 'no-border' ? title : undefined}
        {...rest}
      />
    ) : (
      <Image
        className={clsx(className, { 'no-border': title === 'no-border' })}
        src={src}
        width={200}
        height={100}
        style={{ width: 'auto', height: 'auto' }}
        title={title !== 'no-border' ? title : undefined}
        {...rest}
      />
    );
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
  LinkPreview,
  DocsList,
  RegionRequest,
  CTA: isUseCase ? CtaBlock : DocCta,
  Testimonial,
  TestimonialsWrapper,
  UseCaseList,
  UseCaseContext,
  ComputeCalculator,
  SubscriptionForm,
  Video,
  NumberedSteps,
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
  isUseCase = false,
}) => (
  <div
    className={clsx('prose-doc prose dark:prose-invert xs:prose-code:break-words', className, {
      'dark:prose-p:text-gray-new-70 dark:prose-strong:text-white dark:prose-li:text-gray-new-70 dark:prose-table:text-gray-new-70':
        isUseCase,
    })}
  >
    {asHTML ? (
      <div dangerouslySetInnerHTML={{ __html: content }} />
    ) : (
      <MDXRemote
        components={getComponents(withoutAnchorHeading, isReleaseNote, isPostgres, isUseCase)}
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
