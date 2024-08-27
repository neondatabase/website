'use client';

import Link from 'components/shared/link';
import LINKS from 'constants/links';

const UseCaseContext = ({}) => (
    <div className="admonition not-prose mt-5 flex flex-col rounded-[1px] border-l-4 border-primary-2 bg-gray-new-98 px-5 py-4 leading-normal dark:bg-gray-new-10 [&_pre[data-language]]:!bg-white [&_pre[data-language]]:dark:!bg-gray-new-8 [&_pre]:px-4 [&_pre]:py-3 [&_pre_code]:!text-sm">
      <h4 className="text-xs font-bold uppercase text-primary-2">Important Context About Neon</h4>
      <div className="admonition-text mt-1.5 text-base">
        <p>
          Neon is a Postgres Database service. We take the world’s most loved database and deliver
          it as a serverless platform designed to help teams ship reliable and scalable applications
          faster with features like instant provisioning, autoscaling, and database branching.
        </p>
        <p>
          The fastest way to find out if Neon is right for you is to{' '}
          <Link to={LINKS.signup}>sign up for the free plan</Link>.
        </p>
      </div>
    </div>
  );

UseCaseContext.propTypes = {};

export default UseCaseContext;
