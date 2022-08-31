import PropTypes from 'prop-types';
import React from 'react';
import slugify from 'slugify';

import Aside from 'components/pages/changelog-content/aside';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

import AnchorIcon from './images/anchor.inline.svg';

const ChangelogPostList = ({ items }) => (
  <section>
    <Container size="sm">
      <div className="space-y-12 sm:space-y-10">
        {items.map(({ body, slug, frontmatter: { title } }, index) => {
          const id = slugify(slug).toLocaleLowerCase();

          return (
            <article
              className="relative flex border-b border-b-gray-4 pb-12 sm:flex-col sm:pb-10"
              key={index}
            >
              <Aside slug={slug} />
              <div>
                <Heading
                  tag="h3"
                  className="group relative mb-5 !text-2xl leading-normal"
                  id={id}
                  size="sm"
                  theme="black"
                >
                  <a
                    className="anchor absolute top-0 left-0 flex h-full -translate-x-full items-center justify-center px-2.5 opacity-0 transition-opacity duration-200 hover:opacity-100 group-hover:opacity-100"
                    href={`#${id}`}
                    aria-hidden
                  >
                    <AnchorIcon className="w-6" />
                  </a>
                  <Link to={slug}>{title}</Link>
                </Heading>
                <Content content={body} showH3Anchors={false} />
              </div>
            </article>
          );
        })}
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
      }).isRequired,
    })
  ).isRequired,
};

export default ChangelogPostList;
