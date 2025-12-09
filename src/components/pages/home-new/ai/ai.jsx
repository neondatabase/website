import Image from 'next/image';

import Container from 'components/shared/container';
import Logos from 'components/shared/logos';
import bg from 'images/pages/home-new/ai/bg.webp';
import ideMobile from 'images/pages/home-new/ai/ide-mobile.jpg';

import Heading from '../heading';

import Animation from './animation';

const logos = ['claude', 'cursor', 'windsurf', 'cline', 'zed', 'openai', 'vscode'];

const AI = () => (
  <section
    className="ai safe-paddings relative scroll-mt-[60px] py-40 xl:pb-[120px] xl:pt-[150px] lg:scroll-mt-0 lg:pb-[104px] lg:pt-[120px] md:py-24"
    id="ai"
  >
    <Container
      className="relative grid grid-cols-[224px_1fr] items-center gap-x-32 before:block xl:grid-cols-1 xl:px-16 xl:before:hidden lg:!px-16 md:!px-5"
      size="1600"
    >
      <div className="min-w-0">
        <Heading title="<strong>Get Postgres. Keep going.</strong> Developers start with Neon to build on Postgres without slowing down." />
        <div className="relative mt-24 pl-32 xl:mt-[72px] xl:px-4 lg:-mx-8 lg:mt-14 lg:px-0 md:mx-0 md:mt-9">
          <div className="pointer-events-none relative w-full md:hidden">
            <Animation />
            <Image
              className="absolute left-0 right-0 top-1/2 -z-10 -translate-y-1/2 border border-gray-new-30"
              src={bg}
              alt=""
              width={1056}
              height={628}
              quality={100}
            />
          </div>
          <Image
            className="hidden md:block"
            src={ideMobile}
            alt="Neon in IDE"
            width={640}
            height={446}
            sizes="100vw"
            quality={100}
          />
        </div>
        <div className="mt-[100px] flex items-center gap-11 xl:mt-32 xl:gap-[14px] lg:mt-20 md:mt-8 sm:flex-col sm:items-start sm:gap-7">
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
