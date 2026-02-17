'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import LINKS from 'constants/links';

import Button from '../button';
import CodeBlockWrapper from '../code-block-wrapper';

const DEFAULT_DATA = {
  title: 'Try it on Neon!',
  description:
    'Neon is Serverless Postgres built for the cloud. Explore Postgres features and functions in our user-friendly SQL editor. Sign up for a free account to get started.',
  buttonText: 'Sign Up',
  buttonUrl: LINKS.signup,
};

const ELLIPSES = [
  {
    color: 'rgba(255, 228, 130, 0.90)',
    width: 176,
    height: 137,
    rotate: 66,
    blur: 40,
    left: 86,
    top: 60,
  },
  {
    color: '#1C7154',
    width: 606,
    height: 176,
    rotate: -110,
    blur: 80,
    top: 250,
    left: -100,
  },
];

const DocCta = ({
  title = DEFAULT_DATA.title,
  description = DEFAULT_DATA.description,
  buttonText = DEFAULT_DATA.buttonText,
  buttonUrl = DEFAULT_DATA.buttonUrl,
  secondaryButtonText = null,
  secondaryButtonUrl = null,
  command = null,
  trackingLabel = null,
  isIntro = false,
}) => (
  <figure
    className={clsx(
      'doc-cta not-prose relative overflow-hidden rounded-none',
      isIntro ? 'my-12 px-6 py-5 md:my-8' : 'my-5 px-7 py-6',
      'border border-gray-new-90',
      'dark:border-[#303236] dark:bg-[rgba(19,20,21,0.6)]'
    )}
  >
    <div
      className="pointer-events-none absolute bottom-0 right-0 h-full w-full overflow-hidden"
      style={{
        maskImage: "url('/images/background-dots-cta.png')",
        WebkitMaskImage: "url('/images/background-dots-cta.png')",
        maskRepeat: 'no-repeat',
        maskSize: '136.364% 490.547%',
        maskPosition: '-256px -327px',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskSize: '136.364% 490.547%',
        WebkitMaskPosition: '-256px -327px',
      }}
    >
      <div className="absolute left-[493px] top-[44px]">
        {ELLIPSES.map((ellipse, i) => (
          <div
            key={i}
            className="absolute rounded-full mix-blend-color-dodge"
            style={{
              width: ellipse.width,
              height: ellipse.height,
              background: ellipse.color,
              filter: `blur(${ellipse.blur}px)`,
              transform: `rotate(${ellipse.rotate}deg)`,
              top: ellipse.top,
              left: ellipse.left,
            }}
          />
        ))}
      </div>
    </div>

    <div
      className={clsx(
        'relative z-10 flex gap-5',
        secondaryButtonText ? 'flex-col' : 'flex-row justify-between'
      )}
    >
      <div className="flex flex-col gap-2">
        <h2
          className={clsx(
            '!my-0',
            isIntro
              ? 'text-xl font-semibold leading-tight tracking-extra-tight'
              : 'text-2xl font-medium leading-snug tracking-tighter text-gray-new-8 dark:text-white'
          )}
        >
          {title}
        </h2>
        <p
          className={clsx(
            'text-gray-new-20 dark:text-gray-new-80',
            isIntro
              ? 'tracking-extra-tight'
              : 'text-base font-normal leading-normal tracking-tight text-gray-new-20 dark:text-gray-new-85',
            '[&_a]:border-b [&_a]:border-transparent [&_a]:text-secondary-8 [&_a]:no-underline',
            '[&_a]:transition-[border-color] [&_a]:duration-200 [&_a]:ease-in-out hover:[&_a]:border-secondary-8',
            'dark:[&_a]:text-primary-1 dark:hover:[&_a]:border-primary-1'
          )}
          dangerouslySetInnerHTML={{ __html: description }}
        />
        {command && (
          <CodeBlockWrapper
            className="mt-4 border border-gray-new-90 bg-white dark:border-gray-new-20 dark:bg-gray-new-10 [&>pre]:!bg-transparent [&>pre]:p-3"
            trackingLabel={trackingLabel}
          >
            <pre className="!my-0">
              <code className="language-bash">{command}</code>
            </pre>
          </CodeBlockWrapper>
        )}
      </div>

      {!isIntro && (
        <div className="relative z-10 flex flex-wrap items-center gap-5">
          <Button
            className="w-fit shrink-0 px-7 py-[14px] text-base font-medium leading-none tracking-tight dark:bg-white dark:text-black dark:hover:bg-gray-new-80"
            to={buttonUrl}
            theme="primary"
            tagName="DocsCTA"
          >
            {buttonText}
          </Button>
          {secondaryButtonText && secondaryButtonUrl && (
            <Button
              className="w-fit shrink-0 border border-[#61646B] bg-white/[0.02] px-7 py-[14px] text-base font-normal leading-none tracking-tight text-white hover:bg-white/[0.04] hover:text-white dark:border-gray-new-40 dark:bg-white/[0.02] dark:text-white dark:hover:bg-white/[0.04] dark:hover:text-white"
              to={secondaryButtonUrl}
              theme="transparent"
              tagName="DocsCTASecondary"
            >
              {secondaryButtonText}
            </Button>
          )}
        </div>
      )}
    </div>
  </figure>
);

DocCta.propTypes = {
  title: PropTypes.string,
  description: PropTypes.node,
  buttonText: PropTypes.string,
  buttonUrl: PropTypes.string,
  secondaryButtonText: PropTypes.string,
  secondaryButtonUrl: PropTypes.string,
  command: PropTypes.string,
  trackingLabel: PropTypes.string,
  isIntro: PropTypes.bool,
};

export default DocCta;
