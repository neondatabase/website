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
          <article className="relative" key={index}>
            <Content content={body} />
            <div className="sticky mt-5 rounded-md border border-gray-4">
              <div className="text-xl">
                v<span className="uppercase">{version}</span>
              </div>
              <div className="text-sm">{getChangelogPostDateFromSlug(slug)}</div>
            </div>
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
