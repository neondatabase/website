import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

import illustration from './images/illustration.png';

const Hero = () => (
  <section className="hero safe-paddings overflow-hidden bg-black pt-[158px] text-white xl:pt-[136px] lg:pt-9 sm:pt-6">
    <Container
      className="flex w-full items-end justify-between space-x-14 border-b border-dashed border-gray-2 lg:flex-col lg:items-center lg:space-x-0 lg:space-y-14"
      size="sm"
    >
      <div className="max-w-[605px] shrink-0 pb-[88px] xl:max-w-[376px] xl:pb-[60px] lg:pb-0 lg:text-center">
        <Heading
          className="text-[72px] font-bold leading-dense 2xl:text-6xl xl:text-[56px] lg:text-[44px]"
          tag="h1"
        >
          Instant branching for Postgres
        </Heading>
        <p className="mt-7 text-xl xl:text-base">
          Neon allows you to instantly branch your data the same way that you branch your code.
        </p>
        <div className="mt-9 space-x-10 xl:space-x-8 xs:flex xs:flex-col xs:items-center xs:space-x-0 xs:space-y-6">
          <Button
            className="px-9 py-6 !text-lg xl:!text-base lg:px-8 lg:py-5"
            theme="primary"
            size="sm"
            to={LINKS.signup}
          >
            Sign up
          </Button>
          <Link
            className="text-lg font-semibold before:-bottom-1 before:h-[3px] xl:text-base"
            theme="black-primary-1"
            to="/docs/introduction/branching/"
          >
            Explore the docs
          </Link>
        </div>
      </div>
      <div>
        <Image
          className="lg:max-w-[464px]"
          src={illustration}
          quality={70}
          width={752}
          height={616}
          alt=""
          sizes="100%"
          priority
          aria-hidden
        />
      </div>
    </Container>
  </section>
);

export default Hero;
