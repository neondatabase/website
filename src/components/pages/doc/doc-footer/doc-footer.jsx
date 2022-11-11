// import { StaticImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import GitHubIcon from 'icons/github.inline.svg';

// TODO: uncomment this when we have a way to track feedback
// const emojis = [
//   <StaticImage src="./images/crying.jpg" width={24} height={24} alt="Crying" loading="lazy" />,
//   <StaticImage
//     src="./images/confusing.jpg"
//     width={24}
//     height={24}
//     alt="Confusing"
//     loading="lazy"
//   />,
//   <StaticImage src="./images/grinning.jpg" width={24} height={24} alt="Grinning" loading="lazy" />,
//   <StaticImage src="./images/smiling.jpg" width={24} height={24} alt="Smiling" loading="lazy" />,
// ];

const DocFooter = ({ fileOriginPath }) => (
  <div className="mt-10 flex items-center justify-between border-t border-gray-7 pt-5 sm:flex-col sm:space-y-4">
    <Link
      className="group inline-flex items-center space-x-2.5 text-sm leading-none transition-colors duration-200"
      to={fileOriginPath}
      target="_blank"
      rel="noopener noreferrer"
    >
      <GitHubIcon className="h-6 w-6" />
      <span className="group-hover:text-secondary-8">Edit this page</span>
    </Link>
    {/* <div className="flex items-center space-x-5 xs:flex-col xs:space-x-0 xs:space-y-4">
      <span className="text-sm leading-tight">Was this page helpful?</span>
      <div className="space-x-3">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            className="inline-block h-6 w-6 rounded-full grayscale transition-[filter] duration-200 hover:grayscale-0"
            type="button"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div> */}
  </div>
);

DocFooter.propTypes = {
  fileOriginPath: PropTypes.string.isRequired,
};

export default DocFooter;
