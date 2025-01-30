import Container from 'components/shared/container';

const Hero = () => (
  <section className="safe-paddings bg-black-pure pb-24 pt-40 text-white xl:pt-36 lg:pb-16 lg:pt-12 md:pb-12 md:pt-6">
    <Container size="1152">
      <div className="col-span-10 col-start-2 3xl:col-span-full 3xl:col-start-1">
        <h1 className="t-5xl text-center font-title font-medium leading-tight">
          Become a part of our team{' '}
        </h1>
        <p className="t-lg mx-auto mt-8 max-w-[1160px] text-center leading-normal tracking-extra-tight 3xl:max-w-[800px] 2xl:mt-7 xl:mt-6">
          Neon is a distributed team building open-source, cloud-native Postgres. We are a
          well-funded startup with deep knowledge of Postgres internals and decades of experience
          building databases. Our storage layer is written in Rust, and our cloud control plane is
          written in Go. We are on a mission to create a cloud-native database service for every
          developer.
        </p>
      </div>
    </Container>
  </section>
);

export default Hero;
