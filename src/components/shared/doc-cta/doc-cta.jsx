import clsx from 'clsx';
import PropTypes from 'prop-types';

import LINKS from 'constants/links';

import Button from '../button';

const DEFAULT_DATA = {
  title: 'Try it on Neon!',
  description:
    'Neon is Serverless Postgres built for the cloud. Explore Postgres features and functions in our user-friendly SQL editor. Sign up for a free account to get started.',
  buttonText: 'Sign Up',
  buttonUrl: LINKS.signup,
};

const DocCta = ({
  title = DEFAULT_DATA.title,
  description = DEFAULT_DATA.description,
  buttonText = DEFAULT_DATA.buttonText,
  buttonUrl = DEFAULT_DATA.buttonUrl,
  isIntro = false,
}) => (
  <figure
    className={clsx(
      'doc-cta not-prose rounded-[10px]',
      isIntro
        ? 'my-12 px-6 py-5 md:my-8'
        : 'my-5 flex items-end justify-between gap-x-16 px-7 py-6 md:flex-col md:items-start',
      'border border-gray-new-90 bg-[linear-gradient(to_right,#FAFAFA_0%,rgba(250,250,250,0)100%)]',
      'dark:border-gray-new-20 dark:bg-[linear-gradient(to_right,#18191B_28.86%,#131415_74.18%)]'
    )}
  >
    <div>
      <h2
        className={clsx(
          '!my-0',
          isIntro
            ? 'text-xl font-semibold leading-tight tracking-extra-tight'
            : 'font-title text-2xl font-medium leading-dense'
        )}
      >
        {title}
      </h2>
      <p
        className={clsx(
          'mt-2 text-gray-new-20 dark:text-gray-new-80',
          isIntro ? 'tracking-extra-tight' : 'text-sm font-light',
          '[&_a]:border-b [&_a]:border-transparent [&_a]:text-secondary-8 [&_a]:no-underline',
          '[&_a]:transition-[border-color] [&_a]:duration-200 [&_a]:ease-in-out hover:[&_a]:border-secondary-8',
          'dark:[&_a]:text-primary-1 dark:hover:[&_a]:border-primary-1'
        )}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
    {!isIntro && (
      <Button
        className="px-6 py-3 font-semibold leading-none md:mt-4"
        to={buttonUrl}
        theme="primary"
      >
        {buttonText}
      </Button>
    )}
  </figure>
);

DocCta.propTypes = {
  title: PropTypes.string,
  description: PropTypes.node,
  buttonText: PropTypes.string,
  buttonUrl: PropTypes.string,
  isIntro: PropTypes.bool,
};

export default DocCta;
