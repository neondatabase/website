import Image from 'next/image';

import Container from 'components/shared/container/container';
import GradientBorder from 'components/shared/gradient-border/index';
import importDatabase from 'images/pages/migration/import-database.jpg';

const Task = () => (
  <section className="task safe-paddings relative pt-[185px] xl:pt-[160px] lg:pt-[135px] md:pt-[96px]">
    <Container className="relative lg:mx-8 md:mx-auto md:max-w-sm md:px-5" size="768">
      <div className="flex items-start gap-16 lg:justify-start lg:gap-16 md:flex-col md:gap-8">
        <div className="flex-1 xl:mt-1.5 lg:mt-0 sm:w-full">
          <p className="mb-4 text-base font-medium uppercase tracking-wide text-gray-new-50 xl:mb-3 lg:mb-4 lg:text-sm md:mb-3  md:text-[13px]">
            import data assistant
          </p>
          <h2 className="font-title text-5xl font-medium leading-none tracking-tighter xl:text-[44px] lg:text-[40px] md:text-[32px]">
            1-step migration tool
          </h2>
          <div className="mt-3 text-pretty text-lg leading-snug tracking-extra-tight text-gray-new-70 xl:mt-[14px] lg:text-[15px] md:mt-3 md:text-base md:font-light">
            <p>
              Our Import Data Assistant can help you automatically copy your existing database to
              Neon. You only need to provide a connection string to get started.
            </p>
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden rounded-xl md:flex-initial sm:w-full">
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

export default Task;
