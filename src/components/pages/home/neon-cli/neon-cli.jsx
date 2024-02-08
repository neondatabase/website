import parse from 'html-react-parser';

import CodeBlockWrapper from 'components/shared/code-block-wrapper';
import Container from 'components/shared/container/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import { getHighlightedCodeArray } from 'lib/shiki';

import CodeTabs from './code-tabs';

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

const NeonCli = async () => {
  const highlightedCodeSnippets = await getHighlightedCodeArray(items);
  return (
    <section className="neon-cli safe-paddings bg-black pt-44 text-white 2xl:pt-32 xl:pt-28 lg:pt-20 md:pt-16">
      <Container
        className="grid grid-cols-12 items-center gap-x-10 xl:grid-cols-1 xl:gap-y-10"
        size="medium"
      >
        <div className="col-start-8 col-end-13 -ml-10 xl:col-start-1 xl:col-end-2 xl:ml-0">
          <Heading
            className="text-[56px] font-bold leading-dense 2xl:text-[48px] xl:max-w-[790px] lg:text-4xl sm:text-[36px]"
            id="saas-title"
            tag="h2"
            theme="white"
          >
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
            <span className="sr-only">about Neon CLI</span>
          </Link>
        </div>
        <CodeTabs items={items} highlightedCodeSnippets={highlightedCodeSnippets} />

        <ul className="hidden gap-y-6 xl:flex xl:flex-col">
          {items.map(({ name }, index) => (
            <li key={index}>
              <div className="relative rounded-t-md border-[5px] border-b-0 border-[#333] px-4 py-3 font-mono text-sm font-bold uppercase leading-none md:text-xs sm:border-[3px] sm:border-b-0">
                {name}
              </div>
              <CodeBlockWrapper className="dark prose max-w-none rounded-b-md rounded-tr-md border-[5px] border-[#333] 2xl:rounded-tr-none sm:border-[3px] [&_code]:!text-[15px] [&_pre]:my-0 [&_pre]:!bg-black [&_pre]:px-0 [&_pre]:pb-5 [&_pre]:pt-7">
                {parse(highlightedCodeSnippets[index])}
              </CodeBlockWrapper>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};

export default NeonCli;
