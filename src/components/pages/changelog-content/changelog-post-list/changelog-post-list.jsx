import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Link from 'components/shared/link';
import getChangelogPostDateFromSlug from 'utils/get-changelog-post-date-from-slug';
import getChangelogPostPath from 'utils/get-changelog-post-path';

const ChangelogPostList = ({ items }) => (
  <section>
    <Container size="sm">
      <div className="space-y-12 sm:space-y-10">
        {items.map(({ body, slug, frontmatter: { title, version } }, index) => (
          <article
            className="relative flex border-b border-b-gray-4 pb-12 sm:flex-col sm:pb-10"
            key={index}
          >
            <div className="absolute -left-36 min-w-fit max-w-fit rounded-md border border-gray-4 xl:sticky xl:top-10 xl:mr-5 xl:max-h-20 sm:static sm:mb-3">
              <div className="border-b border-b-gray-4 py-2 px-3 text-2xl font-bold">
                v<span>{version}</span>
              </div>
              <div className="max-h-fit py-1.5 px-2.5 text-sm">
                {getChangelogPostDateFromSlug(slug)}
              </div>
            </div>
            <div>
              <h2 className="mb-5 text-3xl font-bold leading-tight">
                <Link to={getChangelogPostPath(slug)}>{title}</Link>
              </h2>
              <Content content={body} />
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
        title: PropTypes.string.isRequired,
        version: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default ChangelogPostList;
