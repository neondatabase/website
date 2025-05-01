import Image from 'next/image';

import Container from 'components/shared/container/container';
import GradientBorder from 'components/shared/gradient-border/index';
import importDatabase from 'images/pages/migration/import-database.jpg';

const TaskStepSimple = () => (
  <section className="task-step-simple safe-paddings relative pt-[182px] xl:pt-[136px] lg:pt-[104px]">
    <Container className="relative z-10" size="768">
      <div className="flex items-start gap-16 lg:justify-center lg:gap-6 sm:flex-col sm:gap-8">
        <div className="flex-1 sm:w-full sm:text-center">
          <p className="mb-4 text-base font-medium uppercase tracking-wide text-gray-new-50">
            Your only task
          </p>
          <h2 className="font-title text-5xl font-medium leading-none tracking-tighter xl:text-4xl lg:text-[36px] md:text-[32px]">
            Enter connection URL for database
          </h2>
          <div className="mt-3 text-pretty text-lg leading-snug tracking-extra-tight text-gray-new-70 lg:text-[15px] sm:text-sm sm:font-light">
            <p>
              The only thing you have to do is click on Import database in the Neon Console and
              provide the connection string for your existing Postgres database.
            </p>
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden rounded-xl sm:w-full">
          <Image
            className="sm:w-full"
            src={importDatabase}
            width={352}
            height={256}
            quality={100}
            alt=""
          />
          <GradientBorder withBlend />
        </div>
      </div>
    </Container>
  </section>
);

export default TaskStepSimple;
