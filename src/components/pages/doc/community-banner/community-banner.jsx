import PropTypes from 'prop-types';

import Button from 'components/shared/button';
import { cn } from 'utils/cn';

const CommunityBanner = ({ className, buttonText, buttonUrl, children = null }) => (
  <section className={cn('community-banner not-prose relative my-7', className)}>
    <div
      className={cn(
        'relative flex min-h-48.5 items-center overflow-hidden border px-8 pt-7 pb-7 sm:px-6 sm:pt-6 sm:pb-6',
        'border-gray-new-80 bg-gray-new-98',
        'dark:border-gray-new-20 dark:bg-gray-new-8'
      )}
    >
      <div className="relative z-10 flex max-w-98 flex-col gap-6">
        <h2 className="text-2xl leading-tight font-normal tracking-tighter text-black-pure dark:text-white">
          {children}
        </h2>
        <Button
          className="max-w-41.5 rounded-full px-7! py-3.5! text-base! leading-none! font-medium!"
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
        className="pointer-events-none absolute top-1/2 right-0 h-[307px] w-[272px] -translate-y-1/2 rounded-full bg-[rgba(57,165,125,.5)] blur-3xl dark:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/2 right-0 hidden h-[307px] w-[272px] -translate-y-1/2 rounded-full bg-[rgba(79,232,176,.3)] blur-3xl dark:block"
        aria-hidden
      />
      <span className="absolute inset-0 h-full bg-[url('/docs/community-banner/discord-light.png')] bg-contain bg-right bg-no-repeat dark:bg-[url('/docs/community-banner/discord-dark.png')] 3xl:[background-position:calc(100%+40px)_50%] md:[background-position:calc(100%+80px)_50%] sm:hidden [@media(min-width:1280px)_and_(max-width:1366px)]:[background-position:calc(100%+90px)_50%]" />
    </div>
  </section>
);

CommunityBanner.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  buttonText: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
};

export default CommunityBanner;
