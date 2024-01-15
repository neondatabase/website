import clsx from 'clsx';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import ChevronIcon from 'icons/chevron.inline.svg';

const items = [
  {
    category: 'Branching',
    categoryTextColor: 'text-pink-90',
    items: [
      {
        title: 'Neon Twitter Application',
        description:
          "Microblogging application designed to demonstrate the database branching capability of Neon Serverless Postgres with Neon's GitHub Actions.",
        demoLink: 'https://neon-twitter.vercel.app/',
        sourceLink: 'https://github.com/neondatabase/neon_twitter',
      },
      {
        title: 'Preview Branches',
        description:
          'This is an example project that shows how you can create a branch for every preview deployment on Vercel. If you want to use this project as a playground, you can you can set it up locally.',
        demoLink: '#',
        sourceLink: 'https://github.com/neondatabase/preview-branches-with-vercel',
      },
      {
        title: 'Neon Discord bot',
        description:
          "This is the companion repository for the Neon's Branching Tutorial, which you should definitely read before diving in here.",
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
    ],
  },
  {
    category: 'Data Recovery with branching',
    categoryTextColor: 'text-blue-80',
    items: [
      {
        title: 'Time Travel bisect script demo',
        description:
          'Method of creating branches in the past and using lsn binary search to efficiently determine when to remove specific data from the table. ',
        demoLink: '#',
        sourceLink: 'https://github.com/kelvich/branching_demo_bisect',
      },
    ],
  },
  {
    category: 'Read replicas',
    categoryTextColor: 'text-brown-70',
    items: [
      {
        title: 'Replicas example',
        description:
          'This example shows how to use database replication using the @prisma/extension-read-replicas extension in Prisma Client in a simple TypeScript script to read and write data in a PostgreSQL database.',
        demoLink: '#',
        sourceLink: 'https://github.com/prisma/read-replicas-demo',
      },
    ],
  },
  {
    category: 'Languages and Frameworks',
    categoryTextColor: 'text-pink-90',
    items: [
      {
        title: 'Neon Ecto Getting Started',
        description:
          'This repository contains the application setup described in Connect from Elixir with Ecto to Neon.',
        demoLink: '#',
        sourceLink: 'https://github.com/neondatabase/neon-ecto-getting-started-app',
      },
      {
        title: 'Neon Edge Analytics Astro Sample',
        description: 'A sample repo for using Edge Analytics with Astro.',
        demoLink: '#',
        sourceLink: 'https://github.com/PaulieScanlon/neon-edge-analytics-astro-sample',
      },
    ],
  },
  {
    category: 'Serverless driver',
    categoryTextColor: 'text-blue-80',
    items: [
      {
        title: 'Neon serverless driver UNESCO World Heritage Sites App',
        description:
          "This repo demonstrates using raw SQL with Neon's serverless driver on Vercel Edge Functions",
        demoLink: '#',
        sourceLink: 'https://github.com/neondatabase/neon-vercel-rawsql',
      },
    ],
  },
  {
    category: 'OAuth',
    categoryTextColor: 'text-brown-70',
    items: [
      {
        title: 'Neon branch visualizer',
        description:
          'This project enables you to visualize your Neon branches and how they are connected to each other.',
        demoLink: '#',
        sourceLink: 'https://github.com/neondatabase/neon-branches-visualizer',
      },
    ],
  },
  {
    category: 'AI',
    categoryTextColor: 'text-pink-90',
    items: [
      {
        title: 'Vercel Postgres pgvector starter',
        description:
          "A Next.js template that uses Vercel Postgres as the database, pgvector for vector similarity search + OpenAI's text embedding models.",
        sourceLink: 'https://vercel.com/templates/next.js/postgres-pgvector',
        demoLink: 'https://postgres-pgvector.vercel.app/',
      },
      {
        title: 'Web-based AI SQL Playground',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        demoLink: '#',
        sourceLink: 'https://github.com/neondatabase/postgres-ai-playground',
      },
      {
        title: 'Jupyter Notebook for Vector search with Neon',
        description:
          'Neon supports vector search using the pgvector open-source PostgreSQL extensions, which enables Postgres as a vector database for storing and querying embeddings. ',
        demoLink: '#',
        sourceLink: 'https://github.com/neondatabase/neon-vector-search-openai-notebooks',
      },
      {
        title: 'Vector similarity search using Neon Postgres',
        description:
          'This notebook guides you through using Neon Serverless Postgres as a vector database for OpenAI embeddings.',
        demoLink: '#',
        sourceLink:
          'https://cookbook.openai.com/examples/vector_databases/neon/neon-postgres-vector-search-pgvector',
      },
      {
        title: 'Google Colab: Chat with your database with Langchain',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        demoLink: '#',
        sourceLink:
          'https://colab.research.google.com/github/neondatabase/neon-google-colab-notebooks/blob/main/chat_with_your_database_using_langchain.ipynb',
      },
      {
        title: 'Google Colab with pgvecfor and Neon',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        demoLink: '#',
        sourceLink:
          'https://colab.research.google.com/github/neondatabase/neon-google-colab-notebooks/blob/main/neon_pgvector_quickstart.ipynb',
      },
    ],
  },
];

const DemoList = () => (
  <section className="demo-list safe-paddings my-20 lg:my-16 md:my-10">
    <Container className="grid-gap-x grid grid-cols-12 lg:grid-cols-1" size="medium">
      <ul className="col-span-10 col-start-2 flex flex-col gap-y-20 lg:col-span-full lg:col-start-1 lg:gap-y-16 md:gap-y-10">
        {items.map(({ category, categoryTextColor, items }, index) => (
          <div
            className="mx-auto w-full max-w-[1048px] rounded-[10px] bg-gray-new-8 p-10 lg:p-8 md:px-6"
            key={index}
          >
            <h2
              className={clsx(
                'flex items-center text-xs font-semibold uppercase leading-none tracking-[0.02em]',
                categoryTextColor
              )}
            >
              <span>{category}</span>
              <span className="ml-2 h-px grow bg-gray-new-20" />
            </h2>
            <ul className="mt-7">
              {items.map(({ title, description, sourceLink, demoLink }, index) => (
                <li
                  className="mt-6 flex items-center justify-between border-t border-gray-new-15 pt-6 first:mt-0 first:border-t-0 first:pt-0 lg:flex-col lg:items-start lg:gap-y-8 md:mt-4 md:gap-y-6 md:pt-4"
                  key={index}
                >
                  <div className="max-w-[591px] xl:max-w-[500px] lg:max-w-full">
                    <h3 className="max-w-[510px] text-2xl font-medium leading-tight tracking-extra-tight lg:text-xl">
                      {title}
                    </h3>
                    <p className="mt-3 leading-tight tracking-extra-tight text-gray-new-70">
                      {description}
                    </p>
                  </div>
                  <div className="flex items-center justify-start gap-x-4 text-[15px] leading-none">
                    {demoLink !== '#' && (
                      <Link
                        className="flex items-center rounded-full bg-gray-new-15 px-4 py-2"
                        to={demoLink}
                        target={demoLink.startsWith('http') ? '_blank' : '_self'}
                        rel={demoLink.startsWith('http') ? 'noopener noreferrer' : ''}
                      >
                        <ChevronIcon className="mr-2" />
                        Live Demo
                      </Link>
                    )}
                    {sourceLink !== '#' && (
                      <Link
                        className="text-gray-new-70"
                        to={sourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Source
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </ul>
    </Container>
  </section>
);

export default DemoList;
