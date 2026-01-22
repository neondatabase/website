import Image from 'next/image';

import Container from 'components/shared/container/container';

import bg from './images/illustration.jpg';

const Usage = () => (
  <section className="usage safe-paddings relative overflow-hidden pb-[246px] pt-[435px] xl:pb-[170px] xl:pt-[332px] lg:pt-80 md:pb-[135px] md:pt-[232px]">
    <Container size="medium">
      <h2 className="sr-only">18k+</h2>
      <p className="relative z-20 mx-auto mt-9 bg-[linear-gradient(90deg,#8080B0_0%,#8FABAB_100%)] bg-clip-text text-center text-xl tracking-tight text-transparent [text-shadow:_0_4px_30px_rgba(0,0,0,0.80)] xl:text-base lg:text-[15px] md:text-[11px]">
        New Neon databases are created daily
      </p>
    </Container>
    <Image
      className="pointer-events-none absolute left-1/2 top-[96px] -z-10 w-[1408px] max-w-none -translate-x-1/2 xl:top-[63px] xl:w-[1152px] lg:top-[70px] lg:w-[1060px] md:top-[66px] md:max-w-[770px]"
      src={bg}
      width={bg.width / 2}
      height={bg.height / 2}
      sizes="100vw"
      alt=""
      quality={100}
    />
  </section>
);

export default Usage;
