import Container from 'components/shared/container';

const FEATURES = [
  {
    title: 'Scoped from the first request',
    description:
      'The service creates one project and issues credentials scoped to it, keeping access isolated from the first request.',
  },
  {
    title: 'Ownership starts at claim',
    description:
      'A short-lived claim link transfers the project into the Neon organization selected by the human, establishing ownership.',
  },
  {
    title: 'Unclaimed projects expire',
    description:
      'Unclaimed projects expire after 72 hours, with 100 MB storage and 1 GB transfer available until the project is claimed.',
  },
];

const Ownership = () => (
  <section
    className="ownership mt-57.5 safe-paddings xl:mt-40 lg:mt-32 md:mt-20"
    aria-labelledby="claimable-neon-ownership-heading"
  >
    <Container size="1344">
      <h2
        className="max-w-206 text-[2.75rem] leading-dense font-normal tracking-tighter text-gray-new-50 xl:text-4xl lg:max-w-3xl lg:text-3xl md:text-[1.75rem]"
        id="claimable-neon-ownership-heading"
      >
        <span className="text-white">One scoped project, one path to ownership.</span> Claim it into
        your organization before it expires.
      </h2>

      <ol className="mt-24 grid grid-cols-3 gap-x-21 xl:mt-20 xl:gap-x-10 lg:mt-16 lg:gap-x-6 md:mt-10 md:grid-cols-1 md:gap-y-8">
        {FEATURES.map(({ title, description }, index) => (
          <li
            className="relative min-w-0 border-l border-gray-new-20 pl-6 lg:pl-5 md:border-none md:pl-0"
            key={title}
          >
            <span className="font-mono text-lg leading-normal tracking-extra-tight text-white lg:text-base">
              0{index + 1}
            </span>
            <div className="mt-40 xl:mt-32 lg:mt-24 md:mt-5">
              <h3
                className={`text-[1.75rem] leading-tight font-normal tracking-extra-tight text-pretty text-white xl:text-2xl lg:text-xl md:text-2xl ${index === 0 ? 'whitespace-nowrap xl:whitespace-normal' : ''}`}
              >
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

export default Ownership;
