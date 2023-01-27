'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useInView } from 'react-intersection-observer';

import Content from 'components/pages/blog-post/content';
import CTA from 'components/pages/blog-post/cta';
import SocialShare from 'components/pages/blog-post/social-share';
import BlogPostAuthors from 'components/shared/blog-post-author';
import CodeBlock from 'components/shared/code-block';
import getReactContentWithLazyBlocks from 'utils/get-react-content-with-lazy-blocks';

const PostContent = ({ title, content, authors, slug }) => {
  const [socialShareRef, isSocialShareInView] = useInView({
    threshold: 0.5,
  });
  const contentWithLazyBlocks = getReactContentWithLazyBlocks(
    content,
    {
      blogpostcode: CodeBlock,
      blogpostcta: CTA,
    },
    true
  );
  const shareUrl = `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/blog/${slug}`;

  return (
    <>
      <SocialShare
        className={clsx(
          'sticky top-28 col-span-1 col-start-10 row-start-2 row-end-4 ml-3 mt-6 transition-opacity duration-150 md:hidden',
          isSocialShareInView ? 'invisible opacity-0' : 'visible opacity-100'
        )}
        slug={shareUrl}
        title={title}
        isSticky
      />

      <Content
        className="col-start-2 col-end-10 mt-8 md:col-span-full sm:mt-4"
        html={contentWithLazyBlocks}
      />

      <div className="col-start-2 col-end-10 mt-9 hidden space-x-8 lg:flex md:col-span-full sm:flex-col sm:space-x-0 sm:space-y-6">
        <BlogPostAuthors authors={authors} isBlogPost />
      </div>

      <SocialShare
        className="col-start-2 col-end-10 mt-8 md:hidden"
        slug={shareUrl}
        title={title}
        ref={socialShareRef}
        withTopBorder
      />
    </>
  );
};

PostContent.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.shape({
        title: PropTypes.string.isRequired,
        postAuthor: PropTypes.shape({
          url: PropTypes.string,
          role: PropTypes.string,
          image: PropTypes.shape({
            mediaItemUrl: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default PostContent;
