/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import resolveBlogPreviewRequest from 'app/blog-preview/blog-preview';
import BlogGridItem from 'components/pages/blog/blog-grid-item';
import BlogHeader from 'components/pages/blog/blog-header';
import BlogLayout from 'components/pages/blog/blog-layout';
import BlogPreviewBanner from 'components/pages/blog/blog-preview-banner';
import BlogSearch from 'components/shared/blog-search';
import ScrollLoader from 'components/shared/scroll-loader';
import { BLOG_PREVIEW_CATEGORY_BASE_PATH } from 'constants/blog';
import { getBlogCategoryDescription } from 'constants/seo-data';
import {
  getAllBlogCategories,
  getBlogSnapshot,
  getCategoryBySlug,
  getPostsByCategorySlug,
} from 'utils/api-blog';
import getMetadata from 'utils/get-metadata';

const BlogPreviewCategoryPage = async ({ params, searchParams }) => {
  const { slug } = await params;
  const { branch, routeConfig, snapshot } = await resolveBlogPreviewRequest(
    searchParams,
    getBlogSnapshot
  );
  const [categories, category, posts] = await Promise.all([
    getAllBlogCategories({ previewBranch: branch, strictBranch: true }),
    getCategoryBySlug(slug, { previewBranch: branch, strictBranch: true }),
    getPostsByCategorySlug(slug, { previewBranch: branch, strictBranch: true }),
  ]);
  const validPosts = Array.isArray(posts) ? posts.filter(Boolean) : [];

  if (!category) return notFound();

  return (
    <BlogLayout categories={categories} routeConfig={routeConfig}>
      <BlogPreviewBanner branch={branch} commitSha={snapshot.commitSha} />
      <BlogHeader
        className="border-b border-gray-new-20 pb-12 lg:-top-[68px] md:top-0 md:border-b-0 md:pb-0"
        title={
          <>
            <span className="whitespace-nowrap">What we&rsquo;re shipping.</span>
            <br />
            <span className="whitespace-nowrap">What you&rsquo;re building.</span>
          </>
        }
        rssTitle="What we're shipping. What you're building."
        category={category.name}
        basePath={routeConfig.basePath}
        withLabel
      />
      <Suspense fallback={null}>
        <BlogSearch
          searchInputClassName="right-full mr-16 top-[208px] lt:top-[192px] xl:mr-3.5 lg:right-0 lg:mr-0 lg:top-3 md:static! md:right-auto! md:top-auto! md:mt-4"
          posts={validPosts}
          routeConfig={routeConfig}
        >
          <div className="grid grid-cols-2 gap-x-16 xl:gap-x-5 md:grid-cols-1 md:pt-[96px]">
            {validPosts.slice(0, 10).map((post, index) => (
              <BlogGridItem
                key={post.slug}
                className={index < 2 ? 'lg:border-t-0! lg:pt-0! md:border-t-0! md:pt-0!' : ''}
                post={post}
                category={category}
                isFeatured={post.isFeatured}
                isPriority={index < 5}
                routeConfig={routeConfig}
              />
            ))}
            {validPosts.length > 10 && (
              <ScrollLoader itemsCount={10}>
                {validPosts.slice(10).map((post) => (
                  <BlogGridItem
                    key={post.slug}
                    post={post}
                    category={category}
                    routeConfig={routeConfig}
                  />
                ))}
              </ScrollLoader>
            )}
          </div>
        </BlogSearch>
      </Suspense>
    </BlogLayout>
  );
};

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  await resolveBlogPreviewRequest(searchParams, getBlogSnapshot);

  return getMetadata({
    title: `Preview ${slug} Blog - Neon`,
    description: getBlogCategoryDescription(slug),
    pathname: `${BLOG_PREVIEW_CATEGORY_BASE_PATH}${slug}`,
    imagePath: '/images/social-previews/blog.jpg',
    robotsNoindex: 'noindex',
  });
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default BlogPreviewCategoryPage;
