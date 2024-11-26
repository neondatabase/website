import clsx from 'clsx';
import slugify from 'slugify';

import Budget from 'components/pages/variable/budget';
import Efficiency from 'components/pages/variable/efficiency';
import Hero from 'components/pages/variable/hero';
import Load from 'components/pages/variable/load';
import Unique from 'components/pages/variable/unique';
import Container from 'components/shared/container';
import Cta from 'components/shared/cta';
import Layout from 'components/shared/layout';
import TableOfContents from 'components/shared/table-of-contents';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.variable);

const titles = [
  'Variable traffic, fixed costs?',
  'Pay only for what you use with Neon',
  'Why Neon vs Aurora Serverless',
  'How much money are you wasting on&nbsp;unused compute?',
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
    <Layout headerWithBorder burgerWithoutBorder isHeaderSticky>
      <div className="safe-paddings flex flex-1 flex-col dark:bg-black-pure dark:text-white lg:block">
        <Container
          className="grid w-full flex-1 grid-cols-12 gap-x-10 pt-[88px] xl:gap-x-7 xl:pt-14 lg:block lg:gap-x-5 lg:pt-11 md:pt-8"
          size="1344"
        >
          <div className="col-span-6 col-start-4 -mx-[26px] flex flex-col 2xl:col-span-9 2xl:col-start-2 2xl:mx-5 xl:col-span-8 xl:col-start-3 lg:ml-0 md:mx-auto">
            <article>
              <Hero />
              <Load title={tableOfContents[0]} />
              <Efficiency title={tableOfContents[1]} />
              <Unique title={tableOfContents[2]} />
              <Budget title={tableOfContents[3]} />
            </article>
          </div>
          <div className="col-start-10 col-end-13 ml-[50px] h-full xl:hidden">
            <nav
              className={clsx(
                'no-scrollbars sticky bottom-10 top-[104px] -mt-2 max-h-[calc(100vh-80px)]',
                'before:absolute before:-inset-5 before:-z-10 before:rounded-xl before:bg-black-pure/50 before:backdrop-blur'
              )}
            >
              <TableOfContents items={tableOfContents} />
            </nav>
          </div>
        </Container>
        <Cta
          className="pb-[240px] pt-[340px] lg:pb-32 lg:pt-52 sm:pb-[110px]"
          title="Ask us for a<br> price estimation"
          description="Start saving with Neon"
          buttonClassName="mt-9 h-12 w-[201px] lg:mt-7 lg:h-11 lg:w-[186px] lg:text-sm md:mt-4.5 md:h-10 md:w-[183px]"
          buttonText="Contact us"
          buttonUrl={LINKS.contactSales}
        />
      </div>
    </Layout>
  );
};

export default VariableLoadPage;

export const revalidate = 60;
