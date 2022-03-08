/* eslint-disable react/prop-types */
import React from 'react';

import Link from 'components/shared/link';

const DocNavLinks = ({ previousLink, nextLink }) => (
  <div className="mt-16 flex w-full">
    {previousLink && (
      <Link to={previousLink.slug} size="md" theme="black-primary-1" className="mr-auto">
        {previousLink.sidebarLabel}
      </Link>
    )}
    {nextLink && (
      <Link to={nextLink.slug} size="md" theme="black-primary-1" className="ml-auto">
        {nextLink.sidebarLabel}
      </Link>
    )}
  </div>
);

export default DocNavLinks;
