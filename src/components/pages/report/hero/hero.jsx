import Button from 'components/shared/button';
import Container from 'components/shared/container/container';

const Hero = () => (
  <section className="hero safe-paddings relative pt-40 xl:pt-36 lg:pt-12 sm:pt-8">
    <Container
      className="relative z-10 flex !max-w-xl flex-col items-start lg:!max-w-[642px]"
      size="xxs"
    >
      <h1 className="max-w-[540px] font-title text-[52px] font-medium leading-none tracking-extra-tight xl:max-w-[460px] xl:text-[48px] sm:text-[32px]">
        Postgres failures happen. Long restores make them worse.
      </h1>
      <p className="mt-4 text-lg leading-snug tracking-extra-tight text-gray-new-80 lg:text-base sm:text-[14px]">
        We surveyed 50 developers managing 1TB+ Postgres databases in production. We asked them
        about failures, recovery times, and business impact. Here’s what they told us.
      </p>
      <Button
        className="mt-[38px] whitespace-nowrap !px-5 !py-4 font-semibold leading-none tracking-tighter transition-colors duration-200 xl:mt-[36px] xl:!text-base md:mt-8 sm:mt-7"
        to="/report/Database_Recovery_Developer_Survey_2025_Neon.numbers"
        theme="primary"
        size="xs"
      >
        Download raw survey results
      </Button>
    </Container>
  </section>
);

export default Hero;
