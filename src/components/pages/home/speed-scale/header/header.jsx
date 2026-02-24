import clsx from 'clsx';

import Button from 'components/shared/button';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';

const Header = () => (
  <div className="pt-60 xl:pt-40 lg:pt-[116px] md:pt-[102px]">
    <div className="max-w-[832px] xl:max-w-[704px] lg:max-w-[480px]">
      <SectionLabel className="mb-5 lg:mb-[18px] md:mb-4" theme="white">
        Agent platform
      </SectionLabel>
      <h2 className="text-[80px] leading-none tracking-tighter xl:text-[72px] lg:text-[52px] md:text-[36px]">
        Speed and scale for agents. And devs.
      </h2>
      <p
        className={clsx(
          'mt-6 max-w-[736px] text-lg tracking-extra-tight text-gray-new-60',
          'lg:mt-5 lg:text-base lg:leading-snug md:mt-[18px] sm:text-[15px]'
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
