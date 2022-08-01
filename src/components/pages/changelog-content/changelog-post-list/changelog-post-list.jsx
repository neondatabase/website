import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container';
import Content from 'components/shared/content';
import getChangelogPostDateFromSlug from 'utils/get-changelog-post-date-from-slug';

const ChangelogPostList = ({ items }) => (
  <section>
    <Container size="sm">
      <div className="space-y-12">
        {items.map(({ body, slug, frontmatter: { version } }, index) => (
          <article className="relative flex border-b border-b-gray-4 pb-12" key={index}>
            <div className="absolute -left-36 max-h-fit min-w-fit max-w-fit rounded-md border border-gray-4">
              <div className="border-b border-b-gray-4 py-2 px-3 text-2xl font-bold">
                v <span>{version}</span>
              </div>
              <div className="max-h-fit py-1.5 px-2.5 text-sm">
                {getChangelogPostDateFromSlug(slug)}
              </div>
            </div>
            <Content content={body} />
          </article>
        ))}
      </div>
    </Container>
  </section>
);

ChangelogPostList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      body: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      frontmatter: PropTypes.shape({
        version: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default ChangelogPostList;
