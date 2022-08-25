/* eslint-disable react/prop-types */
import React from 'react';
import SwaggerUI from 'swagger-ui';

import 'swagger-ui/dist/swagger-ui.css';

const ApiReferencePage = () => {
  React.useEffect(() => {
    // todo: change to /release/ once released
    fetch('https://dqjnwjfwjj8yz.cloudfront.net/api_spec/main/v1.json')
      .then((res) => res.json())
      .then((spec) => {
        spec.servers = [
          {
            url: 'https://console.neon.tech/api/v1',
          },
        ];

        SwaggerUI({
          spec,
          dom_id: '#swagger',
        });
      });
  }, []);

  return <div id="swagger" />;
};

export default ApiReferencePage;
