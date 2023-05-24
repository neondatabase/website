import clsx from 'clsx';
import PropTypes from 'prop-types';

import CTA from '../cta';

const Content = ({ html, className = null }) => (
  <div className={clsx('prose-blog prose prose-lg', className)}>
    {html}
    {/* TODO: remove this CTA */}
    <CTA
      title="Want to improve your workflow?"
      description="Create a database branch using Vercel"
      buttonText="Sign up"
      buttonUrl="/signup"
    />
  </div>
);

Content.propTypes = {
  html: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  className: PropTypes.string,
};

export default Content;
