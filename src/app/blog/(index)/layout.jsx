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
    name: 'Release notes',
    slug: 'release-notes',
  },
  {
    name: 'Community',
    slug: 'community',
  },
  {
    name: 'Video',
    slug: 'video',
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
    <div className="bg-gray-new-8 pt-32 pb-40">
      <Container className="grid grid-cols-12 gap-x-10" size="lg">
        <aside className="col-span-2">
          <nav className="sticky top-16">
            <ul className="flex flex-col">
              {categories.map(({ name, slug }, index) => (
                <li className="py-1.5 first:pt-0 last:pb-0" key={index}>
                  <BlogNavLink name={name} slug={slug} />
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="col-span-8 col-start-3 -mx-[30px] grid gap-y-20">{children}</div>
      </Container>
    </div>
    <Communities />
  </Layout>
);

export default BlogPageLayout;
