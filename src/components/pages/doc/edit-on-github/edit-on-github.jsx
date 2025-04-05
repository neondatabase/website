import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import GitHubIcon from 'icons/github.inline.svg';

const EditOnGithub = ({ fileOriginPath }) => (
  <Link
    className={clsx(
      '!flex items-center gap-x-2 text-gray-new-60 transition-colors duration-200',
      'hover:text-secondary-8 dark:hover:text-primary-1'
    )}
    to={fileOriginPath}
    target="_blank"
    rel="noopener noreferrer"
    icon="external"
  >
    <GitHubIcon className="h-3.5 w-3.5" />
    <span className="text-sm leading-none tracking-tight">Edit this page on GitHub</span>
  </Link>
);

EditOnGithub.propTypes = {
  fileOriginPath: PropTypes.string.isRequired,
};

export default EditOnGithub;
