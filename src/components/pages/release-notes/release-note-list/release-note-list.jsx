import PropTypes from 'prop-types';
import React from 'react';

import Aside from 'components/pages/release-notes/aside';
import Content from 'components/shared/content';

const ReleaseNoteList = ({ items }) => (
  <div className="relative space-y-12 before:absolute before:top-4 before:bottom-3 before:left-[178px] before:h-auto before:w-px before:bg-gray-3 xl:before:hidden sm:space-y-16">
    {items.map(({ body, slug, frontmatter: { label } }, index) => (
      <article className="relative flex sm:flex-col sm:space-y-3" key={index}>
        <Aside slug={slug} label={label} />
        <div className="relative pl-56 before:absolute before:top-3 before:left-[173px] before:h-[11px] before:w-[11px] before:rounded-full before:bg-gray-1 xl:pl-0 xl:before:hidden">
          <Content className="prose-h3:text-xl" content={body} showH3Anchors={false} />
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
