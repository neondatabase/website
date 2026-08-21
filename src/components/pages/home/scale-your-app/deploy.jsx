import Image from 'next/image';

import Container from 'components/shared/container';

import DeploymentCards from './deployment-cards';
import FeatureHeading from './feature-heading';

const EncoreTestimonial = () => (
  <figure className="absolute top-[72px] left-1/2 z-10 flex min-h-[257px] w-[36.6667%] max-w-[704px] min-w-[560px] flex-col justify-between border border-[#242628] bg-black-pure px-8 py-8 lg:top-12 lg:right-8 lg:left-8 lg:min-h-[230px] lg:w-auto lg:max-w-none lg:min-w-0 md:top-10 md:right-5 md:left-5 md:min-h-[240px] md:px-6 md:py-6 sm:min-h-[260px] sm:px-5">
    <blockquote className="max-w-[620px] text-2xl leading-normal tracking-extra-tight text-white md:text-xl sm:text-lg">
      “Our users were asking for preview environments that already had their data in place. Neon’s
      branching was exactly what we needed”
    </blockquote>

    <figcaption className="mt-7 flex items-center gap-4">
      <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden bg-[#18191b]">
        <Image
          className="size-10 object-contain brightness-0 invert"
          src="/images/technology-logos/encore.svg"
          width={40}
          height={40}
          alt=""
        />
      </span>
      <span className="flex flex-col text-xl leading-tight tracking-extra-tight text-white md:text-lg">
        <span>Marcus Kohlberg</span>
        <span className="text-gray-new-70">Founder at Encore</span>
      </span>
    </figcaption>
  </figure>
);

const Deploy = () => (
  <div className="relative h-[1181px] overflow-hidden lg:h-[900px] md:h-[760px] sm:h-[700px]">
    <Container
      className="grid grid-cols-[22rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)] lg:block"
      size="1600"
    >
      <FeatureHeading
        className="col-start-2"
        lines={[
          { text: 'WHERE AGENT', width: 576 },
          { text: 'PLATFORMS DEPLOY', width: 832 },
        ]}
        description="The backend behind every app they generate."
      />
    </Container>

    <div className="absolute inset-x-0 top-[222px] h-[916px] lg:top-[190px] md:top-[170px]">
      <DeploymentCards />
      <EncoreTestimonial />
    </div>
  </div>
);

export default Deploy;
