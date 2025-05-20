'use client';

import { useUserData } from '../../../../app/(docs)/docs/user-data-provider';

const UserDataExample = () => {
  const userData = useUserData();

  return <span id="user-data">{JSON.stringify(userData)}</span>;
};

export default UserDataExample;
