import Button from 'components/shared/button';
import Container from 'components/shared/container/container';
import Heading from 'components/shared/heading';
import LINKS from 'constants/links';

const Partnership = () => (
  <section className="partnership safe-paddings bg-black py-48 text-white 3xl:py-44 2xl:py-40 xl:py-32 lg:pb-24 lg:pt-12 md:pb-20 md:pt-6">
    <Container className="flex flex-col items-center justify-center text-center" size="md">
      <Heading className="leading-dense" tag="h2" size="md" theme="white">
        Discover Neon Partnership Program
      </Heading>
      <p className="mt-5 text-[30px] xl:text-2xl lg:text-lg md:text-base">
        Integrate Neon into any application seamlessly.
      </p>
      <Button
        id="saas-button"
        className="mt-10 2xl:mt-8 xl:mt-7 md:mt-6"
        to={LINKS.partners}
        size="md"
        theme="primary"
      >
        Become a partner
      </Button>
    </Container>
  </section>
);

export default Partnership;
