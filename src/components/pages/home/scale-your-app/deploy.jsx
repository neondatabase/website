import Image from 'next/image';

import Container from 'components/shared/container';

import DeploymentCards from './deployment-cards';
import FeatureHeading from './feature-heading';

const EncoreTestimonial = () => (
  <figure className="absolute top-[72px] left-1/2 z-10 flex min-h-[257px] w-[36.6667%] max-w-[704px] min-w-140 flex-col justify-between border border-[#242628] bg-black-pure px-8 py-8 2xl:top-0 2xl:right-24 2xl:left-auto 2xl:w-1/4 xl:right-18 xl:w-1/5 xl:min-w-128 xl:px-6 xl:py-6 lg:right-auto lg:left-1/4 lg:min-h-[230px] lg:min-w-124 md:inset-x-10 md:min-h-[240px] md:w-auto md:min-w-80 md:translate-x-0 sm:inset-x-5 sm:min-h-[260px] sm:px-5">
    <blockquote className="max-w-[620px] text-2xl leading-normal tracking-extra-tight text-white xl:text-xl sm:text-lg">
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
      <span className="flex flex-col text-xl leading-tight tracking-extra-tight text-white xl:text-lg">
        <span>Marcus Kohlberg</span>
        <span className="text-gray-new-70">Founder at Encore</span>
      </span>
    </figcaption>
  </figure>
);

const Deploy = () => (
  <div className="relative h-[1181px] overflow-hidden 2xl:h-260 xl:h-220 lg:h-[800px] md:h-[700px]">
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

    <div className="absolute inset-x-0 top-[222px] h-[916px] lg:top-[190px] md:top-40">
      <DeploymentCards />
      <EncoreTestimonial />
    </div>
  </div>
);

export default Deploy;
