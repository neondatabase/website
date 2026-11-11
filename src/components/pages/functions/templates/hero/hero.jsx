import Button from 'components/shared/button';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';

import RegistryFlow from './registry-flow';

const BUTTON_CLASS_NAME =
  'h-11 px-7 text-base font-medium tracking-extra-tight xl:h-9 xl:px-[18px] xl:text-sm';

const RegistryHero = () => (
  <section
    className="bg-black-pure pt-[9.125rem] pb-[5.5rem] text-pretty text-white max-[1024px]:pt-[8.25rem] max-[1024px]:pb-[4.5rem] max-[768px]:pt-28 max-[768px]:pb-14"
    aria-labelledby="function-registry-title"
  >
    <div className="mx-auto w-[calc(100%-6rem)] max-w-[84rem] max-[1200px]:w-[calc(100%-4rem)] max-[768px]:w-[calc(100%-2.5rem)]">
      <SectionLabel theme="white" icon="functions">
        Function Registry
      </SectionLabel>
      <div className="mt-7 grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] items-start gap-24 max-[1200px]:gap-14 max-[1024px]:grid-cols-1 max-[1024px]:gap-8 max-[768px]:mt-6 max-[768px]:gap-6">
        <h1
          id="function-registry-title"
          className="m-0 text-[5rem] leading-[1.06] font-normal tracking-[-.045em] max-[1200px]:text-[4rem] max-[768px]:max-w-[21.875rem] max-[768px]:text-[2.875rem] max-[360px]:text-[2.375rem]"
        >
          Add integrations.
          <br />
          Skip the wiring.
        </h1>
        <div className="pt-1.5 max-[1024px]:pt-0">
          <p className="m-0 max-w-lg text-lg leading-normal text-gray-new-80 max-[768px]:text-base">
            Ready-made functions for image generation, APIs, bots, and more. Copy a template prompt
            to your agent to add the code and Neon service configuration to your app.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4 md:mt-6">
            <Button
              className={BUTTON_CLASS_NAME}
              theme="white-filled"
              to={LINKS.signup}
              target="_blank"
              tagName="Functions Templates Hero"
            >
              Start building
            </Button>
            <Button
              className={BUTTON_CLASS_NAME}
              theme="outlined-new"
              to={LINKS.functionsTemplatesDocs}
              tagName="Functions Templates Hero Docs"
            >
              Read the docs
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-12 w-full max-[768px]:mt-8" data-registry-hero-visual>
        <RegistryFlow />
      </div>
    </div>
  </section>
);

export default RegistryHero;
