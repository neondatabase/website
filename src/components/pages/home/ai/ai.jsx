import Image from 'next/image';

import Container from 'components/shared/container';
import Logos from 'components/shared/logos';
import bg from 'images/pages/home/ai/bg.webp';
import ideMobile from 'images/pages/home/ai/ide-mobile.jpg';

import Heading from '../heading';

import Animation from './animation';
import CopyCodeButton from './copy-code-button';

const logos = ['claude', 'cursor', 'windsurf', 'cline', 'zed', 'openai', 'vscode'];

const AI = () => (
  <section
    className="ai safe-paddings relative scroll-mt-[60px] overflow-hidden py-40 xl:pb-[135px] xl:pt-[137px] lg:scroll-mt-0 lg:pb-[118px] lg:pt-[120px] md:pb-20 md:pt-24"
    id="ai"
  >
    <Container
      className="relative grid grid-cols-[224px_1fr] items-center gap-x-32 before:block xl:grid-cols-1 xl:px-16 xl:before:hidden lg:!px-16 md:!px-5"
      size="1600"
    >
      <div className="min-w-0">
        <Heading title="<strong>Postgres for the AI Engineering era.</strong> Integrate with a single command and the LLM does the hard work." />
        <div className="relative mt-[182px] pl-32 xl:-mr-8 xl:mt-[174px] xl:pl-16 lg:-mx-8 lg:mt-[143px] lg:px-0 md:mx-0 sm:mt-11">
          <div className="pointer-events-none relative w-full sm:hidden">
            <Animation className="absolute -top-[86px] left-1/2 aspect-[941/658] !size-[105%] -translate-x-1/2 xl:-top-[72px] lg:-top-[60px]" />
            <Image
              className="relative -z-10 w-full outline outline-1 outline-gray-new-30"
              src={bg}
              alt=""
              width={1056}
              height={628}
              sizes="(min-width: 1024px) 1056px, 100vw"
              quality={100}
            />
          </div>

          <Image
            className="hidden outline outline-1 outline-gray-new-30 sm:block"
            src={ideMobile}
            alt="Neon in IDE"
            width={704}
            height={490}
            sizes="100vw"
            quality={100}
          />

          <div className="mt-px flex items-center justify-between gap-x-4 bg-gray-new-10 px-4 py-3.5 outline outline-1 outline-gray-new-30 lg:px-3.5 lg:py-4 sm:flex-col sm:items-start sm:gap-y-4 sm:px-4 sm:py-4">
            <p className="sm::text-[15px] ml-3 text-[20px] leading-snug tracking-tight text-white lg:text-[18px] sm:ml-0">
              Try for yourself, start building <br className="hidden md:block" /> with Neon now.
            </p>
            <CopyCodeButton code="npx neonctl init" copyText="npx neonctl@latest init" />
          </div>
        </div>

        <div className="mt-[114px] flex items-center gap-11 xl:mt-[104px] xl:gap-[14px] lg:mt-20 md:mt-[58px] sm:-mx-6 sm:flex-col sm:items-start sm:gap-7">
          <p className="w-[146px] shrink-0 font-medium leading-snug tracking-extra-tight text-gray-new-50 xl:w-32 lg:text-[15px] sm:w-full sm:text-center">
            Connect MCP clients to Neon:
          </p>
          <Logos className="min-w-0 max-w-full" logos={logos} size="sm" />
        </div>
      </div>
    </Container>
  </section>
);

export default AI;
