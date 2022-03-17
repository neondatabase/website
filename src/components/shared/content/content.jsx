// eslint-disable-next-line import/no-extraneous-dependencies
import { MDXProvider } from '@mdx-js/react';
import clsx from 'clsx';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

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

const Content = ({ className, content }) => (
  <div className={clsx('prose prose-lg md:prose-base', className)}>
    <MDXProvider components={components}>
      <MDXRenderer>{content}</MDXRenderer>
    </MDXProvider>
  </div>
);

Content.propTypes = {
  className: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

Content.defaultProps = {
  className: null,
};

export default Content;
