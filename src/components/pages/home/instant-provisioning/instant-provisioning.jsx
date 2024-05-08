import clsx from 'clsx';

import Container from 'components/shared/container';
import Link from 'components/shared/link';

import ActiveTabContext from './active-tab-context';
import CodeTabs from './code-tabs';
import DotsAnimation from './dots-animation';

// TODO: add lights under codeblock
const InstantProvisioning = () => (
  <section className="instant-provising safe-paddings relative pt-[168px] xl:pt-[120px] lg:pt-24">
    <Container className="flex flex-wrap gap-x-[58px]" size="1100">
      <ActiveTabContext>
        <div className="w-[384px]">
          <h2 className="font-title text-[68px] font-medium leading-[0.9] tracking-extra-tight text-white xl:text-[56px] lg:pl-16 lg:text-[44px] sm:pl-0 sm:text-[32px]">
            Instant Provisioning
          </h2>
          <p className="mt-[18px] text-xl font-light tracking-extra-tight text-gray-new-70">
            No waiting. No config.
          </p>
        </div>
        <div className="relative flex w-[652px] flex-col pb-[171px] pt-[100px]">
          <div
            className="pointer-events-none absolute -right-20 top-8 h-[133px] w-[398px] rounded-[100%] bg-[#16182D] opacity-35 blur-3xl"
            aria-hidden
          />
          <p
            className={clsx(
              'relative mr-3 self-end font-mono text-xs leading-none tracking-extra-tight',
              'before:pointer-events-none before:absolute before:-inset-x-1.5 before:inset-y-px before:rounded-[100%] before:bg-white before:opacity-[0.22] before:blur-md'
            )}
          >
            <span className="relative opacity-80">Provisioned in 300ms</span>
          </p>
          <div className="relative z-10 mt-2.5 rounded-[14px] bg-white bg-opacity-5 p-1.5 backdrop-blur-[1px]">
            <div
              className="absolute inset-0 z-0 rounded-[inherit] border border-white/5 mix-blend-overlay"
              aria-hidden
            />
            <div className="relative z-10 flex h-12 items-center gap-x-3.5 rounded-[10px] border border-white border-opacity-[0.03] bg-black-new pl-[18px] font-mono text-[13px] tracking-extra-tight">
              <span
                className="relative h-1.5 w-1.5 gap-x-3.5 rounded-full bg-primary-1 shadow-[0px_0px_9px_0px_#4BFFC3]"
                aria-hidden
              >
                <span className="absolute inset-px h-1 w-1 rounded-full bg-[#D9FDF1] opacity-70 blur-[1px]" />
              </span>
              postgresql://example@ep-938132.eu-central-1.aws.neon.tech/primary
            </div>
          </div>
          <DotsAnimation
            className="absolute left-1/2 top-44 aspect-[3.49726] w-[640px] -translate-x-1/2"
            src="/animations/pages/home/dots-stack.riv"
            artboard="dots"
            intersectionRootMargin="0px 0px 600px 0px"
            animationRootMargin="0px 0px 300px 0px"
          />
        </div>

        <div className="w-[384px] pt-6">
          <h2 className="font-title text-[68px] font-medium leading-[0.9] tracking-extra-tight text-white xl:text-[56px] lg:pl-16 lg:text-[44px] sm:pl-0 sm:text-[32px]">
            Works with
            <br />
            your stack
          </h2>
          <p className="mt-7 font-light tracking-extra-tight text-gray-new-70">
            Neon is an easy-to-use serverless Postgres. Integrate it into your language or framework
            within minutes and unlock a new developer workflow.
          </p>
          <Link
            className="relative z-10 mt-7 flex w-fit items-center text-[15px] font-medium leading-none tracking-[-0.03em]"
            to="/docs/serverless/serverless-driver"
            theme="white"
            withArrow
          >
            See all examples
          </Link>
        </div>

        <div className="relative z-10 w-[640px] rounded-[14px] bg-white bg-opacity-5 p-1.5 backdrop-blur-[1px]">
          <div
            className="absolute inset-0 z-0 rounded-[inherit] border border-white/5 mix-blend-overlay"
            aria-hidden
          />
          <div className="relative z-10 flex items-center gap-x-3.5 rounded-[10px] border border-white border-opacity-[0.03] bg-black-new">
            <CodeTabs className="scrollbar-hidden overflow-auto" />
          </div>
        </div>
      </ActiveTabContext>
    </Container>
  </section>
);

export default InstantProvisioning;
