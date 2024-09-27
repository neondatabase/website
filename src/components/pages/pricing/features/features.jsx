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
    title: 'Branches = copies of data + schema',
    text: 'Database branches in Neon feel like "database copies", but they are ready instantly and they do not cost you extra storage.',
  },
  {
    icon: storageIcon,
    title: 'Thousands of branches, same storage cost',
    text: 'All branches in a project share the same storage. 100 GB in Neon feels like a lot more—you can "copy" that dataset hundreds of times, e.g. for dev & test.',
  },
];

const computeItems = [
  {
    icon: compatibilityIcon,
    title: 'You only pay for the compute you use',
    text: 'Neon databases autoscale in response to your workload—you get more capacity when you need it, and pay less when traffic is slower. Your dev/test databases scale down to zero to save you money.',
  },
  {
    icon: timerIcon,
    title: '"Compute you use" = "compute hours"',
    text: '<Compute hours> is how we measure compute usage. Example: 4 CU compute running for 20 hours uses 80 compute hours. All monthly plans include generous usage, with extra compute hours billed separately.',
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
