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
  children = DEFAULT_DATA.description,
  buttonText = DEFAULT_DATA.buttonText,
  buttonUrl = DEFAULT_DATA.buttonUrl,
}) => (
  <figure className="doc-cta not-prose flex items-end gap-x-16 rounded-[10px] border border-gray-new-90 bg-[linear-gradient(to_right,#FAFAFA_0%,rgba(250,250,250,0)100%)] p-8 dark:border-gray-new-20 dark:bg-[linear-gradient(to_right,#18191B_28.86%,#131415_74.18%)] md:flex-col md:items-start sm:p-6">
    <div>
      <h2 className="!my-0 text-[28px] font-medium leading-dense md:text-[26px] xs:text-2xl">
        {title}
      </h2>
      <p className="mt-2 text-sm font-light text-gray-new-20 dark:text-gray-new-80">{children}</p>
    </div>
    <Button className="px-6 py-3 font-semibold leading-none md:mt-4" to={buttonUrl} theme="primary">
      {buttonText}
    </Button>
  </figure>
);

DocCta.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  buttonText: PropTypes.string,
  buttonUrl: PropTypes.string,
};

export default DocCta;
