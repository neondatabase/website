/* eslint-disable react/prop-types */
import clsx from 'clsx';
import { graphql } from 'gatsby';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import Content from 'components/pages/blog-post/content';
import Hero from 'components/pages/blog-post/hero';
import SocialShare from 'components/pages/blog-post/social-share';
import CodeBlock from 'components/shared/code-block';
import Layout from 'components/shared/layout';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import getReactContentWithLazyBlocks from 'utils/get-react-content-with-lazy-blocks';

const BlogPostTemplate = ({
  data: {
    wpPost: { content, title, pageBlogPost, date, readingTime, seo },
  },
  location: { pathname },
  pageContext: { pagePath },
}) => {
  const contentWithLazyBlocks = getReactContentWithLazyBlocks(
    content,
    {
      blogpostcode: CodeBlock,
    },
    true
  );
  const [socialShareRef, isSocialShareInView] = useInView({
    threshold: 0.5,
  });
  return (
    <Layout
      seo={{
        ...seo,
        description: pageBlogPost.description,
        pathname,
      }}
      headerTheme="white"
      isHeaderSticky
    >
      <div className="mx-auto grid max-w-[1009px] grid-cols-10 gap-x-8 pt-20 xl:max-w-[936px] xl:pt-16 lg:max-w-none lg:px-6 lg:pt-12 md:gap-x-0 md:px-4 md:pt-6">
        <SocialShare
          className={clsx(
            'col-span-1 transition-opacity duration-150 md:hidden',
            isSocialShareInView ? 'invisible opacity-0' : 'visible opacity-100'
          )}
          slug={pagePath}
          title={title}
          isSticky
        />

        <article className="col-start-2 col-end-10 md:col-span-full">
          <Hero title={title} {...pageBlogPost} date={date} readingTime={readingTime} />
          <Content className="mt-8" html={contentWithLazyBlocks} />
          <SocialShare slug={pagePath} title={title} ref={socialShareRef} withTopBorder />
        </article>
      </div>
      <SubscribeMinimalistic />
    </Layout>
  );
};

export const query = graphql`
  query ($id: String!) {
    wpPost(id: { eq: $id }) {
      slug
      title
      content
      readingTime
      date(formatString: "MMMM D, YYYY")
      pageBlogPost {
        description
        author {
          ... on WpPostAuthor {
            title
            postAuthor {
              role
              image {
                localFile {
                  childImageSharp {
                    gatsbyImageData(width: 40)
                  }
                }
              }
            }
          }
        }
      }
      ...wpPostSeo
    }
  }
`;

export default BlogPostTemplate;
