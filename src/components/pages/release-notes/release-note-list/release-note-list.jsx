import PropTypes from 'prop-types';
import React from 'react';

import Aside from 'components/pages/release-notes/aside';
import Content from 'components/shared/content';

const ReleaseNoteList = ({ items }) => (
  <div className="relative space-y-12 before:absolute before:top-4 before:bottom-3 before:left-[179px] before:h-auto before:w-px before:bg-gray-6 xl:before:hidden sm:space-y-16">
    {items.map(({ slug, content, label }, index) => (
      <article className="relative flex sm:flex-col sm:space-y-3" key={index}>
        <Aside slug={slug} label={label} />

        <div className="relative pl-56 before:absolute before:top-3 before:left-[175px] before:h-[9px] before:w-[9px] before:rounded-full before:bg-primary-1 xl:pl-0 xl:before:hidden">
          <Content content={content} />
        </div>
      </article>
    ))}
  </div>
);

ReleaseNoteList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      content: PropTypes.shape({}).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ReleaseNoteList;
