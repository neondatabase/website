import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import linesImage from 'images/pages/home/industry/lines.png';

import Testimonials from './testimonials';

// TODO: implement rive animation
const Industry = () => (
  <section className="industry mt-[264px] xl:mt-[75px] lg:mt-24 sm:mt-20">
    <Container
      className={clsx(
        'box-content flex gap-24',
        'xl:max-w-[768px] xl:gap-[76px]',
        'lg:!max-w-[627px] lg:gap-[67px]',
        'md:gap-[40px]',
        'sm:m-0 sm:!max-w-full sm:p-0'
      )}
      size="960"
    >
      <Image
        className="xl:w-[180px] lg:w-36 sm:hidden"
        src={linesImage}
        width={linesImage.width / 2}
        height={linesImage.height / 2}
        alt=""
      />
      <div className="flex w-full flex-col sm:items-center">
        <h2
          className={clsx(
            'mt-11 font-title text-[88px] font-medium leading-[0.96] -tracking-[0.03em] text-white',
            'xl:mt-[64px] xl:text-[72px] lg:mt-6 lg:text-[56px]',
            'sm:mt-0 sm:text-center sm:text-[32px] sm:leading-[0.9em] sm:tracking-extra-tight'
          )}
        >
          Industry&nbsp;leaders
          <br />
          trust Neon
        </h2>
        <Link
          className="mt-5 flex w-fit items-center text-[15px] font-medium leading-none tracking-[-0.03em] text-white [&_svg]:ml-[7px] [&_svg]:scale-110"
          to="#"
          withArrow
        >
          Dive into success stories
        </Link>
        <Testimonials />
      </div>
    </Container>
  </section>
);

export default Industry;
