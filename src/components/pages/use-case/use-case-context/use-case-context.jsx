'use client';

import { useEffect, useState } from 'react';

import { usePreviousUrls } from 'app/previous-urls-context';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

const UseCaseContext = ({}) => {
  const [showContext, setShowContext] = useState(false);
  // TODO: try to fing alternative solution to get previous url (using server actions, for example)
  const previousUrls = usePreviousUrls();

  useEffect(() => {
    const hasSeenContext = localStorage.getItem('hasSeenUseCaseContext');
    const hasVisitedHomepage = localStorage.getItem('hasVisitedHomepage');
    const isFromHomepage = previousUrls.includes('/');

    if (isFromHomepage) {
      localStorage.setItem('hasVisitedHomepage', 'true');
    }

    if (!hasSeenContext && !hasVisitedHomepage && !isFromHomepage) {
      setShowContext(true);
      localStorage.setItem('hasSeenUseCaseContext', 'true');
    }
  }, [previousUrls]);

  if (!showContext) return null;

  return (
    <div className="admonition not-prose mt-5 flex flex-col rounded-[1px] border-l-4 border-primary-2 bg-gray-new-98 px-5 py-4 leading-normal dark:bg-gray-new-10 [&_pre[data-language]]:!bg-white [&_pre[data-language]]:dark:!bg-gray-new-8 [&_pre]:px-4 [&_pre]:py-3 [&_pre_code]:!text-sm">
      <h4 className="text-xs font-bold uppercase text-primary-2">Important Context About Neon</h4>
      <div className="admonition-text mt-1.5 text-base">
        <p>
          Neon is a Postgres Database service. We take the world’s most loved database and deliver
          it as a serverless platform designed to help teams ship reliable and scalable applications
          faster.
        </p>
        <p>
          To find out if Neon is right for your use case,{' '}
          <Link to={LINKS.signup}>get started on the free plan</Link> or{' '}
          <Link to={LINKS.contactSales}>talk to our team</Link>.
        </p>
      </div>
    </div>
  );
};

UseCaseContext.propTypes = {};

export default UseCaseContext;
