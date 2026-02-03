import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import LINKS from 'constants/links';
import triangleIcon from 'icons/triangle.svg';

const Hero = () => (
  <section className="hero safe-paddings relative mt-40 xl:mt-[144px] lg:mt-20 md:mt-12">
    <Container size="960">
      <div className="flex items-end gap-2 md:gap-1.5">
        <Image
          src={triangleIcon}
          alt=""
          width={12}
          height={14}
          aria-hidden="true"
          className="md:h-2.5 md:w-2.5"
        />
        <span className="font-mono text-xs font-medium uppercase leading-none text-gray-new-80 md:text-[10px]">
          Use cases
        </span>
      </div>
      <h1 className="mt-5 max-w-3xl text-[60px] font-normal leading-dense tracking-tighter xl:text-[52px] lg:max-w-[490px] lg:text-[44px] md:mt-4 md:max-w-full md:text-[32px]">
        Postgres for modern development workflows
      </h1>
      <p className="mt-[18px] max-w-[672px] text-lg leading-normal tracking-extra-tight text-gray-new-60 lg:max-w-[581px] lg:text-base md:mt-4 md:max-w-full md:text-[15px] md:leading-snug">
        Explore how teams use Neon to support branching databases, CI pipelines, preview
        environments, and production workloads.
      </p>
      <Button
        className="mt-7 h-9 px-[18px] text-sm font-medium tracking-tighter md:mt-6"
        theme="white-filled"
        to={LINKS.signup}
        target="_blank"
        tagName="Use Cases Page Hero"
      >
        Start building
      </Button>
    </Container>
  </section>
);

export default Hero;
