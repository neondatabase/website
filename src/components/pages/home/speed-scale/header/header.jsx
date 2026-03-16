import clsx from 'clsx';

import Button from 'components/shared/button';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';

const Header = () => (
  <div className="pt-60 md:pt-[102px] lg:pt-[116px] xl:pt-40">
    <div className="max-w-[832px] lg:max-w-[480px] xl:max-w-[704px]">
      <SectionLabel className="mb-5 md:mb-4 lg:mb-[18px]" theme="white">
        Agent platform
      </SectionLabel>
      <h2 className="text-[80px] leading-none tracking-tighter md:text-[36px] lg:text-[52px] xl:text-[72px]">
        Speed and scale for agents. And devs.
      </h2>
      <p
        className={clsx(
          'mt-6 max-w-[736px] text-lg tracking-extra-tight text-gray-new-60',
          'sm:text-[15px] md:mt-[18px] lg:mt-5 lg:text-base lg:leading-snug'
        )}
      >
        Codegen and agent platforms rely on Neon to run the backend for user-generated apps.
      </p>
      <Button
        className="mt-9 md:mt-7 lg:mt-8"
        theme="white-filled"
        size="new"
        to={LINKS.programsAgents}
      >
        I’m building an agent
      </Button>
    </div>
  </div>
);

export default Header;
