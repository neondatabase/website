import Image from 'next/image';

import Container from 'components/shared/container/container';
import GradientBorder from 'components/shared/gradient-border/index';
import LINKS from 'constants/links';
import subprocessors from 'images/pages/security/subprocessors.jpg';

const SubProcessors = () => (
  <section className="sub-processors safe-paddings relative pt-40 xl:pt-[136px] lg:pt-[104px]">
    <Container className="relative z-10" size="960">
      <div className="flex items-start gap-16 lg:justify-center lg:gap-6 sm:flex-col sm:gap-8">
        <div className="grow-1 mt-10 lg:mt-1.5 lg:w-[340px] lg:shrink-0 sm:mt-0 sm:w-full sm:text-center">
          <h2 className="font-title text-[44px] font-medium leading-[0.9] tracking-extra-tight xl:text-4xl lg:text-[36px] md:text-[32px]">
            Sub-Processors
          </h2>
          <div className="text-with-links mt-4 flex flex-col gap-2 text-pretty leading-snug tracking-extra-tight text-gray-new-70 lg:text-[15px] sm:text-sm sm:font-light">
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
        <div className="relative shrink-0 overflow-hidden rounded-xl lg:shrink-[unset] md:grow sm:w-full">
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
