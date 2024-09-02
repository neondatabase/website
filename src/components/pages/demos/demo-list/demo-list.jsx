import clsx from 'clsx';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import ChevronIcon from 'icons/chevron.inline.svg';

const items = [
  {
    category: 'DB-per-user',
    categoryTextColor: 'text-pink-90',
    items: [
      {
        title: 'AI app architecture: vector database per tenant',
        description:
          "An AI app where each user gets it's own database instance. Uses Neon + pgvector.",
        demoLink: 'https://ai-vector-db-per-tenant.pages.dev/',
        sourceLink: 'https://github.com/neondatabase/ai-vector-db-per-tenant',
      },
    ],
  },
  {
    category: 'Branching',
    categoryTextColor: 'text-blue-80',
    items: [
      {
        title: 'Neon Twitter',
        description:
          "A microblogging application designed to demonstrate the database branching capability of Neon Serverless Postgres with Neon's GitHub Actions.",
        demoLink: 'https://neon-twitter.vercel.app/',
        sourceLink: 'https://github.com/neondatabase/neon_twitter',
      },
      {
        title: 'Preview Branches',
        description:
          'An example project showing how you can create a branch for every preview deployment on Vercel. If you want to use this project as a playground, you can set it up locally.',
        demoLink: '#',
        sourceLink: 'https://github.com/neondatabase/preview-branches-with-vercel',
      },
      {
        title: 'Neon Discord bot',
        description: `Learn how to build a Discord bot while leveraging Neon branching. Be sure to read the <a href="https://github.com/tinkertim/neon_branching_demo" target="_blank" rel="noopener noreferrer">companion branching tutorial</a> before jumping in.`,
        demoLink: '#',
        sourceLink: 'https://github.com/tinkertim/neon_branching_demo',
      },
      {
        title: 'Full-stack preview environments using Neon and Qovery',
        description:
          'This example shows how to execute a bash script and pass environment variables to other services within the same environment with Qovery Lifecycle Job.',
        demoLink: '#',
        sourceLink: 'https://github.com/neondatabase/qovery-lifecycle-job',
      },
      {
        title: 'Preview branches with Fly.io, Neon, and Github Actions',
        description:
          'An example repo showing how to create one database branch per PR to automate your dev workflows, using Fly.io, Github Actions, and Drizzle for migrations.',
        demoLink: '#',
        sourceLink: 'https://github.com/neondatabase/preview-branches-with-fly?tab=readme-ov-file',
      },
    ],
  },
  {
    category: 'Data Recovery with branching',
    categoryTextColor: 'text-brown-70',
    items: [
      {
        title: 'Time travel bisect script demo',
        description:
          'This demo shows how to create branches in the past and use a binary search to find the exact point in time before data was lost.',
        demoLink: '#',
        sourceLink: 'https://github.com/kelvich/branching_demo_bisect',
      },
    ],
  },
  {
    category: 'Read replicas example',
    categoryTextColor: 'text-pink-90',
    items: [
      {
        title: 'Read replicas example',
        description:
          'This example shows how to use Neon read replicas with the @prisma/extension-read-replicas extension in Prisma Client to read and write data in a PostgreSQL database.',
        demoLink: '#',
        sourceLink: 'https://github.com/prisma/read-replicas-demo',
      },
    ],
  },
  {
    category: 'Languages and Frameworks',
    categoryTextColor: 'text-blue-80',
    items: [
      {
        title: 'Neon Ecto Getting Started',
        description: 'This repository shows how to connect to Neon from Elixir.',
        demoLink: '#',
        sourceLink: 'https://github.com/neondatabase/neon-ecto-getting-started-app',
      },
      {
        title: 'Neon Edge Analytics Astro Sample',
        description: 'A sample repository showing how to use Edge Analytics with Astro.',
        demoLink: '#',
        sourceLink: 'https://github.com/neondatabase/neon-edge-analytics-astro-sample',
      },
      {
        title: 'Neon with Next.js and Prisma',
        description:
          'Example code using Next.js as the full stack framework, Prisma as the ORM, and Neon as the Postgres database.',
        demoLink: '#',
        sourceLink: 'https://github.com/neondatabase/examples/tree/main/with-nextjs-prisma',
      },
    ],
  },
  {
    category: 'Serverless driver',
    categoryTextColor: 'text-brown-70',
    items: [
      {
        title: 'Ping Thing',
        description:
          'Ping a Neon Serverless Postgres database using a Vercel Edge Function to see the journey your request makes.',
        demoLink: '/demos/ping-thing',
        sourceLink: 'https://github.com/neondatabase/ping-thing',
      },
      {
        title: 'Neon serverless driver UNESCO World Heritage Sites App',
        description:
          "This application demonstrates how to use raw SQL with Neon's serverless driver on Vercel Edge Functions.",
        demoLink: '#',
        sourceLink: 'https://github.com/neondatabase/neon-vercel-rawsql',
      },
    ],
  },
  {
    category: 'OAuth',
    categoryTextColor: 'text-pink-90',
    items: [
      {
        title: 'Neon branch visualizer',
        description:
          'This project enables you to visualize Neon branches and how they are connected to each other, showcasing how to build an OAuth integration with Neon.',
        demoLink: '#',
        sourceLink: 'https://github.com/neondatabase/neon-branches-visualizer',
      },
    ],
  },
  {
    category: 'AI',
    categoryTextColor: 'text-blue-80',
    items: [
      {
        title: 'Vercel Postgres pgvector starter',
        description:
          "A Next.js template that uses Vercel Postgres as the database, pgvector for vector similarity search + OpenAI's text embedding models.",
        sourceLink: 'https://vercel.com/templates/next.js/postgres-pgvector',
        demoLink: 'https://postgres-pgvector.vercel.app/',
      },
      {
        title: 'Vector similarity search using Neon Postgres',
        description:
          'This OpenAI Cookbook guides you through using Neon Serverless Postgres as a vector database for OpenAI embeddings.',
        demoLink: '#',
        sourceLink:
          'https://cookbook.openai.com/examples/vector_databases/neon/neon-postgres-vector-search-pgvector',
      },
      {
        title: 'Google Colab: Chat with your database with Langchain',
        description:
          'This notebook shows how to use LangChain and OpenAI to chat with your database.',
        demoLink: '#',
        sourceLink:
          'https://colab.research.google.com/github/neondatabase/neon-google-colab-notebooks/blob/main/chat_with_your_database_using_langchain.ipynb',
      },
      {
        title: 'Semantic Search Chatbot (OpenAI + LangChain)',
        description:
          'A starter application for an AI-powered Semantic Search chatbot with Next.js, pgvector, OpenAI, and LangChain.',
        demoLink: '#',
        sourceLink:
          'https://github.com/neondatabase/examples/tree/main/ai/langchain/semantic-search-nextjs',
      },
      {
        title: 'AI Chatbot (OpenAI + LangChain)',
        description:
          'A starter application for an AI-powered chatbot with Next.js, pgvector, OpenAI, and LangChain',
        demoLink: '#',
        sourceLink:
          'https://github.com/neondatabase/examples/tree/main/ai/langchain/chatbot-nextjs',
      },
    ],
  },
];

