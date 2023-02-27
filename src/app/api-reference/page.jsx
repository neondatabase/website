/* eslint-disable react/prop-types */
'use client';
import React from 'react';
import SwaggerUI from 'swagger-ui';

import 'swagger-ui/dist/swagger-ui.css';

const ApiReferencePage = () => {
  React.useEffect(() => {
    fetch('https://dfv3qgd2ykmrx.cloudfront.net/api_spec/release/v1.json')
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
          deepLinking: true,
          filter: true,
        });
      });
  }, []);

  return <div id="swagger" />;
};

export default ApiReferencePage;
