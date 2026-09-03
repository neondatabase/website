import Image from 'next/image';

import Container from 'components/shared/container';
import { sharedBackendPlatformContent } from 'constants/backend-platform-page-content';
import agentReadyIcon from 'images/pages/backend-platform/built-for-agents/agent-ready.svg';
import branchableIcon from 'images/pages/backend-platform/built-for-agents/branchable.svg';
import serverlessIcon from 'images/pages/backend-platform/built-for-agents/serverless.svg';

const { builtForAgents } = sharedBackendPlatformContent;
const [titleFirstLine, titleSecondLine] = builtForAgents.titleLines;
const ICONS_BY_ID = {
  branchable: branchableIcon,
  serverless: serverlessIcon,
  'agent-ready': agentReadyIcon,
};

const BuiltForAgents = () => (
  <section className="build-for-agents bg-gray-new-10 pt-20 safe-paddings pb-40 xl:pt-16 xl:pb-32 lg:pt-12 lg:pb-24 md:pt-10 md:pb-20">
    <Container size="1600">
      <h2 className="max-w-210 text-[5rem] leading-none tracking-tighter xl:max-w-180 xl:text-[4rem] lg:max-w-155 lg:text-[3rem] md:max-w-105 md:text-[2.25rem]">
        {titleFirstLine}
        <br />
        {titleSecondLine}
      </h2>
      <p className="mt-6 max-w-200 text-[1.125rem] leading-normal tracking-extra-tight text-gray-new-50 lg:max-w-175 lg:text-[1rem] md:mt-6 md:text-[0.9375rem]">
        {builtForAgents.description}
      </p>

      <ul className="mt-30 grid grid-cols-3 gap-x-30 xl:gap-x-14 lg:mt-20 lg:gap-x-8 md:mt-16 md:grid-cols-1 md:gap-y-14">
        {builtForAgents.items.map(({ id, title, description }) => (
          <li
            className="border-l border-gray-new-20 pl-6 md:border-t md:border-l-0 md:pt-6 md:pl-0"
            key={id}
          >
            <Image className="size-14" src={ICONS_BY_ID[id]} width={56} height={56} alt="" />
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