const DemoList = () => (
  <section className="demo-list safe-paddings my-20 lg:my-16 md:my-10">
    <Container className="grid-gap-x grid grid-cols-12 lg:grid-cols-1" size="medium">
      <ul className="col-span-10 col-start-2 flex flex-col gap-y-20 lg:col-span-full lg:col-start-1 lg:gap-y-16 md:gap-y-10">
        {items.map(({ category, categoryTextColor, items }, index) => (
          <li
            className="mx-auto w-full max-w-[1048px] rounded-[10px] bg-black-new p-10 lg:p-8 md:px-6"
            key={index}
          >
            <h2
              className={clsx(
                'flex items-center text-xs font-semibold uppercase leading-none tracking-extra-tight',
                categoryTextColor
              )}
            >
              <span>{category}</span>
              <span className="ml-2 h-px grow bg-gray-new-15" />
            </h2>
            <ul className="mt-7">
              {items.map(({ title, description, sourceLink, demoLink }, index) => (
                <li
                  className="mt-6 flex items-center justify-between border-t border-gray-new-15 border-opacity-80 pt-6 first:mt-0 first:border-t-0 first:pt-0 lg:flex-col lg:items-start lg:gap-y-8 md:mt-4 md:gap-y-6 md:pt-4"
                  key={index}
                >
                  <div className="max-w-[591px] xl:max-w-[500px] lg:max-w-full">
                    <h3 className="max-w-[510px] text-2xl font-medium leading-tight -tracking-[0.05em] lg:text-xl">
                      {title}
                    </h3>
                    <p
                      className="tracking-snug with-link-primary mt-3 font-light leading-snug text-gray-new-60"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                  <div className="flex items-center justify-start gap-x-4 text-[15px] leading-none">
                    {demoLink !== '#' && (
                      <Link
                        className="flex items-center rounded-full bg-gray-new-15 bg-opacity-80 px-5 py-3 text-[15px] font-medium leading-none transition-colors duration-200 hover:bg-gray-new-20"
                        to={demoLink}
                        target={demoLink.startsWith('http') ? '_blank' : '_self'}
                        rel={demoLink.startsWith('http') ? 'noopener noreferrer' : ''}
                      >
                        <ChevronIcon className="mr-2" />
                        Live demo
                      </Link>
                    )}
                    {sourceLink !== '#' && (
                      <Link
                        className="text-[15px] leading-none"
                        to={sourceLink}
                        target="_blank"
                        theme="gray-80"
                        rel="noopener noreferrer"
                      >
                        Source
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default DemoList;
