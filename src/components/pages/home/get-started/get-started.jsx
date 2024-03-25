import clsx from 'clsx';
import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import bgImage from 'images/pages/home/get-started/dots.webp';

// TODO: implement rive animation
const GetStarted = () => (
  <section
    className={clsx(
      'get-started mb-[358px] mt-[445px]',
      'xl:mb-[230px] xl:mt-[230px] lg:mb-[156px] lg:mt-[179px] sm:mb-[110px] sm:mt-[116px]'
    )}
  >
    <Container className="flex flex-col items-center justify-center" size="1100">
      <Image
        className={clsx(
          'absolute max-w-none',
          'xl:max-w-[1426px] lg:max-w-[1073px] lg:-translate-y-2 lg:translate-x-px sm:max-w-[872px]'
        )}
        src={bgImage}
        width={bgImage.width / 2}
        height={bgImage.height / 2}
      />
      <h2
        className={clsx(
          'relative text-center text-[68px] font-medium leading-[0.9] -tracking-[0.03em] text-white',
          'xl:text-[56px] xl:leading-none xl:tracking-extra-tight lg:text-[44px] sm:text-[32px]'
        )}
      >
        Features of tomorrow.
        <br /> Available today.
      </h2>
      <Button
        className="relative mt-9 !font-semibold tracking-tighter xl:mt-8 lg:mt-7 sm:mt-5"
        size="lg"
        theme="green-outline"
        to="#"
      >
        Get Started
      </Button>
    </Container>
  </section>
);

export default GetStarted;
