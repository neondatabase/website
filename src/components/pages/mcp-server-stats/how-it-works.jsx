import Container from 'components/shared/container';

const STEPS = [
  {
    title: 'The server records each call',
    description:
      'The Neon MCP server records an event for every tool call, with the Neon account, the tool, and the name the client reports.',
  },
  {
    title: 'A daily job computes shares',
    description:
      'Every morning, a job in our Databricks lakehouse counts the accounts that called tools each week and turns them into percentages. Clients with fewer than 25 weekly users, or outside a fixed list, are counted in Other.',
  },
  {
    title: 'The shares live in Neon',
    description:
      'The job writes only the percentages to a Neon Postgres database, and this page reads them with a role that can only select those tables.',
  },
];

const HowItWorks = () => (
  <section
    className="mt-40 safe-paddings xl:mt-32 lg:mt-24 md:mt-16"
    aria-labelledby="mcp-stats-how-heading"
  >
    <Container size="1280">
      <h2
        className="max-w-206 text-[2.75rem] leading-dense font-normal tracking-tighter text-gray-new-50 xl:text-4xl lg:max-w-3xl lg:text-3xl md:text-[1.75rem]"
        id="mcp-stats-how-heading"
      >
        <span className="text-white">How this page works.</span> Counts stay in the lakehouse, and
        the website only sees percentages.
      </h2>
      <ol className="mt-24 grid grid-cols-3 gap-x-21 xl:mt-20 xl:gap-x-10 lg:mt-16 lg:gap-x-6 md:mt-10 md:grid-cols-1 md:gap-y-8">
        {STEPS.map(({ title, description }, index) => (
          <li
            className="relative min-w-0 border-l border-gray-new-20 pl-6 lg:pl-5 md:border-none md:pl-0"
            key={title}
          >
            <span className="font-mono text-lg leading-normal tracking-extra-tight text-white lg:text-base">
              0{index + 1}
            </span>
            <div className="mt-24 xl:mt-20 lg:mt-16 md:mt-5">
              <h3 className="text-[1.75rem] leading-tight font-normal tracking-extra-tight text-pretty text-white xl:text-2xl lg:text-xl md:text-2xl">
                {title}
              </h3>
              <p className="mt-3 text-lg leading-normal tracking-extra-tight text-pretty text-gray-new-70 lg:text-base">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Container>
  </section>
);

export default HowItWorks;
