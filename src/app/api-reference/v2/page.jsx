/* eslint-disable react/prop-types */
'use client';
import React from 'react';
import SwaggerUI from 'swagger-ui';

import 'swagger-ui/dist/swagger-ui.css';

const ApiReferencePage = () => {
  React.useEffect(() => {
    fetch('https://dqjnwjfwjj8yz.cloudfront.net/api_spec/release/v2.json')
      .then((res) => res.json())
      .then((spec) => {
        spec.info.description = `[Spec link](https://dqjnwjfwjj8yz.cloudfront.net/api_spec/release/v2.json)\n\n${spec.info.description}`;

        SwaggerUI({
          spec,
          dom_id: '#swagger',
          deepLinking: true,
          filter: true,
        });
      });
  }, []);

  return <div id="swagger" />;
};

export default ApiReferencePage;
