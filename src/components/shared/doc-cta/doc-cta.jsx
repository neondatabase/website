'use client';

import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import LINKS from 'constants/links';
import patternImage from 'images/pages/docs/cta/pattern.png';

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
  isTemplate = false,
}) => (
  <figure
    className={clsx(
      'cta-on-doc doc-cta not-prose relative overflow-hidden',
      isIntro ? 'my-12 p-5 md:my-8' : 'my-9 px-7 py-6',
      'border border-gray-new-80 bg-[rgba(228,241,235)]/40',
      'dark:border-gray-new-30 dark:bg-gray-new-10'
    )}
  >
    {isTemplate && (
      <div className="doc-cta-dots-mask mask-[url(/images/background-dots-cta.png)] mask-position-right mask-no-repeat mask-size-[980px_980px] pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          {ELLIPSES.map((ellipseClassName, i) => (
            <div
              key={i}
              className={clsx('absolute rounded-full mix-blend-color-dodge', ellipseClassName)}
            />
          ))}
        </div>
      </div>
    )}
    {isIntro && (
      <Image
        className="absolute bottom-0 right-0 top-0 h-full w-auto object-cover"
        src={patternImage}
        alt=""
        width={188}
        height={163}
      />
    )}

    <div
      className={clsx(
        'relative z-10 flex gap-5',
        secondaryButtonText ? 'flex-col' : 'flex-row justify-between'
      )}
    >
      <div className="flex flex-col gap-2.5">
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
            '!m-0 !text-base !text-gray-new-20/90 dark:!text-gray-new-85',
            isIntro ? '!tracking-extra-tight' : '!text-base !tracking-tight',
            '[&_a]:inline-flex [&_a]:items-center [&_a]:font-medium [&_a]:text-black-pure [&_a]:no-underline',
            'duration-200 ease-in-out [&_svg]:shrink-0 [&_svg]:text-gray-new-30 [&_svg]:transition-transform',
            '[&>a:hover_svg]:translate-x-[3px]', // p > a:hover svg
            'dark:[&_a]:text-white dark:[&_svg]:text-gray-new-70'
          )}
          dangerouslySetInnerHTML={{ __html: description }}
        />
        {command && (
          <CodeBlockWrapper
            className="mt-4 bg-gray-new-15 text-white dark:bg-[#E4F1EB] dark:text-gray-new-8 [&>pre]:!bg-transparent [&>pre]:p-3"
            trackingLabel={trackingLabel}
            copyButtonClassName="!top-3 !right-2.5 dark:!bg-[#E4F1EB] !bg-gray-new-15 border-none dark:border-none dark:text-gray-new-40 text-gray-new-60 duration-200 transition-colors dark:group-hover:bg-[#E4F1EB] hover:text-white group-hover:bg-gray-new-15 dark:hover:text-black-pure"
          >
            <pre className="!my-0">
              <code className="language-bash text-white dark:text-gray-new-8">
                <span className="ml-1 mr-1.5 text-gray-new-60 dark:text-gray-new-30">$</span>
                {command}
              </code>
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
  isTemplate: PropTypes.bool,
};

export default DocCta;
