import Image from 'next/image';

import Container from 'components/shared/container';

import illustration from './images/hero-illustration.jpg';

const Hero = () => (
  <section className="safe-paddings bg-black pt-40 text-white xl:pt-36 lg:pt-12 md:pt-6">
    <Container size="md">
      <h1 className="t-5xl text-center font-bold leading-tight">Become a part of our team </h1>
      <p className="t-lg mx-auto mt-8 max-w-[860px] text-center leading-normal 2xl:mt-7 xl:mt-6">
        Neon is a distributed team building open-source, cloud-native Postgres. We are a well-funded
        startup with deep knowledge of Postgres internals and decades of experience building
        databases. Our storage layer is written in Rust, and our cloud control plane is written in
        Go. We are on a mission to create a cloud-native database service for every developer.
      </p>
      <div className="-mt-16 translate-y-32 lg:-mt-12 lg:translate-y-24 md:-mt-8 md:flex md:translate-y-16 md:justify-center">
        <Image
          className="rounded-md md:min-w-[600px] sm:min-w-0"
          src={illustration}
          alt=""
          priority
          aria-hidden
        />
      </div>
    </Container>
  </section>
);

export default Hero;
