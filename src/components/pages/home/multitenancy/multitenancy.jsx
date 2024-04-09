import Container from 'components/shared/container';
import PauseableVideo from 'components/shared/pauseable-video';

const Multitenancy = () => (
  <section className="multitenancy safe-paddings mt-8 overflow-hidden xl:-mt-9 lg:-mt-8 md:mt-12">
    <Container className="relative z-10 xl:max-w-[704px] lg:pl-24" size="960">
      <h2 className="font-title text-[68px] font-medium leading-[0.9] tracking-extra-tight text-white xl:text-[56px] lg:text-[44px] sm:text-[32px]">
        Next-gen multitenancy
        <br />
        for modern teams
      </h2>
    </Container>
    <PauseableVideo
      className="relative left-1/2 mt-[54px] max-w-[1920px] -translate-x-1/2 xl:max-w-[1380px] lg:mt-11 lg:max-w-[1150px] md:mt-10 sm:mt-6 sm:max-w-[790px]"
      height={474}
      width={1920}
    >
      <source src="/videos/pages/home/next-gen.mp4" type="video/mp4" />
      <source src="/videos/pages/home/next-gen.webm" type="video/webm" />
    </PauseableVideo>
    <Container
      className="relative z-10 mt-14 xl:max-w-[704px] lg:mt-[50px] lg:pl-24 md:mt-11 sm:mt-6"
      size="960"
    >
      <p className="max-w-[608px] text-xl leading-snug tracking-extra-tight text-gray-new-50 xl:max-w-xl xl:text-lg lg:max-w-[480px] lg:text-sm sm:text-base">
        <span className="text-white">Multi-tenant architecture</span> flexibly scales to fit teams
        of any size, enabling secure data sharing across users or data isolation within
        a&nbsp;single tenant, ensuring tailored access and privacy.
      </p>
    </Container>
  </section>
);

export default Multitenancy;
