import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Container from 'components/shared/container';
import Link from 'components/shared/link';

const PostsList = () => (
  <section className="safe-paddings pt-56 3xl:pt-52 2xl:pt-48 xl:pt-44 lg:pt-12 md:pt-6">
    <Container size="sm">
      <div className="space-y-10">
        <article className="relative border-b border-b-gray-3 pb-10">
          <h1 className="t-3xl font-semibold !leading-tight">
            <Link to="/" theme="black">
              The future of Svelte, an interview with Rich Harris
            </Link>
          </h1>
          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center">
              <StaticImage
                className="w-10 flex-shrink-0 rounded-full"
                imgClassName="rounded-full"
                src="./images/posts-list-author-photo.jpg"
                alt="Stas Kelvich"
              />
              <span className="t-lg ml-3 font-semibold">Stas Kelvich</span>
            </div>
            <p className="t-base text-gray-2">Thursday, October 28th 2021</p>
          </div>
          <p className="t-lg mt-5 !leading-normal">
            In this 45-minute interview with Lee Robinson, hear Rich Harris, the creator of Svelte,
            talk about his plans for the future of the framework. Other topics include funding open
            source, SvelteKit 1.0, the Edge-first future, and more.
          </p>
          <Link className="mt-5 font-semibold" to="/" size="sm" theme="black-primary-1">
            Read more
          </Link>
        </article>
      </div>
    </Container>
  </section>
);

PostsList.propTypes = {};

PostsList.defaultProps = {};

export default PostsList;
