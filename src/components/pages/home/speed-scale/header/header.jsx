import clsx from 'clsx';

import Button from 'components/shared/button';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';

const Header = () => (
  <div className="pt-60 lg:pt-[116px] xl:pt-40 md:pt-[102px]">
    <div className="max-w-[832px] lg:max-w-[480px] xl:max-w-[704px]">
      <SectionLabel className="mb-5 lg:mb-[18px] md:mb-4" theme="white">
        Agent platform
      </SectionLabel>
      <h2 className="text-[80px] leading-none tracking-tighter lg:text-[52px] xl:text-[72px] md:text-[36px]">
        Speed and scale for agents. And devs.
      </h2>
      <p
        className={clsx(
          'mt-6 max-w-[736px] text-lg tracking-extra-tight text-gray-new-60',
          'sm:text-[15px] lg:mt-5 lg:text-base lg:leading-snug md:mt-[18px]'
        )}
      >
        Codegen and agent platforms rely on Neon to run the backend for user-generated apps.
      </p>
      <Button
        className="mt-9 lg:mt-8 md:mt-7"
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
