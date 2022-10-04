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
          // {
          //   url: 'https://console.neon.tech/api/v2',
          // },
        ];
        spec.info.description = `This is preview of the next version of the API. It's only partially implemented for now and only ment to be reviewed, not used.\n\n${spec.info.description}`;
        SwaggerUI({
          spec,
          dom_id: '#swagger',
          deepLinking: true,
          filter: true,
          tryItOutEnabled: false,
          supportedSubmitMethods: [''],
        });
      });
  }, []);

  return <div id="swagger" />;
};

export default ApiReferencePage;
