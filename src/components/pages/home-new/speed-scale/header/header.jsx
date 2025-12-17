import clsx from 'clsx';

import Button from 'components/shared/button';
import LINKS from 'constants/links';

import HeadingLabel from '../../heading-label';

const Header = () => (
  <div className="pt-60 xl:pt-40 lg:pt-[116px] md:pt-[102px]">
    <div className="max-w-[832px] xl:max-w-[704px] lg:max-w-[480px]">
      <HeadingLabel className="mb-5 lg:mb-[18px] md:mb-4">Agent platform</HeadingLabel>
      <h2 className="text-[80px] leading-none tracking-tighter xl:text-[72px] lg:text-[52px] md:text-[36px]">
        Speed and scale for agents. And devs.
      </h2>
      <p
        className={clsx(
          'mt-6 max-w-[736px] text-lg tracking-extra-tight text-gray-new-60',
          'lg:mt-5 lg:text-base lg:leading-snug md:mt-[18px] sm:text-[15px]'
        )}
      >
        The most advanced AI Codegen and Text-to-App platforms rely on Neon to give their users
        batteries-included backend: Database, Auth, API. Operating at the speed of AI.
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
