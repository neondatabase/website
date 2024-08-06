import Container from 'components/shared/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

import Example from '../example';

const Hero = () => (
  <section className="hero safe-paddings relative overflow-hidden pt-[88px] xl:pt-14 lg:pt-11 md:pt-8">
    <Container size="xxs">
      <div className="px-8 sm:px-0">
        <h1 className="text-6xl font-semibold leading-dense tracking-tighter xl:text-[56px] lg:text-5xl md:text-[36px] md:leading-tight">
          Neon for platforms
        </h1>
        <p className="mt-4 text-2xl leading-snug tracking-extra-tight text-gray-new-80 xl:text-xl md:mt-3 md:text-lg">
          Use Neon to build your free tier for a fraction of the cost.
        </p>
      </div>

      <div className="prose-variable px-8 sm:px-0">
        <p>
          Neon is a cost-effective option for managing fleets of Postgres instances. Why? Because of
          its usage-based pricing and scale-to-zero. Via its developer-friendly API, you can{' '}
          <strong>run thousands of Postgres databases without a DBA</strong>.
        </p>
        <p className="!mt-4">
          Companies like{' '}
          <Link to="/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases">
            Retool
          </Link>
          , <Link to="/blog/neon-postgres-on-vercel">Vercel</Link>,{' '}
          <Link to="/blog/neon-replit-integration">Replit</Link>, and{' '}
          <Link
            to="https://www.koyeb.com/blog/serverless-postgres-public-preview"
            target="_blank"
            rel="noopener noreferrer"
          >
            Koyeb
          </Link>{' '}
          are already using Neon to offer Postgres to their end-users. To get an estimate for your
          platform, <Link to={LINKS.contactSales}>reach out to us</Link>.
        </p>
      </div>

      <Example />
    </Container>
  </section>
);

export default Hero;
