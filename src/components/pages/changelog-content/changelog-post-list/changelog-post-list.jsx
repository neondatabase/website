import PropTypes from 'prop-types';
import React from 'react';
import slugify from 'slugify';

import Aside from 'components/pages/changelog-content/aside';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import AnchorIcon from 'icons/anchor.inline.svg';

const ChangelogPostList = ({ items }) => (
  <section>
    <Container size="sm">
      <div className="relative space-y-12 before:absolute before:top-4 before:bottom-3 before:left-[212px] before:h-auto before:w-px before:bg-gray-3 xl:before:hidden sm:space-y-10">
        {items.map(({ body, slug, frontmatter: { title, label } }, index) => {
          const id = slugify(slug).toLocaleLowerCase();

          return (
            <article className="relative flex sm:flex-col sm:space-y-3" key={index}>
              <Aside slug={slug} label={label} />
              <div className="pl-64 xl:pl-0">
                <Heading
                  tag="h3"
                  className="group relative mb-4 !text-xl leading-normal before:absolute before:top-3 before:-left-[49px] before:h-[11px] before:w-[11px] before:rounded-full before:bg-gray-1 xl:before:hidden"
                  id={id}
                  size="sm"
                  theme="black"
                >
                  <a
                    className="anchor absolute top-0 left-0 flex h-full -translate-x-full items-center justify-center px-2.5 opacity-0 transition-opacity duration-200 hover:opacity-100 group-hover:opacity-100 xl:left-1 sm:group-hover:opacity-0"
                    href={`#${id}`}
                    aria-hidden
                  >
                    <AnchorIcon className="w-4" />
                  </a>
                  <Link to={slug}>{title}</Link>
                </Heading>
                <Content className="prose-h3:text-xl" content={body} showH3Anchors={false} />
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
