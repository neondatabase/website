/* eslint-disable react/prop-types */
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import PropTypes from 'prop-types';
import React from 'react';

import AnchorHeading from 'components/shared/anchor-heading';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'prismjs/themes/prism.css';

const components = {
  h2: AnchorHeading('h2'),
  h3: AnchorHeading('h3'),
  table: (props) => (
    <div className="table-wrapper">
      <table {...props} />
    </div>
  ),
};

const DocContent = ({ title, content }) => (
  <article className="relative">
    <div className="relative flex flex-col">
      <h1 className="t-5xl font-semibold">{title}</h1>
      <div className="prose prose-lg !mt-6 !max-w-full md:!mt-5">
        <MDXProvider components={components}>
          <MDXRenderer>{content}</MDXRenderer>
        </MDXProvider>
      </div>
    </div>
  </article>
);

DocContent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default DocContent;
