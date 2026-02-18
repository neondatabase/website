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
  'right-[-6%] top-[62%] h-[137px] w-44 rotate-[65.57deg] bg-[rgba(255,228,130,0.90)] blur-[40px] xl:right-[-8%] xl:top-[63%] lg:right-[-10%] lg:top-[64%] md:right-[-15%] md:top-[66%] sm:right-[-18%] sm:top-[68%]',
  'right-[-40%] top-[140%] h-44 w-[606px] -rotate-[118.36deg] bg-[#1D9662] blur-[80px] xl:right-[-48%] xl:top-[142%] lg:right-[-56%] lg:top-[145%] md:right-[-66%] md:top-[150%] sm:right-[-76%] sm:top-[156%]',
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
      isIntro ? 'my-12 px-6 py-5 md:my-8' : 'mt-11 px-7 py-6',
      'border border-gray-new-90 bg-[#F5FAF8]',
      'dark:border-[#303236] dark:bg-[rgba(19,20,21,0.6)]'
    )}
  >
    <div className="pointer-events-none absolute inset-0 overflow-hidden [-webkit-mask-image:url('/images/background-dots-cta.png')] [-webkit-mask-position:right_center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:980px_980px] [mask-image:url('/images/background-dots-cta.png')] [mask-position:right_center] [mask-repeat:no-repeat] [mask-size:980px_980px]">
      <div className="absolute inset-0">
        {ELLIPSES.map((ellipseClassName, i) => (
          <div
            key={i}
            className={clsx('absolute rounded-full mix-blend-color-dodge', ellipseClassName)}
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
        <div
          className={clsx(
            'text-gray-new-8 dark:text-white',
            isIntro
              ? 'text-xl font-semibold leading-tight tracking-extra-tight'
              : 'text-2xl font-medium leading-snug tracking-tighter'
          )}
        >
          {title}
        </div>
        <p
          className={clsx(
            '!m-0 !text-[#494B50] dark:!text-gray-new-85',
            isIntro ? '!tracking-extra-tight' : '!text-base !tracking-tight',
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
            theme="white-filled-multi"
            tagName="DocsCTA"
          >
            {buttonText}
          </Button>
          {secondaryButtonText && secondaryButtonUrl && (
            <Button
              className="w-fit shrink-0 border border-gray-new-60 bg-black-new/[0.02] px-7 py-[14px] text-base font-normal leading-none tracking-tight text-black-new hover:bg-black-new/[0.04] hover:text-black-new dark:border-gray-new-40 dark:bg-white/[0.02] dark:text-white dark:hover:bg-white/[0.04] dark:hover:text-white"
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
