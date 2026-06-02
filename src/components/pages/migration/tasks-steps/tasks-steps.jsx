import Container from 'components/shared/container/container';
import LINKS from 'constants/links';
import stepOne from 'images/pages/migration/step-one.jpg';
import stepThree from 'images/pages/migration/step-three.jpg';
import stepTwo from 'images/pages/migration/step-two.jpg';

import StepsSlider from './steps-slider';

const ITEMS = [
  {
    title: 'Run checks',
    description:
      'The Import Data Assistant will check your Postgres version, region, and extensions, and prompt adjustments.',
    image: {
      src: stepOne,
      alt: 'Run checks',
      width: 832,
      height: 390,
    },
  },
  {
    title: 'Match configurations',
    description:
      'Then, the Assistant will generate a Neon branch within your source project, matching your source environment.',
    image: {
      src: stepTwo,
      alt: 'Match configurations',
      width: 832,
      height: 390,
    },
  },
  {
    title: 'Transfer data',
    description:
      'The last step is to generates pre-populated <code>pg_dump</code> and <code>pg_restore</code> commands and verify your migration.',
    image: {
      src: stepThree,
      alt: 'Transfer data',
      width: 832,
      height: 390,
    },
    link: {
      text: 'See the docs',
      url: LINKS.docsMigration,
    },
  },
];

const TasksSteps = () => (
  <section className="tasks-steps relative pt-[180px] safe-paddings xl:pt-[157px] lg:pt-[131px] md:pt-[90px]">
    <Container className="relative lg:mx-8 md:mx-1" size="768">
      <header className="max-w-[616px]">
        <p className="mb-4 text-base leading-normal font-medium tracking-wide text-gray-new-50 uppercase lg:text-sm md:mb-3 md:text-[13px]">
          Postgres migrations, automated
        </p>
        <h2 className="font-title text-5xl leading-none font-medium tracking-tighter xl:text-[44px] xl:text-balance lg:text-[40px] md:text-[32px] md:text-pretty">
          No manual steps, no migration stress
        </h2>
      </header>
    </Container>
    <Container className="relative" size="960">
      <StepsSlider items={ITEMS} />
    </Container>
  </section>
);

export default TasksSteps;
