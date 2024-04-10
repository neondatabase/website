import Container from 'components/shared/container/container';
import GradientLabel from 'components/shared/gradient-label';
import Heading from 'components/shared/heading';
import compatibilityIcon from 'icons/ai/compatibility.svg';
import branchingIcon from 'icons/aws/branching.svg';
import storageIcon from 'icons/aws/storage.svg';
import timerIcon from 'icons/landing/timer.svg';

import computeIllustration from './images/compute-illustration.svg';
import storageIllustration from './images/storage-illustration.svg';
import Row from './row';

const storageItems = [
  {
    icon: branchingIcon,
    title: 'Branch-based databases',
    text: 'Postgres databases in Neon reside within database branches. These branches, housed within projects, hold both schema and data',
  },
  {
    icon: storageIcon,
    title: 'All branches within a project share storage',
    text: 'Branch databases instantly without extra storage. Ideal for creating dev, staging, preview, and test databases cost-effectively',
  },
];

const computeItems = [
  {
    icon: compatibilityIcon,
    title: 'Serverless compute',
    text: 'Compute size is measured in <span class="font-medium text-white underline decoration-dotted underline-offset-4" data-tooltip-id="cu-icon" data-tooltip-html="1 CU = 1 vCPU, 4 GB RAM">CUs</span>. Database branches auto-scale from 0.25 to 8 CU based on load and down to zero when inactive',
  },
  {
    icon: timerIcon,
    title: 'Compute usage measured in CU-hours',
    text: 'Example: a 4 CU compute running for 20 hours uses 80 compute hours. Monthly plans include generous usage, with extra hours billed separately',
  },
];

const Features = () => (
  <section className="safe-paddings relative mt-60 xl:mt-48 lg:mt-[124px] md:mt-[88px]">
    <Container className="grid-gap-x grid grid-cols-12" size="medium">
      <div className="col-span-10 col-start-2">
        <GradientLabel className="mx-auto block w-fit">Details</GradientLabel>
        <Heading
          className="mt-4 text-center text-[48px] font-medium leading-none tracking-tight lg:text-4xl sm:text-[36px]"
          tag="h2"
          theme="white"
        >
          Neon billing fundamentals
        </Heading>
        <p className="mt-3 text-center text-lg font-light leading-snug sm:text-base">
          The Neon architecture is unique — and so is our billing.
        </p>
      </div>
      <div className="col-span-10 col-start-2 mt-[72px] flex flex-col items-center gap-y-20 xl:col-span-full xl:col-start-1 xl:gap-y-[104px] md:gap-y-16">
        <Row title="Storage" items={storageItems} image={storageIllustration} />
        <Row
          title="Compute"
          items={computeItems}
          image={computeIllustration}
          imagePosition="right"
        />
      </div>
    </Container>
  </section>
);

export default Features;
