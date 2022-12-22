// eslint-disable-next-line import/no-extraneous-dependencies
import { MDXProvider } from '@mdx-js/react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Fragment, forwardRef } from 'react';

import Admonition from 'components/pages/doc/admonition';
import CodeTabs from 'components/pages/doc/code-tabs';
import DefinitionList from 'components/pages/doc/definition-list';
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
  code: (props) => {
    if (props?.className?.startsWith('language-')) {
      return <CodeBlock {...props} />;
    }
    return <code {...props} />;
  },
  pre: (props) => <div {...props} />,
  DefinitionList,
  Admonition,
  CodeTabs,
};

// eslint-disable-next-line no-return-assign
const Content = forwardRef(({ className, content, asHTML }, ref) => {
  if (asHTML) {
    return (
      <div
        className={clsx('prose-doc prose dark:prose-invert xs:prose-code:break-words', className)}
        ref={ref}
      >
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  }

  return (
    <div
      className={clsx('prose-doc prose dark:prose-invert xs:prose-code:break-words', className)}
      ref={ref}
    >
      <MDXProvider components={components}>{content}</MDXProvider>
    </div>
  );
});

Content.propTypes = {
  className: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  asHTML: PropTypes.bool,
};

Content.defaultProps = {
  className: null,
  asHTML: false,
};

export default Content;
