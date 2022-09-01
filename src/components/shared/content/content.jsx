// eslint-disable-next-line import/no-extraneous-dependencies
import { MDXProvider } from '@mdx-js/react';
import clsx from 'clsx';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import PropTypes from 'prop-types';
import React, { Fragment, forwardRef } from 'react';

import AnchorHeading from 'components/shared/anchor-heading';
import CodeBlock from 'components/shared/code-block';

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
  code: (props) => <CodeBlock {...props} />,
  pre: (props) => <div {...props} />,
};

// eslint-disable-next-line no-return-assign
const Content = forwardRef(({ className, content, showH3Anchors = true }, ref) => (
  <div
    className={clsx('prose prose-lg md:prose-base xs:prose-code:break-words', className)}
    ref={ref}
  >
    <MDXProvider components={showH3Anchors ? components : { ...components, h3: undefined }}>
      <MDXRenderer>{content}</MDXRenderer>
    </MDXProvider>
  </div>
));

Content.propTypes = {
  className: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  showH3Anchors: PropTypes.bool,
};

Content.defaultProps = {
  className: null,
  showH3Anchors: true,
};

export default Content;
