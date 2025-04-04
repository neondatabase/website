import Image from 'next/image';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import autoscaling from 'icons/ai/autoscaling.svg';
import cycle from 'icons/ai/cycle.svg';
import perfomance from 'icons/ai/perfomance.svg';
import pgvector from 'icons/ai/pgvector.svg';
import robot from 'icons/ai/robot.svg';
import search from 'icons/ai/search.svg';

const ITEMS = [
  {
    title: 'Postgres with pgvector',
    description:
      'Store and retrieve vector embeddings efficiently with Neon&nbsp;Postgres and pgvector.',
    icon: pgvector,
  },
  {
    title: 'AI Starter Apps',
    description: 'Access pre-built AI apps like AI chatbot, semantic search, and hybrid search.',
    icon: robot,
  },
  {
    title: 'Vector Search Optimization',
    description:
      'Enhance the performance of your AI by using Neon’s vector search optimization guide.',
    icon: search,
  },
  {
    title: 'Autoscaling & Scaling Guide',
    description: 'Scale your AI apps seamlessly with&nbsp;Neon’s Autoscaling and Read Replicas.',
    icon: autoscaling,
  },
  {
    title: 'Built with Neon',
    description:
      'Explore AI apps developed using Neon to gain valuable inspiration and learn from best practices.',
    icon: cycle,
  },
  {
    title: 'Performance & Storage',
    description:
      'Optimize and manage your AI workloads with Neon’s storage and&nbsp;autoscaling solutions.',
    icon: perfomance,
  },
];

const StarterKit = () => (
  <section className="starter-kit safe-paddings mt-section">
    <Container className="max-w-[640px]">
      <h2 className="font-title text-5xl font-medium leading-none tracking-extra-tight xl:text-[44px] lg:text-4xl md:text-[32px]">
        Neon's AI Starter Kit
      </h2>
      <p className="mt-3 max-w-lg text-lg leading-snug tracking-extra-tight text-gray-new-70">
        Neon's AI Starter Kit offers resources, apps, and examples to kickstart Neon as your vector
        database.
      </p>
      <Link
        className="mt-6 text-lg leading-none tracking-[-0.03em]"
        to={LINKS.docsAi}
        theme="white"
        withArrow
      >
        Learn more
      </Link>
      <ul className="mt-14 grid grid-cols-2 gap-x-[72px] gap-y-10">
        {ITEMS.map(({ title, description, icon }) => (
          <li key={title}>
            <Image
              className="relative mb-[18px]"
              src={icon}
              alt=""
              width={22}
              height={22}
              quality={100}
            />
            <h3 className="text-xl font-semibold leading-dense tracking-tighter">{title}</h3>
            <p
              className="mt-2 text-lg tracking-extra-tight text-gray-new-70"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default StarterKit;
