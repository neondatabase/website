import clsx from 'clsx';
import PropTypes from 'prop-types';

import Button from 'components/shared/button';

const CommunityBanner = ({ buttonText, buttonUrl, children = null }) => (
  <section className="not-prose relative my-10">
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
      {/* Blurred ellipse glow — Figma: dark rgba(79,232,176,0.3) blur 120px, light rgba(57,165,125,0.5) blur 120px */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 h-[307px] w-[272px] -translate-y-1/2 rounded-full dark:hidden"
        style={{
          background: 'rgba(57, 165, 125, 0.5)',
          filter: 'blur(120px)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-1/2 hidden h-[307px] w-[272px] -translate-y-1/2 rounded-full dark:block"
        style={{
          background: 'rgba(79, 232, 176, 0.3)',
          filter: 'blur(120px)',
        }}
        aria-hidden
      />
      <span className="absolute inset-0 h-full bg-[url('/docs/community-banner/discord-light.png')] bg-contain bg-right bg-no-repeat dark:bg-[url('/docs/community-banner/discord-dark.png')] 2xl:[background-position:calc(100%+40px)_50%] xl:bg-right md:[background-position:calc(100%+80px)_50%] sm:hidden" />
    </div>
  </section>
);

CommunityBanner.propTypes = {
  children: PropTypes.node,
  buttonText: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
};

export default CommunityBanner;
