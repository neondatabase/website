import Container from 'components/shared/container';
import { getWpPostBySlug } from 'utils/api-posts';
import getFormattedDate from 'utils/get-formatted-date';

import evolutionOfPostgres from './images/evolution-of-postgres.jpg';
import Slider from './slider';

const articles = [
  {
    url: 'https://www.outerbase.com/blog/the-evolution-of-serverless-postgres/',
    title: 'The Evolution of Serverless Postgres',
    image: evolutionOfPostgres,
    date: 'May 29, 2024',
  },
  {
    slug: '/blog/autoscaling-in-action-postgres-load-testing-with-pgbench',
  },
  {
    slug: '/blog/1-year-of-autoscaling-postgres-at-neon',
  },
  {
    url: 'https://medium.com/@carlotasotos/database-economics-an-amazon-rds-reflection-5d7a35638b20',
    title: 'Database economics: an Amazon RDS reflection',
    date: 'May 31, 2024',
  },
  {
    url: 'https://dev.to/rsiv/auto-scaling-apps-by-default-neon-api-gateway-nitric-34id',
    title: 'Architectural choices that scale',
    date: 'Jun 6, 2023',
  },
  {
    slug: '/docs/introduction/autoscaling',
    title: 'Autoscaling',
  },
  {
    slug: '/docs/introduction/neon-utils',
    title: 'The neon_utils extension',
  },
  {
    url: 'https://github.com/prisma/read-replicas-demo',
    title: 'Read Replicas Demo',
  },
  {
    slug: '/blog/white-widgets-secret-to-scalable-postgres-neon',
  },
  {
    slug: '/blog/how-recrowd-uses-neon-autoscaling-to-meet-fluctuating-demand',
  },
  {
    slug: '/blog/why-you-want-a-database-that-scales-to-zero',
  },
];

const RelevantArticles = () => {
  articles.forEach(async (article) => {
    if (article.slug?.includes('/blog/')) {
      const postResult = await getWpPostBySlug(article.slug);
      const { post } = postResult;
      if (post) {
        article.title = post.title;
        article.date = getFormattedDate(post.date);
        article.image = post.seo?.twitterImage?.mediaItemUrl;
      }
    }
  });

  return (
    <section className="viewed-articles mt-[72px] xl:mt-16 lg:mt-14 md:mt-11">
      <Container size="1220" className="md:px-5">
        <Slider articles={articles} />
      </Container>
    </section>
  );
};

export default RelevantArticles;
