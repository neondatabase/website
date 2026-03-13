import Image from 'next/image';

import Container from 'components/shared/container/container';
import GradientBorder from 'components/shared/gradient-border/index';
import importDatabase from 'images/pages/migration/import-database.jpg';

const Task = () => (
  <section className="task relative pt-[185px] safe-paddings lg:pt-[135px] xl:pt-[160px] md:pt-[96px]">
    <Container className="relative lg:mx-8 md:mx-auto md:max-w-sm md:px-5" size="768">
      <div className="flex items-start gap-16 lg:justify-start lg:gap-16 md:flex-col md:gap-8">
        <div className="flex-1 sm:w-full lg:mt-0 xl:mt-1.5">
          <p className="mb-4 text-base font-medium tracking-wide text-gray-new-50 uppercase lg:mb-4 lg:text-sm xl:mb-3 md:mb-3 md:text-[13px]">
            import data assistant
          </p>
          <h2 className="font-title text-5xl leading-none font-medium tracking-tighter lg:text-[40px] xl:text-[44px] md:text-[32px]">
            1-step migration tool
          </h2>
          <div className="mt-3 text-lg leading-snug tracking-extra-tight text-pretty text-gray-new-70 lg:text-[15px] xl:mt-[14px] md:mt-3 md:text-base md:font-light">
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
