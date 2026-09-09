import Container from 'components/shared/container';

import BuildAnimation from './build-animation';
import ClaimDiagram from './claim-diagram';
import ProvisionDiagram from './provision-diagram';

const ITEMS = [
  {
    label: 'Provision',
    title: (
      <>
        Start with scoped
        <br className="xl:hidden" /> credentials.
      </>
    ),
    description:
      'Create a Neon project and give your agent credentials scoped to that project, ready to use from the first request.',
    visual: <ProvisionDiagram />,
  },
  {
    label: 'Build',
    title: 'Build with standard Postgres.',
    description:
      'Use the Postgres tools and workflows you already know while your agent builds against a real Neon database.',
    visual: <BuildAnimation />,
  },
  {
    label: 'Claim',
    title: 'Make the project yours.',
    description:
      'Use the claim link to transfer the project into your Neon organization and continue from where the agent left off.',
    visual: <ClaimDiagram />,
  },
];

const Workflow = () => (
  <section className="claimable-workflow pt-46 safe-paddings xl:pt-32 lg:pt-24 md:pt-20">
    <Container size="1344">
      <h2 className="max-w-244 text-5xl leading-dense tracking-tighter text-pretty xl:max-w-208 xl:text-4xl lg:max-w-192 lg:text-[2.25rem] md:text-[2rem]">
        Start building before you sign up.{' '}
        <span className="text-gray-new-50">
          Let your agent provision Neon, then claim the project when you’re ready.
        </span>
      </h2>

      <ol className="mt-18 flex flex-col gap-y-22 lg:mt-12 lg:gap-y-16">
        {ITEMS.map(({ label, title, description, visual }) => (
          <li className="flex last:mt-1 xl:last:mt-0 lg:flex-col" key={label}>
            <span className="w-64 shrink-0 pt-12 text-xl leading-tight tracking-extra-tight text-gray-new-60 xl:w-48 lg:w-auto lg:pt-0 lg:pb-4 lg:text-lg md:pb-0 md:text-base">
              {label}
            </span>

            <div className="flex min-w-0 flex-1 gap-x-16 border-t border-gray-new-15 pt-10 xl:gap-x-12 lg:grid lg:grid-cols-2 lg:gap-x-8 md:grid-cols-1 md:border-0 md:pt-2">
              <div className="w-104 shrink-0 xl:w-96 lg:w-auto">
                <h3 className="text-[2rem] leading-snug tracking-tighter text-pretty xl:text-[1.75rem] md:text-2xl">
                  {title}
                </h3>
                <p className="mt-2.5 text-xl leading-normal tracking-extra-tight text-pretty text-gray-new-70 xl:text-lg md:mt-2 md:max-w-120 md:text-base">
                  {description}
                </p>
              </div>

              <div className="min-w-0 flex-1 md:mt-8">{visual}</div>
            </div>
          </li>
        ))}
      </ol>
    </Container>
  </section>
);

export default Workflow;
