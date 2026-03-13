import Image from 'next/image';

import Container from 'components/shared/container/container';
import GradientBorder from 'components/shared/gradient-border/index';
import LINKS from 'constants/links';
import subprocessors from 'images/pages/security/subprocessors.jpg';

const SubProcessors = () => (
  <section className="sub-processors relative pt-40 safe-paddings lg:pt-[104px] xl:pt-[136px]">
    <Container className="relative z-10" size="960">
      <div className="flex items-start gap-16 sm:flex-col sm:gap-8 lg:justify-center lg:gap-6">
        <div className="mt-10 grow-1 sm:mt-0 sm:w-full sm:text-center lg:mt-1.5 lg:w-[340px] lg:shrink-0">
          <h2 className="font-title text-[44px] leading-[0.9] font-medium tracking-extra-tight lg:text-[36px] xl:text-4xl md:text-[32px]">
            Sub-Processors
          </h2>
          <div className="mt-4 flex flex-col gap-2 text-with-links leading-snug tracking-extra-tight text-pretty text-gray-new-70 sm:text-sm sm:font-light lg:text-[15px]">
            <p>
              Neon engages with carefully selected third-party sub-processors that assist in service
              delivery.
            </p>
            <p>
              All sub-processors are reviewed annually and must comply with contractual security and
              privacy requirements. A list of our third-party sub-processors is available on our{' '}
              <a href={LINKS.subprocessors}>website</a>.
            </p>
          </div>
        </div>
        <div className="relative shrink-0 overflow-hidden rounded-xl sm:w-full lg:shrink-[unset] md:grow">
          <Image
            className="sm:w-full"
            src={subprocessors}
            width={448}
            height={268}
            quality={100}
            alt=""
          />
          <GradientBorder withBlend />
        </div>
      </div>
    </Container>
  </section>
);

export default SubProcessors;
