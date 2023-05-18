import Image from 'next/image';
import PropTypes from 'prop-types';

import CTA from '../cta';

const Content = ({ html, title, cover, className = null }) => (
  <div className={className}>
    {cover && (
      <Image
        className="mb-10 md:mb-8"
        src={cover?.mediaItemUrl}
        width={716}
        height={375}
        alt={cover?.altText || title}
        priority
      />
    )}
    <div className="prose-blog prose prose-lg">
      {html}
      {/* TODO: remove this CTA */}
      <CTA
        title="Want to improve your workflow?"
        description="Create a database branch using Vercel"
        buttonText="Sign up"
        buttonUrl="/signup"
      />
    </div>
  </div>
);

Content.propTypes = {
  html: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  title: PropTypes.string.isRequired,
  cover: PropTypes.shape({
    mediaItemUrl: PropTypes.string.isRequired,
    altText: PropTypes.string,
  }),
  className: PropTypes.string,
};

export default Content;
