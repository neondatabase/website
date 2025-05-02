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
      'The Import Data Assistant checks Postgres version, region, and extensions, and prompts adjustments.',
    image: {
      src: stepOne,
      alt: 'Run checks',
      width: 832,
      height: 390,
    },
  },
  {
    title: 'Create a project',
    description:
      'The Import Data Assistant generates a Neon project that matches your source database environment.',
    image: {
      src: stepTwo,
      alt: 'Create a project',
      width: 832,
      height: 390,
    },
  },
  {
    title: 'Transfer data',
    description:
      'Assistant generates pre-populated <mark>pg_dump</mark> and <mark>pg_restore</mark> commands and verify your migration.',
    image: {
      src: stepThree,
      alt: 'Transfer data',
      width: 832,
      height: 390,
    },
    link: {
      text: 'See the docs',
      url: LINKS.migration,
    },
  },
];

const TasksSteps = () => (
  <section className="task-step-simple safe-paddings relative pt-[182px] xl:pt-[136px] lg:pt-[104px]">
    <Container className="relative z-10" size="768">
      <header className="">
        <p className="mb-4 text-base font-medium uppercase tracking-wide text-gray-new-50">
          Tasks for Assistant
        </p>
        <h2 className="font-title text-5xl font-medium leading-none tracking-tighter xl:text-4xl lg:text-[36px] md:text-[32px]">
          The Import Data Assistant takes care of data transfer
        </h2>
        <div className="mt-3 text-pretty text-lg leading-snug tracking-extra-tight text-gray-new-70 lg:text-[15px] sm:text-sm sm:font-light">
          <p>
            The only thing you have to do is click on Import database in the Neon Console and
            provide the connection string for your existing Postgres database.
          </p>
        </div>
      </header>
      <StepsSlider items={ITEMS} className="py-12" />
    </Container>
  </section>
);

export default TasksSteps;
