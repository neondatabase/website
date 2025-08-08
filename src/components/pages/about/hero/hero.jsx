import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

const Hero = () => (
  <section className="hero safe-paddings pt-[194px] xl:pt-[154px] lg:pt-[46px] md:pt-[34px]">
    <Container
      className="flex justify-between xl:max-w-[832px] lg:justify-center lg:gap-x-[60px] md:max-w-[544px] md:flex-col md:!px-5"
      size="960"
    >
      <header className="max-w-[510px] grow xl:max-w-[426px] lg:max-w-[356px] md:max-w-none">
        <Heading
          className="text-6xl font-medium leading-none tracking-extra-tight xl:text-5xl lg:text-4xl md:text-[36px]"
          tag="h1"
        >
          Neon is the
          <br />
          Postgres layer
          <br />
          for the internet
        </Heading>
        <div className="mt-7 flex items-center gap-6 lg:mt-6 md:mt-7 md:gap-x-[18px]">
          <Button
            className="h-12 w-[203px] !font-semibold tracking-tighter lg:h-10 lg:text-sm md:h-9 md:w-40"
            theme="primary"
            to={LINKS.signup}
            aria-label="Create an Account"
          >
            Create an Account
          </Button>
          <Link
            className="tracking-tight lg:whitespace-nowrap lg:text-sm"
            to={LINKS.careers}
            theme="white"
            aria-label="View Open Positions"
            withArrow
            isExternal
          >
            View Open Positions
          </Link>
        </div>
      </header>
      <div className="max-w-sm pt-3 text-lg leading-snug tracking-extra-tight text-gray-new-50 xl:max-w-[352px] xl:pt-1.5 lg:max-w-[288px] lg:pt-1 lg:text-base md:mt-8 md:max-w-none md:pt-0">
        <p>
          <span className="text-white">Our mission:</span> deliver Postgres as a cloud service
          designed to help teams build scalable, dependable applications faster than ever.
        </p>
        <p className="mt-6">
          Neon is built on a distributed architecture that separates storage and compute, unlocking
          the level of performance, reliability, and scale to make Postgres{` `}
          <span className="text-white">a foundational building block</span> as&nbsp;universal
          as&nbsp;S3.
        </p>
      </div>
    </Container>
  </section>
);

export default Hero;
