import Image from 'next/image';

import Container from 'components/shared/container/container';

// TODO: replace with .jpg
import bg from './images/illustration.png';

const Usage = () => (
  <section className="usage safe-paddings relative overflow-hidden pb-[246px] pt-[435px]">
    <Container size="medium">
      <p className="relative z-20 mx-auto mt-9 bg-[linear-gradient(90deg,#8080B0_0%,#8FABAB_100%)] bg-clip-text text-center text-xl tracking-tight text-transparent [text-shadow:_0_4px_30px_rgba(0,0,0,0.80)]">
        New Neon databases are created daily
      </p>
    </Container>
    <Image
      className="pointer-events-none absolute -top-[76px] left-1/2 -z-10 h-auto w-[1740px] max-w-none -translate-x-1/2"
      src={bg}
      width={1740}
      height={912}
      alt=""
      quality={99}
    />
  </section>
);

export default Usage;
