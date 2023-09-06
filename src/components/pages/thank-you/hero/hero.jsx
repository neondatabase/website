import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container';

import illustration from './images/illustration.jpg';

const Hero = () => (
  <section className="grow pb-24 pt-20 dark:bg-gray-new-8 dark:text-white lg:pt-0 md:py-14 xs:pt-10">
    <Container
      className="grid grid-cols-12 items-start gap-x-8 md:gap-x-0 md:gap-y-10 lg:items-center md:items-stretch"
      size="md"
    >
      <div className="col-start-2 col-end-6 flex flex-col pt-48 2xl:col-start-1 xl:pt-20 lg:pt-0 md:col-span-full">
        <h1 className="text-[58px] font-bold leading-none xl:text-5xl xl:leading-none md:text-4xl">
          Thanks for subscribing!
        </h1>
        <p className="t-xl mt-7 lg:mt-8 max-w-md">
          You&apos;ll receive our latest announcements and product updates in your inbox.
        </p>

        <Button className="mt-11 self-start lg:mt-8 sm:w-full" size="md" theme="primary" to="/">
          Back to Home
        </Button>
      </div>

      <div className="col-start-6 col-end-12 2xl:col-end-13 md:col-span-full">
        <Image
          className="w-full md:mx-auto md:max-w-full"
          width={864}
          height={767}
          src={illustration}
          alt=""
          quality={75}
          priority
        />
      </div>
    </Container>
  </section>
);

export default Hero;
