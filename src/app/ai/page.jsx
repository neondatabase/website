import Bento from 'components/pages/ai/bento';
import Hero from 'components/pages/ai/hero';
import Usage from 'components/pages/ai/usage';
import CTA from 'components/shared/cta';
import FeaturesCards from 'components/shared/features-cards';
import GridFeatures from 'components/shared/grid-features';
import Layout from 'components/shared/layout';
import TestimonialNew from 'components/shared/testimonial-new';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import aiApps from 'icons/ai/features-grid/ai-apps.svg';
import auth from 'icons/ai/features-grid/auth.svg';
import autoscaling from 'icons/ai/features-grid/autoscaling.svg';
import branches from 'icons/ai/features-grid/branches.svg';
import builtWithNeon from 'icons/ai/features-grid/built-with-neon.svg';
import jsConsole from 'icons/ai/features-grid/js-console.svg';
import lightning from 'icons/ai/features-grid/lightning.svg';
import performanceStorage from 'icons/ai/features-grid/performance-storage.svg';
import pgvector from 'icons/ai/features-grid/pgvector.svg';
import programmable from 'icons/ai/features-grid/programmable.svg';
import scale from 'icons/ai/features-grid/scale.svg';
import vectorSearchOptimization from 'icons/ai/features-grid/vector-seo.svg';
import createIcon from 'icons/companies/create.svg';
import replitIcon from 'icons/companies/replit.svg';
import authorDhruvAmin from 'images/authors/dhruv-amin.jpg';
import authorMarcoDalia from 'images/authors/marco-dalia.jpg';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.ai);

const PG_AGENT_FEATURES_ITEMS = [
  {
    title: 'One-second database provisioning',
    description:
      'Agents move fast, and so does Neon. Provision fresh databases in seconds for a smooth developer experience.',
    icon: lightning,
  },
  {
    title: 'Scale to zero and pay-as-you-go',
    description:
      'Neon only charges for true usage, so you can run fleets of short-lived databases without blowing your budget.',
    icon: scale,
  },
  {
    title: 'Simple, programmable API',
    description:
      'Create, delete, scale, and monitor databases with a feature-complete API designed to manage thousands of Postgres instances.',
    icon: programmable,
  },
  {
    title: 'Embed directly, no signup required',
    description:
      'Agents can create and manage databases without a user ever logging into Neon. No UI, no OAuth, no friction.',
    icon: jsConsole,
  },
  {
    title: 'Time travel for your apps',
    description:
      'Branches let you snapshot the full database state instantly. Let users roll back to a previous version in one click.',
    icon: branches,
  },
  {
    title: 'Built-in auth',
    description:
      'With Neon Auth, agents can build apps with secure authentication baked in - no extra setup, just more power to vibe coders.',
    icon: auth,
  },
];

const STARTER_KIT_FEATURES_ITEMS = [
  {
    title: 'Postgres with pgvector',
    description:
      'Store and retrieve vector embeddings efficiently with Neon Postgres and pgvector.',
    icon: pgvector,
  },
  {
    title: 'AI Starter Apps',
    description: 'Access pre-built AI apps like AI chatbot, semantic search, and hybrid search.',
    icon: aiApps,
  },
  {
    title: 'Vector Search Optimization',
    description:
      'Enhance the performance of your AI by using Neon’s vector search optimization guide.',
    icon: vectorSearchOptimization,
  },
  {
    title: 'Autoscaling & Scaling Guide',
    description: 'Scale your AI apps seamlessly with Neon’s Autoscaling and Read Replicas.',
    icon: autoscaling,
  },
  {
    title: 'Built with Neon',
    description:
      'Explore AI apps using Neon to gain valuable inspiration and learn best practices.',
    icon: builtWithNeon,
  },
  {
    title: 'Performance & Storage',
    description:
      'Optimize and manage your AI workloads with Neon’s storage and autoscaling solutions.',
    icon: performanceStorage,
  },
];

const AiPage = () => (
  <Layout>
    <Hero />
    <Bento />
    <TestimonialNew
      className="mt-[200px] xl:mt-[192px] lg:mt-[158px] md:mt-[104px]"
      figureClassName="lg:max-w-[704px]"
      quoteClassName="text-pretty md:text-wrap"
      quote="The combination of flexible resource limits and nearly instant database provisioning made Neon a no&#8209;brainer."
      author={{
        name: 'Lincoln Bergeson',
        position: 'Infrastructure Engineer at Replit',
      }}
      company={{
        src: replitIcon,
        width: 152,
      }}
    />
    <GridFeatures
      className="mt-[199px] xl:mt-[191px] lg:mt-[153px] md:mt-[107px]"
      title="Add Postgres to your agent"
      titleClassName="md:text-pretty"
      description="Neon is purpose-built to support AI agents at the infrastructure level, with native, API-first Postgres that doesn’t require end-user signups or manual provisioning."
      items={PG_AGENT_FEATURES_ITEMS}
      link={LINKS.useCasesAI}
      linkText="Read more"
      logos={['create', 'replit', 'same', 'solar', 'databutton']}
    />
    <TestimonialNew
      className="mt-[200px] xl:mt-[192px] lg:mt-[158px] md:mt-[104px]"
      figureClassName="lg:max-w-[704px]"
      quoteClassName="text-pretty lg:text-wrap"
      quote="Neon’s speed of provisioning and serverless scale-to-zero is critical for us. We can serve users iterating on quick ideas efficiently while also supporting them as they scale, without making them think about database setup."
      author={{
        name: 'Dhruv Amin',
        position: 'Co-founder at Create.xyz',
        avatar: authorDhruvAmin,
      }}
      company={{
        src: createIcon,
        width: 136,
      }}
    />
    <FeaturesCards />
    <Usage />
    <TestimonialNew
      className="mt-[200px] xl:mt-[192px] lg:mt-[160px] md:mt-[107px]"
      figureClassName="lg:max-w-[704px]"
      quote="I did testing on vector databases, but I didn’t see a real advantage. Postgres with Pgvector covers everything I need."
      quoteClassName="text-balance lg:text-pretty"
      author={{
        name: 'Marco D’Alia',
        position: 'Software Architect behind RagRabbit',
        avatar: authorMarcoDalia,
      }}
    />
    <GridFeatures
      className="mt-[200px] xl:mt-[194px] lg:mt-[160px] md:mt-[104px]"
      title="Neon's AI Starter Kit"
      titleClassName="md:text-pretty"
      description="Neon's AI Starter Kit offers resources, apps, and examples to kickstart Neon as your vector database."
      descriptionClassName="max-w-[490px]"
      items={STARTER_KIT_FEATURES_ITEMS}
      link={LINKS.docsAi}
      linkText="Learn more"
    />
    <CTA
      className="pb-[290px] pt-[348px] xl:pb-[242px] xl:pt-[278px] lg:pb-[200px] lg:pt-[260px] sm:pb-[100px] sm:pt-40"
      title="The Postgres of tomorrow, available today"
      titleClassName="max-w-[745px] lg:max-w-[600px] md:max-w-[400px] md:leading-none"
      buttonText="Sign up"
      buttonUrl={LINKS.signup}
    />
  </Layout>
);

export default AiPage;
