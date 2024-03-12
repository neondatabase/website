import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import bgImage from 'images/pages/home/get-started/dots.webp';

const GetStarted = () => (
  <section className="get-started mb-[358px] mt-[445px]">
    <Container className="relative flex flex-col items-center justify-center" size="1100">
      <Image
        className="absolute max-w-none"
        src={bgImage}
        width={bgImage.width / 2}
        height={bgImage.height / 2}
      />
      <h2 className="relative text-center text-[68px] font-medium leading-[0.9] -tracking-[0.03em] text-white">
        Features of tomorrow.
        <br /> Available today.
      </h2>
      <Button className="relative mt-9" size="new-lg" theme="green-outline">
        Get Started
      </Button>
    </Container>
  </section>
);

export default GetStarted;
