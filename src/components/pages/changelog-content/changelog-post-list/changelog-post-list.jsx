import PropTypes from 'prop-types';
import React from 'react';

import Aside from 'components/pages/changelog-content/aside';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Link from 'components/shared/link';

const ChangelogPostList = ({ items }) => (
  <section>
    <Container size="sm">
      <div className="space-y-12 sm:space-y-10">
        {items.map(({ body, slug, frontmatter: { title, version } }, index) => (
          <article
            className="relative flex border-b border-b-gray-4 pb-12 sm:flex-col sm:pb-10"
            key={index}
          >
            <Aside version={version} slug={slug} />
            <div>
              <h2 className="mb-5 text-3xl font-bold leading-tight">
                <Link to={slug}>{title}</Link>
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
