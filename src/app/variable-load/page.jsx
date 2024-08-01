import clsx from 'clsx';
import slugify from 'slugify';

import Budget from 'components/pages/variable/budget';
import Efficiency from 'components/pages/variable/efficiency';
import Hero from 'components/pages/variable/hero';
import Load from 'components/pages/variable/load';
import RelevantArticles from 'components/pages/variable/relevant-articles';
import Unique from 'components/pages/variable/unique';
import Container from 'components/shared/container';
import Cta from 'components/shared/cta';
import Layout from 'components/shared/layout';
import TableOfContents from 'components/shared/table-of-contents';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import evolutionOfPostgres from 'images/pages/variable-load/relevant-articles/evolution-of-postgres.jpg';
import { getWpPostBySlug } from 'utils/api-posts';
import getFormattedDate from 'utils/get-formatted-date';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.variable);

const blogArticlesData = [
  {
    slug: '/blog/autoscaling-in-action-postgres-load-testing-with-pgbench',
    order: 2,
  },
  {
    slug: '/blog/1-year-of-autoscaling-postgres-at-neon',
    order: 3,
  },
  {
    slug: '/blog/white-widgets-secret-to-scalable-postgres-neon',
    order: 9,
  },
  {
    slug: '/blog/how-recrowd-uses-neon-autoscaling-to-meet-fluctuating-demand',
    order: 10,
  },
  {
    slug: '/blog/why-you-want-a-database-that-scales-to-zero',
    order: 11,
  },
];

const docsArticlesData = [
  {
    slug: '/docs/introduction/autoscaling',
    title: 'Autoscaling',
    order: 6,
  },
  {
    slug: '/docs/extensions/neon-utils',
    title: 'The neon_utils extension',
    order: 7,
  },
];

const externalArticlesData = [
  {
    url: 'https://www.outerbase.com/blog/the-evolution-of-serverless-postgres/',
    title: 'The Evolution of Serverless Postgres',
    image: evolutionOfPostgres,
    date: 'May 29, 2024',
    order: 1,
  },
  {
    url: 'https://medium.com/@carlotasotos/database-economics-an-amazon-rds-reflection-5d7a35638b20',
    title: 'Database economics: an Amazon RDS reflection',
    date: 'May 31, 2024',
    order: 4,
  },
  {
    url: 'https://dev.to/rsiv/auto-scaling-apps-by-default-neon-api-gateway-nitric-34id',
    title: 'Architectural choices that scale',
    date: 'Jun 6, 2023',
    order: 5,
  },
  {
    url: 'https://github.com/prisma/read-replicas-demo',
    title: 'Read Replicas Demo',
    order: 8,
  },
];

const fetchBlogArticles = async (articles) =>
  Promise.all(
    articles.map(async (article) => {
      const { post } = await getWpPostBySlug(article.slug);
      if (post) {
        return {
          ...article,
          title: post.title,
          date: getFormattedDate(post.date),
          image: post.seo?.twitterImage?.mediaItemUrl,
        };
      }
      return article;
    })
  );

const articlesWithImages = (articles) =>
  articles.map((article) => {
    if (article.image) {
      return article;
    }
    const encodedTitle = Buffer.from(article.title).toString('base64');
    const imagePath = `/docs/og?title=${encodedTitle}&show-logo=${article.url ? 'false' : 'true'}`;
    return {
      ...article,
      image: imagePath,
    };
  });

const titles = [
  'Variable resources for variable&nbsp;load',
  'Maximize efficiency and cut costs with Serverless Postgres',
  'How much budget are you wasting on&nbsp;unused compute?',
  'What makes Neon unique vs&nbsp;others?',
];

const VariableLoadPage = async () => {
  const blogArticles = await fetchBlogArticles(blogArticlesData);
  const docsArticles = articlesWithImages(docsArticlesData);
  const externalArticles = articlesWithImages(externalArticlesData);
  const allArticles = [...blogArticles, ...docsArticles, ...externalArticles];

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
              <Budget title={tableOfContents[2]} />
              <Unique title={tableOfContents[3]} />
            </article>
          </div>

          <div className="col-start-10 col-end-13 ml-[50px] h-full xl:hidden">
            <nav
              className={clsx(
                'no-scrollbars sticky bottom-10 top-[104px] -mt-2 max-h-[calc(100vh-80px)]',
                'before:absolute before:-inset-5 before:-z-10 before:bg-black-pure before:bg-gradient-to-b before:blur'
              )}
            >
              <TableOfContents items={tableOfContents} />
            </nav>
          </div>
        </Container>

        <RelevantArticles articles={allArticles} />
        <Cta
          className="pb-[290px] pt-[285px] xl:py-[230px] lg:pb-[156px] lg:pt-[179px] sm:pb-[110px] sm:pt-[116px]"
          title="Try it yourself"
          description="You can experiment with autoscaling for free during 14 days"
          buttonClassName="mt-9 h-12 w-[201px] lg:mt-7 lg:h-11 lg:w-[186px] lg:text-sm md:mt-4.5 md:h-10 md:w-[183px]"
          buttonText="Request a Scale trial"
          buttonUrl={LINKS.scaleTrial}
        />
      </div>
    </Layout>
  );
};

export default VariableLoadPage;

export const revalidate = 60;
