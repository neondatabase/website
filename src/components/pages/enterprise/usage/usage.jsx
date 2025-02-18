import Image from 'next/image';

import Container from 'components/shared/container/container';

// TODO: replace with .jpg
import bg from './images/illustration.avif';

const Usage = () => (
  <section className="usage safe-paddings relative overflow-hidden pb-[246px] pt-[435px] xl:pb-[170px] xl:pt-[332px] lg:pt-[320px] md:pb-[135px] md:pt-[232px]">
    <Container size="medium">
      <p className="relative z-20 mx-auto mt-9 bg-[linear-gradient(90deg,#8080B0_0%,#8FABAB_100%)] bg-clip-text text-center text-xl tracking-tight text-transparent [text-shadow:_0_4px_30px_rgba(0,0,0,0.80)] xl:text-base lg:text-[15px] md:text-[11px]">
        New Neon databases are created daily
      </p>
    </Container>
    <Image
      className="pointer-events-none absolute -top-[76px] left-1/2 -z-10 h-auto w-[1740px] max-w-none -translate-x-1/2 xl:-top-[74px] xl:w-[1404px] lg:-top-[53px] lg:max-w-[1300px] md:-top-[30px] md:max-w-[950px]"
      src={bg}
      width={1740}
      height={912}
      alt=""
      quality={100}
    />
  </section>
);

export default Usage;
