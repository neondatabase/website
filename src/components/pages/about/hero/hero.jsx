import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import LINKS from 'constants/links';

const Hero = () => (
  <section className="hero safe-paddings pt-48 xl:pt-36 lg:pt-11 md:pt-7">
    <Container
      className="flex justify-between xl:max-w-[832px] lg:justify-center lg:gap-x-8 md:flex-col md:!px-5"
      size="960"
    >
      <div className="max-w-md grow xl:max-w-sm lg:max-w-xs md:max-w-none">
        <Heading
          className="text-5xl font-medium leading-[0.9] tracking-extra-tight xl:text-4xl lg:text-[32px] md:text-[28px] md:leading-none"
          tag="h1"
          theme="black"
        >
          We help developers build reliable and scalable applications on Postgres.
        </Heading>
        <Button
          className="mt-7 h-11 px-[22px] !font-semibold tracking-tighter lg:mt-6 lg:h-9 lg:px-5 lg:text-sm md:mt-5 md:h-8"
          theme="primary"
          to={LINKS.careers}
        >
          View Open Roles
        </Button>
      </div>
      <div className="max-w-sm pt-1.5 xl:pt-1 lg:max-w-[352px] lg:pt-0.5 md:mt-9 md:max-w-none md:pt-0">
        <p className="text-lg leading-snug tracking-extra-tight text-gray-new-50 lg:text-base">
          Neon is Postgres redesigned from the ground up to enable developers to{' '}
          <span className="text-white">confidently ship reliable and scalable applications</span>.
          It simplifies database infrastructure management.
        </p>
        <p className="mt-6 text-lg leading-snug tracking-extra-tight text-gray-new-50 xl:mt-5 lg:mt-4 lg:text-base md:mt-[18px]">
          Neon provides streamlined workflows across the entire Software Development Lifecycle —
          <span className="text-white">from development to preview to production.</span>
        </p>
      </div>
    </Container>
  </section>
);

export default Hero;
