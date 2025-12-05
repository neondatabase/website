import clsx from 'clsx';
import PropTypes from 'prop-types';

import LINKS from 'constants/links';
import { getHighlightedCodeArray } from 'lib/shiki';

import CodeTabsNavigation from './code-tabs-navigation';

const codeSnippets = [
  {
    name: 'Ruby',
    iconName: 'ruby',
    language: 'ruby',
    code: `require 'uri'
require 'net/http'
require 'openssl'
    
url = URI("${LINKS.console}/api/v2/projects/project_id/branches")
    
http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true
    
request = Net::HTTP::Post.new(url)
request["accept"] = 'application/json'
request["content-type"] = 'application/json'
    
response = http.request(request)
puts response.read_body`,
  },
  {
    name: 'PHP',
    iconName: 'php',
    language: 'php',
    code: `<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', '${LINKS.console}/api/v2/projects/project_id/branches', [
  'headers' => [
    'accept' => 'application/json',
    'content-type' => 'application/json',
  ],
]);

echo $response->getBody();`,
  },
  {
    name: 'Node',
    iconName: 'javascript',
    language: 'javascript',
    code: `const sdk = require('api')('@neon-tech/v2.0#end53sbljigaqpv');

sdk.createProjectBranch({project_id: 'project_id'})
  .then(({ data }) => console.log(data))
  .catch(err => console.error(err));`,
  },
  {
    name: 'cURL',
    iconName: 'bash',
    language: 'bash',
    code: `curl --request POST
--url ${LINKS.console}/api/v2/projects/project_id/branches
--header 'accept: application/json'
--header 'content-type: application/json'`,
  },
];

const CodeTabs = async ({ className = null }) => {
  const highlightedCodeSnippets = await getHighlightedCodeArray(codeSnippets);

  return (
    <div className={clsx(className, 'rounded-[10px] bg-black-new')}>
      <CodeTabsNavigation
        codeSnippets={codeSnippets}
        highlightedCodeSnippets={highlightedCodeSnippets}
      />
    </div>
  );
};

CodeTabs.propTypes = {
  className: PropTypes.string,
};

export default CodeTabs;
