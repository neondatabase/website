import Container from 'components/shared/container';
import LINKS from 'constants/links';

import Example from '../example';

const Hero = () => (
  <section className="hero safe-paddings relative overflow-hidden pt-[88px] xl:pt-14 lg:pt-11 md:pt-8">
    <Container size="xxs">
      <div className="px-8 sm:px-0">
        <h1 className="text-[56px] font-semibold leading-dense tracking-tighter xl:text-5xl lg:text-4xl md:text-[28px] md:leading-tight">
          Neon for platforms
        </h1>
        <p className="mt-4 text-2xl leading-snug tracking-extra-tight text-gray-new-80 xl:text-xl md:mt-3 md:text-lg">
          Use Neon to build your free tier for a fraction of the cost.
        </p>
      </div>

      <Example />

      <div className="prose-variable px-8 sm:px-0">
        <p>
          Thanks to scaling and usage-based pricing,{' '}
          <strong>Neon is a cost-effective option for managing fleets of Postgres instances</strong>
          . Its developer-friendly API makes it possible to scale the fleet up to hundreds of
          thousands without a DBA.{' '}
        </p>
        <p>
          Companies like{' '}
          <a href="https://retool.com/" target="_blank" rel="noopener noreferrer">
            Retool
          </a>
          ,{' '}
          <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer">
            Vercel
          </a>
          ,{' '}
          <a href="https://replit.com/" target="_blank" rel="noopener noreferrer">
            Replit
          </a>
          , and{' '}
          <a href="https://www.koyeb.com/" target="_blank" rel="noopener noreferrer">
            Koyeb
          </a>{' '}
          are already using Neon to offer Postgres to their end-users. Discover more on our{' '}
          <a href={LINKS.caseStudies} target="_blank" rel="noopener noreferrer">
            case studies page
          </a>
          .
        </p>
      </div>
    </Container>
  </section>
);

export default Hero;
