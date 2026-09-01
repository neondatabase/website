import Image from 'next/image';

import Container from 'components/shared/container';
import agentReadyIcon from 'images/pages/backend-platform/built-for-agents/agent-ready.svg';
import branchableIcon from 'images/pages/backend-platform/built-for-agents/branchable.svg';
import serverlessIcon from 'images/pages/backend-platform/built-for-agents/serverless.svg';

const ITEMS = [
  {
    icon: branchableIcon,
    title: 'Branchable',
    description:
      "Spin up isolated environments to test model changes safely, without touching production. Merge changes only when they're ready.",
  },
  {
    icon: serverlessIcon,
    title: 'Serverless',
    description:
      'Usage-based infrastructure that scales automatically with your traffic, so you only pay for what you use and nothing while idle.',
  },
  {
    icon: agentReadyIcon,
    title: 'Agent-ready',
    description:
      'Provision and operate every service through APIs that AI agents can call directly, using the same interfaces as developers.',
  },
];

const BuiltForAgents = () => (
  <section className="build-for-agents bg-gray-new-10 pt-20 safe-paddings pb-40 xl:pt-16 xl:pb-32 lg:pt-12 lg:pb-24 md:pt-10 md:pb-20">
    <Container size="1600">
      <h2 className="max-w-210 text-[5rem] leading-none tracking-tighter xl:max-w-180 xl:text-[4rem] lg:max-w-155 lg:text-[3rem] md:max-w-105 md:text-[2.25rem]">
        Built for agents,
        <br />
        not just developers.
      </h2>
      <p className="mt-6 max-w-200 text-[1.125rem] leading-normal tracking-extra-tight text-gray-new-50 lg:max-w-175 lg:text-[1rem] md:mt-6 md:text-[0.9375rem]">
        Every service is designed with the same API and operational model, whether it&apos;s used by
        a developer or called directly by an AI agent. Build once, then let both humans and agents
        use the same platform without additional integration work.
      </p>

      <ul className="mt-30 grid grid-cols-3 gap-x-30 xl:gap-x-14 lg:mt-20 lg:gap-x-8 md:mt-16 md:grid-cols-1 md:gap-y-14">
        {ITEMS.map(({ icon, title, description }) => (
          <li
            className="border-l border-gray-new-20 pl-6 md:border-t md:border-l-0 md:pt-6 md:pl-0"
            key={title}
          >
            <Image className="size-14" src={icon} width={56} height={56} alt="" />
            <h3 className="mt-6 text-[2rem] leading-tight tracking-extra-tight lg:text-[1.625rem]">
              {title}
            </h3>
            <p className="mt-10 max-w-97.5 text-[1rem] leading-normal tracking-extra-tight text-gray-new-50 lg:mt-8 lg:text-[0.9375rem] md:mt-5">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default BuiltForAgents;
