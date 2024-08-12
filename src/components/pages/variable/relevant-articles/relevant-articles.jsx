import Container from 'components/shared/container';
import evolutionOfPostgres from 'images/pages/variable-load/relevant-articles/evolution-of-postgres.jpg';
import { getWpPostBySlug } from 'utils/api-posts';
import getFormattedDate from 'utils/get-formatted-date';

import Slider from './slider';

const blogArticlesData = [
  {
    slug: '/blog/autoscaling-in-action-postgres-load-testing-with-pgbench',
    order: 5,
  },
  {
    slug: '/blog/1-year-of-autoscaling-postgres-at-neon',
    order: 6,
  },
  {
    slug: '/blog/white-widgets-secret-to-scalable-postgres-neon',
    order: 1,
  },
  {
    slug: '/blog/how-recrowd-uses-neon-autoscaling-to-meet-fluctuating-demand',
    order: 2,
  },
  {
    slug: '/blog/why-you-want-a-database-that-scales-to-zero',
    order: 3,
  },
];

const docsArticlesData = [
  {
    slug: '/docs/introduction/autoscaling',
    title: 'Autoscaling',
    order: 9,
  },
  {
    slug: '/docs/extensions/neon-utils',
    title: 'The neon_utils extension',
    order: 10,
  },
];

const externalArticlesData = [
  {
    url: 'https://www.outerbase.com/blog/the-evolution-of-serverless-postgres/',
    title: 'The Evolution of Serverless Postgres',
    image: evolutionOfPostgres,
    date: 'May 29, 2024',
    order: 4,
  },
  {
    url: 'https://medium.com/@carlotasotos/database-economics-an-amazon-rds-reflection-5d7a35638b20',
    title: 'Database economics: an Amazon RDS reflection',
    date: 'May 31, 2024',
    order: 7,
  },
  {
    url: 'https://dev.to/rsiv/auto-scaling-apps-by-default-neon-api-gateway-nitric-34id',
    title: 'Architectural choices that scale',
    date: 'Jun 6, 2023',
    order: 8,
  },
  {
    url: 'https://github.com/prisma/read-replicas-demo',
    title: 'Read Replicas Demo',
    order: 11,
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

const RelevantArticles = async () => {
  const blogArticles = await fetchBlogArticles(blogArticlesData);
  const docsArticles = articlesWithImages(docsArticlesData);
  const externalArticles = articlesWithImages(externalArticlesData);
  const allArticles = [...blogArticles, ...docsArticles, ...externalArticles];

  return (
    <section className="viewed-articles mt-[72px] xl:mt-16 lg:mt-14 md:mt-11">
      <Container size="1220" className="md:px-5">
        <Slider articles={allArticles} />
      </Container>
    </section>
  );
};

export default RelevantArticles;
