import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';

import Animation from './animation';

const BENEFITS = [
  {
    title: 'Instant operations',
    description:
      "Infrastructure that responds instantly. Agents don't wait for servers, tickets, or manual provisioning.",
  },
  {
    title: 'Branch everything',
    description:
      'Give every idea its own environment. Agents can work in isolated copies of your entire backend.',
  },
  {
    title: 'Safe automation',
    description:
      'Fast development requires fast recovery. Every change can be isolated, tested, and rolled back.',
  },
];

const OperateWithAgentsVisual = () => (
  <div className="min-w-0">
    <Animation />
  </div>
);

const OperateWithAgents = () => (
  <section
    className="operate-with-agents relative mt-65 overflow-hidden bg-black-pure safe-paddings text-white lg:mt-52 md:mt-40 sm:mt-28"
    id="operate-with-agents"
    aria-labelledby="operate-with-agents-heading"
  >
    <Container
      className="grid grid-cols-[22rem_minmax(0,1fr)] gap-y-[70px] xl:grid-cols-[16rem_minmax(0,1fr)] xl:gap-y-14 lg:grid-cols-1 lg:gap-y-10 md:gap-y-8"
      size="1600"
    >
      <div className="pt-3.25 lg:pt-0">
        <SectionLabel theme="white">OPERATE IT WITH AGENTS</SectionLabel>
        <span
          className="mt-4.25 block font-mono text-[8rem] leading-none tracking-tighter text-gray-new-8 lg:text-[6rem] md:text-[5rem] sm:text-[5rem]"
          aria-hidden="true"
        >
          02
        </span>
      </div>

      <header className="min-w-0">
        <h2
          className="ml-px max-w-[1182px] indent-24 text-5xl leading-dense font-normal tracking-tighter text-pretty text-gray-new-50 xl:ml-0 xl:indent-16 xl:text-4xl lg:indent-0 lg:text-[2.25rem] md:text-[2rem]"
          id="operate-with-agents-heading"
        >
          <span className="text-white">Built for developers working with coding agents.</span>{' '}
          Coding agents can now build features, spin up environments, and ship code in minutes.
        </h2>
      </header>

      <ul className="flex max-w-64 min-w-0 flex-col gap-12 pt-[50px] lg:max-w-lg lg:gap-8 lg:pt-0">
        {BENEFITS.map(({ title, description }) => (
          <li className="flex flex-col gap-2" key={title}>
            <h3 className="text-base leading-tight font-normal tracking-extra-tight text-white">
              {title}
            </h3>
            <p className="text-base leading-tight font-normal tracking-extra-tight text-gray-new-50">
              {description}
            </p>
          </li>
        ))}
      </ul>

      <OperateWithAgentsVisual />
    </Container>
  </section>
);

export default OperateWithAgents;
