import Image from 'next/image';

import Container from 'components/shared/container';
import { functionsPageContent } from 'constants/backend-platform-page-content';
import agentFriendlyIcon from 'icons/functions/branching/agent-friendly.svg';
import branchesWithDataIcon from 'icons/functions/branching/branches-with-data.svg';
import declaredInIcon from 'icons/functions/branching/declared-in.svg';
import illustration from 'images/pages/functions/branching/illustration.svg';

const { branching: branchingContent } = functionsPageContent;
const branchingItemsById = Object.fromEntries(
  branchingContent.items.map((item) => [item.id, item])
);
const branchesWithDataContent = branchingItemsById['branches-with-data'];
const declaredInContent = branchingItemsById['declared-in'];
const agentFriendlyContent = branchingItemsById['agent-friendly'];
const [branchingTitleFirstLine, branchingTitleSecondLine] = branchingContent.titleLines;

const Branching = () => (
  <section
    className="bg-black-pure pt-20 safe-paddings pb-40 text-white lg:pt-16 lg:pb-32 md:pt-12 md:pb-24"
    data-figma-node-id="3122:2194"
    aria-labelledby="functions-branching-heading"
  >
    <Container size="1344">
      <h2
        className="max-w-[768px] text-[56px] leading-none tracking-tighter xl:text-5xl lg:text-[40px] md:text-[32px]"
        id="functions-branching-heading"
      >
        {branchingTitleFirstLine}
        <br className="md:hidden" /> {branchingTitleSecondLine}
      </h2>
      <p className="mt-6 max-w-[589px] text-lg leading-normal tracking-extra-tight text-gray-new-60 md:text-base">
        {branchingContent.description}
      </p>

      <div
        className="relative mt-12 aspect-[1344/422] overflow-hidden"
        data-figma-node-id="3122:2198"
      >
        <Image src={illustration} fill unoptimized alt="" />
      </div>

      <ul className="mt-[45px] grid grid-cols-[352px_384px_352px] gap-x-32 min-[1280px]:max-[1407px]:grid-cols-3 min-[1280px]:max-[1407px]:gap-x-16 xl:grid-cols-3 xl:gap-x-16 lg:gap-x-8 md:grid-cols-1 md:gap-y-8">
        <li className="pt-[3px]">
          <h3 className="flex items-center gap-2 text-base leading-none font-medium tracking-extra-tight">
            <span
              className="flex size-4 shrink-0 items-center justify-center overflow-hidden"
              data-figma-node-id="3122:2472"
            >
              <Image className="max-h-full max-w-full" src={branchesWithDataIcon} alt="" />
            </span>
            {branchesWithDataContent.title}
          </h3>
          <p className="mt-2 max-w-[352px] text-base leading-normal tracking-extra-tight text-gray-new-50">
            {branchesWithDataContent.description}
          </p>
        </li>

        <li>
          <h3 className="flex h-[22px] items-center gap-2 text-base leading-none font-medium tracking-extra-tight">
            <span
              className="flex size-4 shrink-0 items-center justify-center overflow-hidden"
              data-figma-node-id="3122:2482"
            >
              <Image className="max-h-full max-w-full" src={declaredInIcon} alt="" />
            </span>
            <span>{declaredInContent.title}</span>
            <code
              className="inline-flex h-[22px] w-[66px] shrink-0 items-center justify-center rounded border border-gray-new-30 bg-black-new font-mono text-[13px] leading-[1.2] font-normal tracking-extra-tight text-white"
              data-figma-node-id="3122:2487"
            >
              {declaredInContent.titleCode}
            </code>
          </h3>
          <p className="mt-[5px] max-w-[381px] text-base leading-normal tracking-extra-tight text-gray-new-50">
            {declaredInContent.descriptionBeforeCode}{' '}
            <code
              className="inline-flex h-[18px] w-[92px] items-center justify-center rounded border border-gray-new-30 bg-black-new font-mono text-[13px] leading-[1.2] font-normal tracking-extra-tight text-white"
              data-figma-node-id="3122:2491"
            >
              {declaredInContent.descriptionCode}
            </code>
            {declaredInContent.descriptionAfterCode}
          </p>
        </li>

        <li className="pt-[3px]">
          <h3 className="flex items-center gap-2 text-base leading-none font-medium tracking-extra-tight">
            <span
              className="flex size-4 shrink-0 items-center justify-center overflow-hidden"
              data-figma-node-id="3122:2496"
            >
              <Image className="max-h-full max-w-full" src={agentFriendlyIcon} alt="" />
            </span>
            {agentFriendlyContent.title}
          </h3>
          <p className="mt-2 max-w-[321px] text-base leading-normal tracking-extra-tight text-gray-new-50">
            {agentFriendlyContent.description}
          </p>
        </li>
      </ul>
    </Container>
  </section>
);

export default Branching;
