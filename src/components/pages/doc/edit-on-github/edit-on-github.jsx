import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import ArrowExternalIcon from 'icons/docs/arrow-external.inline.svg';
import GitHubIcon from 'icons/github.inline.svg';

const EditOnGithub = ({ fileOriginPath }) => (
  <Link
    className={clsx(
      'inline-flex items-center gap-x-2 text-sm leading-none',
      'text-gray-new-60 transition-colors duration-200 hover:text-secondary-8 dark:hover:text-primary-1'
    )}
    to={fileOriginPath}
    target="_blank"
    rel="noopener noreferrer"
  >
    <GitHubIcon className="h-3.5 w-3.5" />
    <span className="text-sm leading-tight tracking-tight">Edit this page on GitHub</span>
    <ArrowExternalIcon />
  </Link>
);

EditOnGithub.propTypes = {
  fileOriginPath: PropTypes.string.isRequired,
};

export default EditOnGithub;
