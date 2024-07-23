import Budget from 'components/pages/variable/budget';
import Efficiency from 'components/pages/variable/efficiency';
import Hero from 'components/pages/variable/hero';
import Load from 'components/pages/variable/load';
import RelevantArticles from 'components/pages/variable/relevant-articles';
import Unique from 'components/pages/variable/unique';
import Cta from 'components/shared/get-started';
import Layout from 'components/shared/layout';
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
    slug: '/docs/introduction/neon-utils',
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

const VariableLoadPage = async () => {
  const blogArticles = await fetchBlogArticles(blogArticlesData);
  const docsArticles = articlesWithImages(docsArticlesData);
  const externalArticles = articlesWithImages(externalArticlesData);
  const allArticles = [...blogArticles, ...docsArticles, ...externalArticles];

  return (
    <Layout>
      <Hero />
      <Load />
      <Efficiency />
      <Budget />
      <Unique />
      <RelevantArticles articles={allArticles} />
      <Cta
        title="Try it yourself"
        description="You can experiment with autoscaling for free during 14 days"
        button={{
          title: 'Request a Scale trial',
          url: LINKS.scaleTrial,
        }}
        size="sm"
      />
    </Layout>
  );
};

export default VariableLoadPage;

export const revalidate = 60;
