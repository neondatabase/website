/* eslint-disable react/prop-types */
import clsx from 'clsx';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import remarkGfm from 'remark-gfm';

import ChatOptions from 'components/pages/doc/chat-options';
import CodeTabs from 'components/pages/doc/code-tabs';
import CommunityBanner from 'components/pages/doc/community-banner';
import DefinitionList from 'components/pages/doc/definition-list';
import DetailIconCards from 'components/pages/doc/detail-icon-cards';
import DocsLink from 'components/pages/doc/docs-link';
import DocsList from 'components/pages/doc/docs-list';
// eslint-disable-next-line import/no-cycle
import IncludeBlock from 'components/pages/doc/include-block';
import InfoBlock from 'components/pages/doc/info-block';
import LinkPreview from 'components/pages/doc/link-preview';
import Steps from 'components/pages/doc/steps';
import Tabs from 'components/pages/doc/tabs';
import TabItem from 'components/pages/doc/tabs/tab-item';
import TechCards from 'components/pages/doc/tech-cards';
import Video from 'components/pages/doc/video';
import YoutubeIframe from 'components/pages/doc/youtube-iframe';
import SubscriptionForm from 'components/pages/use-case/subscription-form';
import Testimonial from 'components/pages/use-case/testimonial';
import TestimonialsWrapper from 'components/pages/use-case/testimonials-wrapper';
import UseCaseContext from 'components/pages/use-case/use-case-context';
import UseCaseList from 'components/pages/use-case/use-case-list';
import DeployPostgresButton from 'components/shared//deploy-postgres-button';
import Admonition from 'components/shared/admonition';
import AnchorHeading from 'components/shared/anchor-heading';
import Button from 'components/shared/button';
import CodeBlock from 'components/shared/code-block';
import ComputeCalculator from 'components/shared/compute-calculator';
import CtaBlock from 'components/shared/cta-block';
import DocCta from 'components/shared/doc-cta';
import ImageZoom from 'components/shared/image-zoom';
import InkeepEmbedded from 'components/shared/inkeep-embedded';
import LatencyCalculator from 'components/shared/latency-calculator';
import RequestForm from 'components/shared/request-form';
import getCodeProps from 'lib/rehype-code-props';

import sharedMdxComponents from '../../../../content/docs/shared-content';

const sharedComponents = Object.keys(sharedMdxComponents).reduce((acc, key) => {
  acc[key] = (props) => IncludeBlock({ url: sharedMdxComponents[key], ...props });
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
  a: (props) => <DocsLink {...props} />,
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
  Button,
  YoutubeIframe,
  DefinitionList,
  Admonition,
  CodeTabs,
  DetailIconCards,
  TechCards,
  CommunityBanner,
  Tabs,
  TabItem,
  InfoBlock,
  LinkPreview,
  DocsList,
  RequestForm,
  LatencyCalculator,
  CTA: isUseCase ? CtaBlock : DocCta,
  Testimonial,
  TestimonialsWrapper,
  UseCaseList,
  UseCaseContext,
  ComputeCalculator,
  SubscriptionForm,
  InkeepEmbedded,
  Video,
  Steps,
  DeployPostgresButton,
  ChatOptions,
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
    className={clsx(
      'prose-doc post-content prose dark:prose-invert xs:prose-code:break-words',
      className,
      {
        'dark:prose-p:text-gray-new-70 dark:prose-strong:text-white dark:prose-li:text-gray-new-70 dark:prose-table:text-gray-new-70':
          isUseCase,
      }
    )}
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
