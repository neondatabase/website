import Container from 'components/shared/container';

const Autoscaling = () => (
  <section
    className="autoscaling safe-paddings relative h-screen scroll-mt-16 bg-[#E4F1EB] lg:scroll-mt-0"
    id="autoscaling"
  >
    <Container
      className="relative grid h-full grid-cols-[224px_1fr] items-center gap-x-32 text-black before:block xl:block"
      size="1600"
    >
      <div className="flex size-full items-center justify-center">Autoscaling section</div>
    </Container>
  </section>
);

export default Autoscaling;
