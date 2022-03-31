/* eslint-disable react/prop-types */
import React from 'react';

import Link from 'components/shared/link';

const PreviousAndNextLinks = ({ previousLink, nextLink }) => (
  <div className="mt-16 flex w-full">
    {previousLink && (
      <Link to={previousLink.slug} size="md" theme="black-primary-1" className="mr-auto">
        {previousLink.title}
      </Link>
    )}
    {nextLink && (
      <Link to={nextLink.slug} size="md" theme="black-primary-1" className="ml-auto">
        {nextLink.title}
      </Link>
    )}
  </div>
);

export default PreviousAndNextLinks;
