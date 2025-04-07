import Button from 'components/shared/button';
import Container from 'components/shared/container/container';
import LINKS from 'constants/links';

const Hero = () => (
  <section className="hero safe-paddings relative pt-40 lg:pt-20 md:pt-12 sm:pt-8">
    <Container className="relative z-10 flex !max-w-[576px] flex-col items-start" size="xxs">
      <h1 className="max-w-[540px] font-title text-[52px] font-medium leading-none tracking-extra-tight lg:text-[48px] md:max-w-[460px] sm:text-[32px]">
        Postgres failures happen. Long restores make them worse.
      </h1>
      <p className="mt-4 text-lg leading-snug tracking-extra-tight text-gray-new-80 md:text-base sm:text-[14px]">
        We surveyed 50 developers managing 1TB+ Postgres databases in production. We asked them
        about failures, recovery times, and business impact. Here’s what they told us.
      </p>
      <Button
        className="mt-10 whitespace-nowrap !px-5 font-semibold leading-none tracking-tighter transition-colors duration-200 lg:!text-base sm:mt-8"
        to={LINKS.signup}
        theme="primary"
        size="xs"
      >
        Download raw survey results
      </Button>
    </Container>
  </section>
);

export default Hero;
