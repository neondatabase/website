import clsx from 'clsx';
import PropTypes from 'prop-types';

import Button from 'components/shared/button';

const CommunityBanner = ({ buttonText, buttonUrl, children = null }) => (
  <section className="community-banner not-prose relative my-7">
    <div
      className={clsx(
        'relative flex min-h-[194px] items-center overflow-hidden border px-8 pb-7 pt-7 sm:px-6 sm:pb-6 sm:pt-6',
        'border-gray-new-80 bg-[rgba(228,241,235,0.4)]',
        'dark:border-gray-new-30 dark:bg-gray-new-10'
      )}
    >
      <div className="relative z-10 flex max-w-[287px] flex-col gap-6">
        <h2 className="text-[28px] font-normal leading-tight tracking-tighter text-black-pure dark:text-white xs:text-2xl">
          {children}
        </h2>
        <Button
          className="max-w-[166px] !rounded-[33px] !px-7 !py-3.5 !text-base !font-medium !leading-none !tracking-tighter"
          to={buttonUrl}
          size="xs"
          theme="white-filled-multi"
          target="_blank"
          rel="noopener noreferrer"
          tagName="CommunityBanner"
        >
          {buttonText}
        </Button>
      </div>
      <div
        className="pointer-events-none absolute right-0 top-1/2 h-[307px] w-[272px] -translate-y-1/2 rounded-full bg-[rgba(57,165,125,.5)] blur-3xl dark:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-1/2 hidden h-[307px] w-[272px] -translate-y-1/2 rounded-full bg-[rgba(79,232,176,.3)] blur-3xl dark:block"
        aria-hidden
      />
      <span className="absolute inset-0 h-full bg-[url('/docs/community-banner/discord-light.png')] bg-contain bg-right bg-no-repeat dark:bg-[url('/docs/community-banner/discord-dark.png')] 3xl:[background-position:calc(100%+40px)_50%] md:[background-position:calc(100%+80px)_50%] sm:hidden [@media(min-width:1280px)_and_(max-width:1366px)]:[background-position:calc(100%+90px)_50%]" />
    </div>
  </section>
);

CommunityBanner.propTypes = {
  children: PropTypes.node,
  buttonText: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
};

export default CommunityBanner;
