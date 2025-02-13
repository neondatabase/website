import Button from 'components/shared/button';
import Container from 'components/shared/container/container';
import LINKS from 'constants/links';

const Hero = () => (
  <section className="hero safe-paddings relative overflow-hidden pt-[170px]">
    <Container className="relative z-10 flex flex-col items-center text-center" size="medium">
      <h1 className="mx-auto font-title text-[68px] font-medium leading-[0.9] -tracking-[0.02em]">
        Let Postgres work <br /> smarter, not harder
      </h1>
      <p className="mt-4 text-lg leading-snug -tracking-[0.02em] text-gray-new-80">
        Learn how Enterprises are maximizing engineering efficiency with Neon.
      </p>
      <Button
        className="relative mt-8 h-12 w-[156px] text-base !font-semibold tracking-tight"
        theme="primary"
        to={LINKS.contactSales}
        target="_blank"
      >
        Contact us
      </Button>
    </Container>
  </section>
);

export default Hero;
