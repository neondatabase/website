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
    <div className="bg-gray-new-8 pb-40 pt-32 xl:pb-32 lt:pt-[68px] lg:pb-28 lg:pt-0 md:pb-20">
      <Container className="grid grid-cols-12 gap-x-10 xl:gap-x-6 lt:gap-x-4" size="lg">
        <aside className="col-span-2 lt:col-span-full">
          <nav className="no-scrollbars sticky top-16 md:-mx-4 md:max-w-5xl md:overflow-auto md:px-4">
            <ul className=" flex flex-col lt:flex-row lt:gap-x-7 lt:py-3.5 md:after:shrink-0 md:after:grow-0 md:after:basis-px md:after:content-['']">
              {categories.map(({ name, slug }, index) => (
                <li className="py-1.5 first:pt-0 last:pb-0 lt:py-0" key={index}>
                  <BlogNavLink name={name} slug={slug} />
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="relative col-span-10 col-start-3 grid max-w-[1220px] gap-y-20 before:absolute before:-top-px before:left-1/2 before:hidden before:h-px before:w-screen before:-translate-x-1/2 before:bg-gray-new-20 xl:gap-y-12 lt:col-span-full lt:pt-10 lt:before:block lg:gap-y-10">
          {children}
        </div>
      </Container>
    </div>
    <Communities />
  </Layout>
);

export default BlogPageLayout;
