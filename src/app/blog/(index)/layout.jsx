import BlogNavLink from 'components/pages/blog/blog-nav-link';
import Communities from 'components/pages/blog/communities';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';

const categories = [
  {
    name: 'All posts',
    slug: 'all',
  },
  {
    name: 'Engineering',
    slug: 'engineering',
  },
  {
    name: 'Company',
    slug: 'company',
  },
  {
    name: 'Community',
    slug: 'community',
  },
  {
    name: 'Release notes',
    slug: '/docs/release-notes',
    isExternal: true,
  },
  {
    name: 'Video',
    slug: 'https://www.youtube.com/@neondatabase/videos',
    isExternal: true,
  },
  {
    name: 'Appearances',
    slug: 'appearances',
  },
];

// eslint-disable-next-line react/prop-types
const BlogPageLayout = ({ children }) => (
  <Layout
    className="bg-black-new text-white"
    headerTheme="gray-8"
    footerTheme="black-new"
    headerWithBottomBorder
    footerWithTopBorder
  >
    <h1 className="sr-only">Blog</h1>
    <div className="bg-gray-new-8 pt-32 pb-40 lg:pt-0">
      <Container className="grid grid-cols-12 gap-x-10 xl:gap-x-6 lg:gap-x-4" size="lg">
        <aside className="col-span-2 lg:col-span-full">
          <nav className="sticky top-16">
            <ul className="flex flex-col lg:flex-row lg:gap-x-7 lg:py-3.5">
              {categories.map(({ name, slug, isExternal }, index) => (
                <li className="py-1.5 first:pt-0 last:pb-0 lg:py-0" key={index}>
                  <BlogNavLink name={name} slug={slug} isExternal={isExternal} />
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="relative col-span-10 col-start-3 grid max-w-[1220px] gap-y-20 before:absolute before:-top-px before:left-1/2 before:hidden before:h-px before:w-screen before:-translate-x-1/2 before:bg-gray-new-20 lg:col-span-full lg:pt-10 lg:before:block">
          {children}
        </div>
      </Container>
    </div>
    <Communities />
  </Layout>
);

export default BlogPageLayout;
