// eslint-disable-next-line import/no-extraneous-dependencies
import { MDXProvider } from '@mdx-js/react';
import clsx from 'clsx';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import CodeBlock from 'components/shared/code-block';
import Container from 'components/shared/container';

const components = {
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
  <Container size="sm">
    <div className={clsx('prose prose-lg md:prose-base', className)}>
      <MDXProvider components={components}>
        <MDXRenderer>{content}</MDXRenderer>
      </MDXProvider>
    </div>
  </Container>
);

Content.propTypes = {
  className: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

Content.defaultProps = {
  className: null,
};

export default Content;
