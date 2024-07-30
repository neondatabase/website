import Container from 'components/shared/container/container';
import GradientLabel from 'components/shared/gradient-label';
import Heading from 'components/shared/heading';
import compatibilityIcon from 'icons/ai/compatibility.svg';
import branchingIcon from 'icons/aws/branching.svg';
import storageIcon from 'icons/aws/storage.svg';
import timerIcon from 'icons/landing/timer.svg';

import computeIllustration from './images/compute-illustration.jpg';
import storageIllustration from './images/storage-illustration.jpg';
import Row from './row';

const storageItems = [
  {
    icon: branchingIcon,
    title: 'Branch-based Postgres',
    text: 'Databases in Neon are brancheable (both schema and data). Think of code branches, but for your data.',
  },
  {
    icon: storageIcon,
    title: 'Branches share storage',
    text: 'When you branch a database, the new branch won&apos;t add to your storage bill. Branches are ready instantly, no matter how large the dataset.',
  },
];

const computeItems = [
  {
    icon: compatibilityIcon,
    title: 'Serverless compute',
    text: 'Compute size is measured in <span class="font-medium text-white underline decoration-dotted underline-offset-4" data-tooltip-id="cu-icon" data-tooltip-html="1 CU = 1 vCPU, 4 GB RAM">CUs</span>. Database branches autoscale from 0.25 to 10 CU based on load and down to zero when inactive.',
  },
  {
    icon: timerIcon,
    title: 'Compute usage is measured in compute hours',
    text: 'Example: a 4 CU compute running for 20 hours uses 80 compute hours. All monthly plans include generous usage, with extra compute hours billed separately.',
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
          An architecture with branch-based storage and compute that autoscales
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
