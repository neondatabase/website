import clsx from 'clsx';

import Sidebar from 'components/pages/blog/sidebar';
import Container from 'components/shared/container';
import RssButton from 'components/shared/rss-button';
import { BLOG_BASE_PATH } from 'constants/blog';
import { getAllCategories } from 'utils/api-wp';

const containerClassName = 'flex gap-8 pl-16 xl:gap-6 xl:pl-0 lg:flex-col lg:gap-0';
const contentClassName = 'w-full max-w-3xl lg:max-w-full';

// eslint-disable-next-line react/prop-types
const BlogPageLayout = async ({ children }) => {
  const categories = await getAllCategories();

  return (
    <div className="safe-paddings pb-24 pt-16 lg:pb-20 lg:pt-12 sm:pb-16 sm:pt-10">
      <Container className="flex flex-col" size="1344">
        <div className={containerClassName}>
          <span className="w-[192px] shrink-0 lg:hidden" aria-hidden />
          <div
            className={clsx(
              contentClassName,
              'mb-12 flex items-end justify-between text-center lg:mb-10 lg:items-center md:mb-8'
            )}
          >
            <h1 className="font-title text-4xl font-medium leading-none tracking-extra-tight lg:text-[32px] md:text-[28px]">
              Blog
            </h1>
            <RssButton className="mb-1.5 lg:mb-0" basePath={BLOG_BASE_PATH} title="Blog" />
          </div>
        </div>
        <div className={containerClassName}>
          <Sidebar categories={categories} />
          <div className={contentClassName}>{children}</div>
        </div>
      </Container>
    </div>
  );
};

export default BlogPageLayout;
