'use client';

import get from 'lodash.get';
import PropTypes from 'prop-types';
import { Children, cloneElement, isValidElement, useEffect, useMemo, useState } from 'react';

import { useUserData } from '../user-data-provider';
import UserDataSelector from '../user-data-selector';

function interpolate(children, data) {
  return Children.map(children, (child) => {
    if (typeof child === 'string') {
      return child.replace(/@@@([^:]+):(.+)@@@/g, (match, path, defaultValue) => get(data, path, defaultValue));
    }

    if (isValidElement(child)) {
      return cloneElement(child, {
        ...child.props,
        children: interpolate(child.props.children, data),
      });
    }

    return child;
  });
}

const UserData = ({ children, selector = 'true' }) => {
  const { data } = useUserData();
  const [interpolated, setInterpolated] = useState(children);

  const interpolationData = useMemo(() => ({
      selected_org: data?.orgs?.find((org) => org.id === data.selected_org_id),
      selected_project: data?.org_projects?.find(
        (project) => project.id === data.selected_project_id
      ),
      ...data,
    }), [data]);

  useEffect(() => {
    setInterpolated(interpolate(children, interpolationData));
  }, [children, interpolationData]);

  return (
    <>
      {selector === 'true' && <UserDataSelector />}
      {interpolated}
    </>
  );
};

UserData.propTypes = {
  children: PropTypes.node,
  selector: PropTypes.string,
};

export default UserData;
