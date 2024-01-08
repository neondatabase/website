'use client';

import clsx from 'clsx';
import { useState } from 'react';

import CodeBlock from 'components/shared/code-block';
import Container from 'components/shared/container/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

const items = [
  {
    name: 'Create projects in a second',
    code: `neonctl projects create --name mynewproject --region-id aws-us-west-2
┌───────────────────┬──────────────┬───────────────┬──────────────────────┐
│ Id                │ Name         │ Region Id     │ Created At           │
├───────────────────┼──────────────┼───────────────┼──────────────────────┤
│ muddy-wood-859533 │ mynewproject │ aws-us-west-2 │ 2023-07-09T17:04:29Z │
└───────────────────┴──────────────┴───────────────┴──────────────────────┘`,
  },
  {
    name: 'Get connection strings',
    code: `neonctl connection-string mybranch
postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname`,
  },
  {
    name: 'Manage branches',
    code: `neonctl branches list --project-id solitary-leaf-288182
┌────────────────────────┬──────────┬──────────────────────┬──────────────────────┐
│ Id                     │ Name     │ Created At           │ Updated At           │
├────────────────────────┼──────────┼──────────────────────┼──────────────────────┤
│ br-small-meadow-878874 │ main     │ 2023-07-06T13:15:12Z │ 2023-07-06T14:26:32Z │
├────────────────────────┼──────────┼──────────────────────┼──────────────────────┤
│ br-round-queen-335380  │ mybranch │ 2023-07-06T14:45:50Z │ 2023-07-06T14:45:50Z │
└────────────────────────┴──────────┴──────────────────────┴──────────────────────┘`,
  },
];

const NeonCli = () => {
  const [activeItem, setActiveItem] = useState(items[0]);
  return (
    <section className="neon-cli safe-paddings bg-black pt-40 text-white 3xl:pt-36 2xl:pt-32 xl:pt-28 lg:pt-20 md:pt-16">
      <Container className="grid grid-cols-12 gap-x-10 lg:grid-cols-1 lg:gap-y-10" size="md">
        <div className="col-start-8 col-end-13 -ml-10 lg:col-start-1 lg:col-end-2 lg:ml-0">
          <Heading id="saas-title" tag="h2" size="xl" theme="white">
            Postgres at your fingertips with the Neon CLI
          </Heading>
          <p className="t-2xl mt-8 max-w-[600px] text-white 2xl:max-w-[488px] xl:max-w-[400px] lg:mt-4 lg:max-w-none">
            Use the CLI to manage Neon directly from the terminal.
          </p>
          <Link
            className="mt-[18px] inline-flex text-2xl font-medium lg:text-xl md:text-lg"
            to={LINKS.cliReference}
            theme="underline-primary-1"
          >
            Learn more
          </Link>
        </div>
        <div className="col-span-6 col-start-1 row-start-1 max-w-[716px] pt-[71px] 2xl:pt-12 xl:-mr-6 xl:pt-9 lg:hidden">
          <div className="flex gap-x-2.5 xs:gap-x-1.5">
            {items.map(({ name }, index) => (
              <button
                className={clsx(
                  'relative rounded-t-md border-[5px] border-b-0 border-[#333] px-[15px] py-3 font-mono text-sm font-bold uppercase leading-none transition-colors duration-200 after:transition-colors after:duration-200',
                  activeItem.name === name
                    ? 'text-green-45 after:absolute after:inset-x-0 after:bottom-[-6px] after:z-10 after:h-[6px] after:bg-black'
                    : 'bg-[#333] text-white hover:text-green-45'
                )}
                type="button"
                key={index}
                onClick={() => setActiveItem(items[index])}
              >
                {name}
              </button>
            ))}
          </div>
          <CodeBlock
            className="prose-blog dark prose rounded-b-md rounded-tr-md border-[5px] border-[#333] 2xl:rounded-tr-none sm:border-[3px] [&_pre]:my-0 [&_pre]:!bg-black [&_pre]:pb-5 [&_pre]:pt-7"
            isTrimmed={false}
          >
            {activeItem.code}
          </CodeBlock>
        </div>
        <ul className="hidden gap-y-6 lg:flex lg:flex-col">
          {items.map(({ name, code }, index) => (
            <li key={index}>
              <div className="relative rounded-t-md border-[5px] border-b-0 border-[#333] px-4 py-3 font-mono text-sm font-bold uppercase leading-none md:text-xs sm:border-[3px] sm:border-b-0">
                {name}
              </div>
              <CodeBlock
                className="prose-blog dark prose rounded-b-md rounded-tr-md border-[5px] border-[#333] 2xl:rounded-tr-none sm:border-[3px] [&_pre]:my-0 [&_pre]:!bg-black [&_pre]:pb-5 [&_pre]:pt-7"
                isTrimmed={false}
              >
                {code}
              </CodeBlock>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};

export default NeonCli;
