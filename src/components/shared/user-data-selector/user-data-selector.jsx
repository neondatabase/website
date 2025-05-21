'use client';

import clsx from 'clsx';

import Combobox from 'components/shared/combo-box';
import Link from 'components/shared/link';
import { useUserData } from 'components/shared/user-data-provider';

import { useConsoleUrl } from '../user-data-provider/user-data-provider';

const UserDataSelector = () => {
  const { loggedIn, data, selection, setSelection } = useUserData();
  const { orgs, org_projects: projects } = data;

  const consoleUrl = useConsoleUrl();

  return (
    <div
      className={clsx(
        'items-cente flex flex-wrap gap-0.5 border-b-0 bg-transparent',
        'ml-0 mt-6 px-0 py-1.5 sm:flex-col sm:items-start sm:gap-1'
      )}
    >
      {!loggedIn ? (
        <span className={clsx('text-left text-sm text-gray-new-60')}>
          To view docs with your data,{' '}
          <Link to={`${consoleUrl}/login`} target="_blank" rel="noopener noreferrer">
            log in
          </Link>{' '}
          and reload this page.
        </span>
      ) : (
        <>
          <Combobox
            value={selection.org_id || ''}
            placeholder="Select an organization"
            options={orgs}
            onChange={(value) => {
              setSelection({ org_id: value });
            }}
          />
          <Combobox
            value={selection.project_id || ''}
            placeholder="Select a project"
            options={projects}
            onChange={(value) => {
              setSelection((prev) => ({
                ...prev,
                project_id: value,
              }));
            }}
          />
        </>
      )}
    </div>
  );
};

export default UserDataSelector;
