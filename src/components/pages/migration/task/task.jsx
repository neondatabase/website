import Image from 'next/image';

import Container from 'components/shared/container/container';
import GradientBorder from 'components/shared/gradient-border/index';
import importDatabase from 'images/pages/migration/import-database.jpg';

const Task = () => (
  <section className="task relative pt-[185px] safe-paddings md:pt-[96px] lg:pt-[135px] xl:pt-[160px]">
    <Container className="relative md:mx-auto md:max-w-sm md:px-5 lg:mx-8" size="768">
      <div className="flex items-start gap-16 md:flex-col md:gap-8 lg:justify-start lg:gap-16">
        <div className="flex-1 sm:w-full lg:mt-0 xl:mt-1.5">
          <p className="mb-4 text-base font-medium tracking-wide text-gray-new-50 uppercase md:mb-3 md:text-[13px] lg:mb-4 lg:text-sm xl:mb-3">
            import data assistant
          </p>
          <h2 className="font-title text-5xl leading-none font-medium tracking-tighter md:text-[32px] lg:text-[40px] xl:text-[44px]">
            1-step migration tool
          </h2>
          <div className="mt-3 text-lg leading-snug tracking-extra-tight text-pretty text-gray-new-70 md:mt-3 md:text-base md:font-light lg:text-[15px] xl:mt-[14px]">
            <p>
              Our Import Data Assistant can help you automatically copy your existing database to
              Neon. You only need to provide a connection string to get started.
            </p>
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden rounded-xl sm:w-full md:flex-initial">
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
