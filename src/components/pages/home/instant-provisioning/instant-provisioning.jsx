import Container from 'components/shared/container';
import Link from 'components/shared/link';

import ActiveTabContext from './active-tab-context';
import BlurWrapper from './blur-wrapper';
import CodeTabs from './code-tabs';
import ConnectionString from './connection-string';
import DotsAnimation from './dots-animation';

const InstantProvisioning = () => (
  <section className="instant-provising safe-paddings relative mt-[168px] xl:mt-28 lg:mt-24 sm:mt-20">
    <Container className="flex flex-wrap justify-center gap-x-[58px] xl:gap-x-[29px]" size="1100">
      <ActiveTabContext>
        <div className="w-[384px] xl:w-[352px] lg:w-[256px] md:w-full md:max-w-[580px]">
          <h2 className="font-title text-[68px] font-medium leading-[0.9] tracking-extra-tight text-white xl:text-[56px] lg:text-[44px] sm:text-[32px]">
            Instant Provisioning
          </h2>
          <p className="mt-[18px] text-xl font-light tracking-extra-tight text-gray-new-70 xl:mt-4 xl:text-lg lg:mt-3 lg:text-base md:mt-2">
            No waiting. No config.
          </p>
        </div>
        <div className="relative flex w-[652px] flex-col pb-[171px] pt-[100px] xl:w-[580px] xl:pb-[148px] xl:pt-[84px] lg:w-[417px] lg:pb-[105px] lg:pt-[61px] md:-mt-4 md:w-full md:max-w-[580px] md:pb-36 md:pt-0 sm:-mt-8 sm:overflow-hidden sm:pt-4">
          <div className="pointer-events-none absolute -left-20 top-32 z-0 h-[133px] w-[205px] rounded-[100%] border border-white bg-[#16182D] opacity-40 blur-3xl md:top-0" />
          <div
            className="pointer-events-none absolute -right-20 top-8 h-[133px] w-[398px] rounded-[100%] bg-[#16182D] opacity-40 blur-3xl"
            aria-hidden
          />
          <ConnectionString url="postgresql://example@ep-938132.eu-central-1.aws.neon.tech/primary" />
          <DotsAnimation
            className="absolute -bottom-1.5 left-1/2 aspect-[3.49726] w-[640px] -translate-x-1/2 mix-blend-lighten xl:w-[568px] lg:w-[417px] md:bottom-0 md:h-40 md:w-full md:[mask-image:linear-gradient(to_bottom,black,black_calc(100%-40px),transparent)] sm:overflow-hidden"
            src="/animations/pages/home/dots-stack.riv"
            artboard="dots"
            intersectionRootMargin="0px 0px 600px 0px"
            animationRootMargin="0px 0px 300px 0px"
          />
        </div>

        <div className="w-[384px] pt-7 xl:w-[352px] xl:pt-1 lg:w-[256px] lg:pt-0 md:w-full md:max-w-[580px]">
          <h2 className="font-title text-[68px] font-medium leading-[0.9] tracking-extra-tight text-white xl:text-[56px] lg:text-[44px] md:mt-2 sm:text-[32px]">
            Works with{` `}
            <br className="md:hidden" />
            your stack
          </h2>
          <p className="mt-7 font-light tracking-extra-tight text-gray-new-70 xl:mt-5 xl:max-w-xs xl:text-lg lg:mt-4 lg:text-base md:mt-2.5 md:max-w-none">
            Integrate it into your language or framework within minutes and unlock a simpler
            developer workflow.
          </p>
          <Link
            className="relative z-10 mt-7 flex w-fit items-center text-[15px] font-medium leading-none tracking-[-0.03em] xl:mt-5 lg:mt-4 md:mt-2.5"
            to="/docs/guides/guides-intro"
            theme="white"
            withArrow
          >
            See all examples
          </Link>
        </div>

        <BlurWrapper className="w-[652px] p-1.5 xl:w-[580px] lg:w-[417px] md:mt-5 md:w-full md:max-w-[580px]">
          <div className="pointer-events-none absolute -left-40 -top-44 z-0 h-[482px] w-[470px] rounded-[100%] bg-[linear-gradient(180deg,rgba(25,27,52,0)_0%,#16182D_88.36%)] opacity-65 blur-3xl xl:-left-36 xl:-top-40 xl:h-[427px] xl:w-[417]" />
          <div className="pointer-events-none absolute -right-32 -top-28 z-0 h-[316px] w-[316px] rounded-[100%] bg-[#16182D] opacity-30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-36 -right-36 z-0 h-[377px] w-[377px] rounded-[100%] bg-[#16182D] opacity-40 blur-3xl" />
          <div className="relative z-20 rounded-[10px] bg-black-new xl:rounded-lg">
            <CodeTabs />
          </div>
        </BlurWrapper>
      </ActiveTabContext>
    </Container>
  </section>
);

export default InstantProvisioning;
