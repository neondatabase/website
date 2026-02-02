import clsx from 'clsx';
import slugify from 'slugify';

import Efficiency from 'components/pages/variable/efficiency';
import Hero from 'components/pages/variable/hero';
import Load from 'components/pages/variable/load';
import Unique from 'components/pages/variable/unique';
import Container from 'components/shared/container';
import CTANew from 'components/shared/cta-new';
import Layout from 'components/shared/layout';
import SidebarCta from 'components/shared/sidebar-cta';
import TableOfContents from 'components/shared/table-of-contents';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.variable);

const titles = [
  'Fixed Compute = Manual Resizes, Extra Costs',
  'Neon Autoscaling Fixes This Problem',
  'Neon vs other serverless databases',
];

const VariableLoadPage = async () => {
  const tableOfContents = titles.map((title) => ({
    title,
    id: slugify(title.replace(/&nbsp;/g, ' '), {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    }),
  }));

  return (
    <Layout isHeaderSticky>
      <div className="safe-paddings flex flex-1 flex-col dark:bg-black-pure dark:text-white lg:block">
        <Container
          className="grid w-full flex-1 grid-cols-12 gap-x-10 pt-[88px] xl:gap-x-7 xl:pt-14 lg:block lg:gap-x-5 lg:pt-11 md:pt-8"
          size="1344"
        >
          <div className="col-span-6 col-start-4 -mx-10 flex flex-col 2xl:col-span-7 2xl:col-start-3 2xl:mx-0 xl:col-span-10 xl:col-start-2 lg:ml-0 lg:pt-0 md:mx-auto md:pb-[70px] sm:pb-8">
            <article>
              <Hero />
              <Load title={tableOfContents[0]} />
              <Efficiency title={tableOfContents[1]} />
              <Unique title={tableOfContents[2]} />
            </article>
          </div>
          <div className="col-span-2 col-start-11 -ml-12 h-full max-w-64 2xl:col-span-3 2xl:col-start-10 2xl:ml-auto 2xl:max-w-[238px] xl:hidden">
            <div
              className={clsx(
                'sticky top-[104px]',
                'before:absolute before:-inset-5 before:-z-10 before:rounded-xl before:bg-black-pure/50 before:backdrop-blur'
              )}
            >
              <TableOfContents items={tableOfContents} />
              <div className="mt-2.5 w-56 shrink-0 border-t border-gray-new-90 pt-4 dark:border-gray-new-15/70">
                <SidebarCta />
              </div>
            </div>
          </div>
        </Container>
        <CTANew
          title="Ask us for a<br> price estimation"
          description="Start saving with Neon"
          buttonText="Contact us"
          buttonUrl={LINKS.contactSales}
        />
      </div>
    </Layout>
  );
};

export default VariableLoadPage;
