import Button from 'components/shared/button';
import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';

const Hero = () => (
  <section className="hero safe-paddings relative mt-40 xl:mt-[144px] lg:mt-20 md:mt-12">
    <Container size="960">
      <SectionLabel theme="white" icon="arrow">
        Use cases
      </SectionLabel>
      <h1 className="mt-5 max-w-3xl text-[3.75rem] font-normal leading-dense tracking-tighter xl:text-[3.25rem] lg:max-w-[490px] lg:text-[2.75rem] md:mt-4 md:max-w-full md:text-[2rem]">
        Postgres for modern development workflows
      </h1>
      <p className="mt-6 max-w-[672px] text-lg leading-normal tracking-extra-tight text-gray-new-60 xl:mt-5 lg:mt-[18px] lg:max-w-[581px] lg:text-base md:mt-4 md:max-w-full md:text-[0.9375rem] md:leading-snug">
        Explore how teams use Neon.
      </p>
      <Button
        className="mt-9 h-11 px-7 text-base font-medium tracking-extra-tight xl:mt-8 xl:h-9 xl:px-[18px] xl:text-sm lg:mt-7 md:mt-6"
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
