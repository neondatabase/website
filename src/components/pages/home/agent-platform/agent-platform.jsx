import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';
import efficientDevTestIcon from 'images/pages/home/agent-platform/efficient-dev-test-icon.svg';
import lowEntryBarrierIcon from 'images/pages/home/agent-platform/low-entry-barrier-icon.svg';
import multiTenancyIcon from 'images/pages/home/agent-platform/multi-tenancy-icon.svg';
import startAtZeroIcon from 'images/pages/home/agent-platform/start-at-zero-icon.svg';
import backgroundNoise from 'images/pages/home/backed-by/bg-noise.jpg';

const CARDS = [
  {
    icon: startAtZeroIcon,
    title: 'Start at $0',
    description: 'There are no per-app fixed fees, there are no fees for security and compliance.',
  },
  {
    icon: efficientDevTestIcon,
    title: 'Efficient dev/test',
    description: 'Usage-based billing with branching duplicates environments cost-effectively.',
  },
  {
    icon: multiTenancyIcon,
    title: 'Multi-tenancy',
    description:
      'Infra is managed automatically by agents via API, enabling user architectures at scale.',
  },
  {
    icon: lowEntryBarrierIcon,
    title: 'Low entry barrier',
    description: 'Our architectural efficiency powers a free plan with 100 projects.',
  },
];

const DecorativeBackground = () => (
  <Image
    className="pointer-events-none absolute top-0 -right-[10%] h-full 2xl:-right-[20%] lg:hidden sm:-right-1/2"
    src={backgroundNoise}
    alt=""
    width={1175}
    height={927}
    quality={100}
  />
);

const AgentPlatform = () => (
  <section
    className="agent-platform relative overflow-hidden bg-[#E4F1EB] py-40 safe-paddings text-black-pure xl:py-32 lg:py-28 md:py-20"
    id="agent-platform"
    aria-labelledby="agent-platform-heading"
  >
    <DecorativeBackground />
    <Container className="relative z-10 px-0! 2xl:px-8! md:px-5!" size="1280">
      <div className="max-w-5xl">
        <SectionLabel className="mb-5">Agent platform</SectionLabel>
        <h2
          className="text-[4.5rem] leading-none font-normal tracking-tighter xl:text-6xl lg:text-[3.25rem] md:text-[2.25rem] sm:text-[2rem]"
          id="agent-platform-heading"
        >
          Pay for what you use, not for the infrastructure you might need.
        </h2>
        <p className="mt-6 max-w-184 text-lg leading-normal font-normal tracking-extra-tight text-gray-new-40 lg:text-base lg:leading-snug md:mt-4.5 md:text-[0.9375rem]">
          Neon is built for a world where developers create, test, and scale more than ever. Start
          free, experiment freely, and pay only for the resources your applications actually use.
        </p>
        <Button
          className="mt-9 bg-black-pure! font-medium hover:bg-gray-new-20! lg:mt-8 md:mt-7"
          size="new"
          theme="secondary"
          to={LINKS.programsAgents}
        >
          I’m building an agent
        </Button>
      </div>

      <ul className="mt-22 grid grid-cols-4 gap-4 lg:mt-16 lg:grid-cols-2 sm:mt-12 sm:grid-cols-1 sm:gap-3">
        {CARDS.map(({ icon, title, description }) => (
          <li
            className="flex h-94 flex-col bg-[#CDDFD7] px-8 pt-8 pb-7 lg:h-80 lg:px-7 lg:pt-7 lg:pb-6 md:h-75 md:px-5 md:pt-5 md:pb-5 sm:h-63"
            key={title}
          >
            <Image className="size-14 md:size-10" src={icon} width={56} height={56} alt="" />
            <div className="mt-auto flex flex-col gap-3">
              <h3 className="text-[1.75rem] leading-tight font-normal tracking-extra-tight md:text-2xl/tight sm:text-[1.375rem]/tight">
                {title}
              </h3>
              <p className="max-w-xl text-base leading-snug font-normal tracking-tight text-pretty text-gray-new-20 md:text-[0.9375rem] md:leading-snug">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default AgentPlatform;
