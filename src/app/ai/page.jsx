import Bento from 'components/pages/ai/bento';
import Hero from 'components/pages/ai/hero';
import PgVector from 'components/pages/ai/pgvector';
import StarterKit from 'components/pages/ai/starter-kit';
import Usage from 'components/pages/ai/usage';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';
import TestimonialNew from 'components/shared/testimonial-new';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import createIcon from 'icons/companies/create.svg';
import replitIcon from 'icons/companies/replit.svg';
import authorDhruvAmin from 'images/authors/dhruv-amin.jpg';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.ai);

const AiPage = () => (
  <Layout>
    <Hero />
    <Bento />
    <TestimonialNew
      className="mt-[200px] xl:mt-[176px] lg:mt-[152px] md:mt-[104px]"
      quoteClassName="text-pretty"
      quote="The combination of flexible resource limits and nearly instant database provisioning made Neon a no&#8209;brainer."
      author={{
        name: 'Dhruv Amin',
        position: 'Co-founder at Create.xyz',
        avatar: authorDhruvAmin,
      }}
      company={{
        src: replitIcon,
        width: 152,
      }}
    />
    <Usage />
    <PgVector />
    <TestimonialNew
      className="mt-[200px] xl:mt-[176px] lg:mt-[152px] md:mt-[104px]"
      quote="Neon’s speed of provisioning and serverless scale-to-zero is critical for us. We can serve users iterating on quick ideas efficiently while also supporting them as they scale, without making them think about database setup."
      author={{
        name: 'Dhruv Amin',
        position: 'Co-founder at Create.xyz',
        avatar: authorDhruvAmin,
      }}
      company={{
        src: createIcon,
        width: 135,
      }}
    />
    <StarterKit />
    <CTA
      className="pb-[290px] pt-[348px] xl:pb-[242px] xl:pt-[278px] lg:pb-[200px] lg:pt-[260px] sm:pb-[100px] sm:pt-40"
      title="The Postgres of tomorrow, available today"
      titleClassName="max-w-[745px] lg:max-w-[600px] md:max-w-[400px] md:leading-none"
      buttonText="Book a meeting with our team"
      buttonUrl={LINKS.contactSales}
    />
  </Layout>
);

export default AiPage;
