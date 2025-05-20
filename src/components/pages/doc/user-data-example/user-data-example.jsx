'use client';

import { useUserData } from '../../../../app/(docs)/docs/user-data-provider';

const UserDataExample = () => {
  const {
    loggedIn,
    setSelection,
    data: { selected_org_id, selected_project_id, orgs, org_projects, connection_uri },
  } = useUserData();

  if (!loggedIn) {
    return <span>Please log in</span>;
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      <select
        value={selected_org_id}
        onChange={(e) =>
          setSelection((prev) => ({
            ...prev,
            org_id: e.target.value,
          }))
        }
      >
        {orgs.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>

      <select
        value={selected_project_id}
        onChange={(e) =>
          setSelection((prev) => ({
            ...prev,
            project_id: e.target.value,
          }))
        }
      >
        {org_projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <span>Use this connection string: {connection_uri}</span>
    </div>
  );
};

export default UserDataExample;
