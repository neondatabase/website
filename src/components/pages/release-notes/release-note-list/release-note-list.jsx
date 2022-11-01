import MarkdownIt from 'markdown-it';
import PropTypes from 'prop-types';
import React from 'react';

import Aside from 'components/pages/release-notes/aside';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const Content = ({ content }) => (
  <div
    className="prose-lg prose md:prose-base xs:prose-code:break-words"
    dangerouslySetInnerHTML={{ __html: md.render(content) }}
  />
);

Content.propTypes = {
  content: PropTypes.string.isRequired,
};

const ReleaseNoteList = ({ items }) => (
  <div className="relative space-y-12 before:absolute before:top-4 before:bottom-3 before:left-[180px] before:h-auto before:w-px before:bg-gray-5 xl:before:hidden sm:space-y-16">
    {items.map(({ fields: { slug }, body, frontmatter: { label } }, index) => (
      <article className="relative flex sm:flex-col sm:space-y-3" key={index}>
        <Aside slug={slug} label={label} />
        <div className="relative pl-56 before:absolute before:top-3 before:left-[175px] before:h-[11px] before:w-[11px] before:rounded-full before:bg-gray-1 xl:pl-0 xl:before:hidden">
          <Content content={body} />
        </div>
      </article>
    ))}
  </div>
);

ReleaseNoteList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      body: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      frontmatter: PropTypes.shape({
        label: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default ReleaseNoteList;
