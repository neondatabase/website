import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
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
          A better way to build with Postgres
        </Heading>
        <div className="mt-7 flex items-center gap-8 lg:mt-6 md:mt-5">
          <Button
            className="h-11 px-[22px] !font-semibold tracking-tighter  lg:h-9 lg:px-5 lg:text-sm  md:h-8"
            theme="primary"
            to={LINKS.signup}
          >
            Create an Account
          </Button>
          <Link to={LINKS.careers} theme="white">
            View Open Positions
          </Link>
        </div>
      </div>
      <div className="max-w-sm pt-1.5 xl:pt-1 lg:max-w-[352px] lg:pt-0.5 md:mt-9 md:max-w-none md:pt-0">
        <p className="text-lg leading-snug tracking-extra-tight text-gray-new-50 lg:text-base">
          Neon is an open-source database company.
        </p>
        <p className="mt-6 text-lg leading-snug tracking-extra-tight text-gray-new-50 xl:mt-5 lg:mt-4 lg:text-base md:mt-[18px]">
          <span className="text-white">Our mission:</span> Take everything that developers love
          about Postgres — reliability, performance, extensibility — and deliver it as a serverless
          product that helps teams {` `}
          <span className="text-white">
            confidently ship reliable and scalable applications
          </span>{' '}
          faster than ever before.
        </p>
      </div>
    </Container>
  </section>
);

export default Hero;
