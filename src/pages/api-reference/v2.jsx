/* eslint-disable react/prop-types */
import React from 'react';
import SwaggerUI from 'swagger-ui';

import 'swagger-ui/dist/swagger-ui.css';

const ApiReferencePage = () => {
  React.useEffect(() => {
    fetch('https://dqjnwjfwjj8yz.cloudfront.net/api_spec/release/v2.json')
      .then((res) => res.json())
      .then((spec) => {
        spec.servers = [
          {
            url: 'https://console.neon.tech/api/v2',
          },
        ];
        spec.info.description = `This is a preview of the next version of the Neon API. It is only partially implemented and intended for review purposes only.\n\n${spec.info.description}`;
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
