'use client';

import { sql as sqlLang } from '@codemirror/lang-sql';
import {
  processSql,
  renderHttp,
  renderSupabaseJs,
  formatCurl,
  formatHttp,
} from '@supabase/sql-to-rest';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import CodeMirror from '@uiw/react-codemirror';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import CodeTabs from 'components/pages/doc/code-tabs';

const CodeBlock = dynamic(() => import('components/shared/code-block'), { ssr: false });

const neonImportLibrary = `
import { PostgrestClient } from "@supabase/postgrest-js";

// An example of how to use the data api with neon auth can be found here:
// https://github.com/neondatabase-labs/neon-data-api-neon-auth

const postgRESTClient = new PostgrestClient('DATA-API-URL', {
    headers: {
        'Authorization': \`Bearer \${access_token}\`,
    }
});

const { data, error } = await postgRESTClient`;

const SqlToRestConverter = () => {
  const [sqlQuery, setSqlQuery] = useState(`select
  name,
  age
from
  users
where
  name ilike '%john%'
order by
  name desc
limit
  5
offset
  10`);

  const [curlOutput, setCurlOutput] = useState('');
  const [httpOutput, setHttpOutput] = useState('');
  const [jsOutput, setJsOutput] = useState('');
  const [error, setError] = useState('');
  const { resolvedTheme } = useTheme();

  const convertSql = async (sql) => {
    try {
      const statement = await processSql(sql);

      const httpRequest = await renderHttp(statement);

      const baseUrl = 'http://localhost:54321/rest/v1';
      const curlCommand = formatCurl(baseUrl, httpRequest);

      const rawHttp = formatHttp(baseUrl, httpRequest);

      let { code: jsCode } = await renderSupabaseJs(statement);

      jsCode = jsCode.replace('const { data, error } = await supabase', neonImportLibrary);

      setCurlOutput(curlCommand);
      setHttpOutput(rawHttp);
      setJsOutput(jsCode);
    } catch (err) {
      setError(err.message || 'An error occurred while converting SQL');
    }
  };

  const onSqlChange = (value) => {
    setError('');
    setSqlQuery(value);
  };

  useEffect(() => {
    convertSql(sqlQuery);
  }, [sqlQuery]);

  return (
    <div className="sql-to-rest-converter">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">SQL Query</h3>

          <CodeMirror
            value={sqlQuery}
            height="300px"
            theme={resolvedTheme === 'dark' ? githubDark : githubLight}
            extensions={[sqlLang()]}
            className="rounded-md border border-gray-new-90 font-mono text-sm leading-relaxed dark:border-gray-new-20"
            onChange={onSqlChange}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generated API Calls</h3>
          {error && (
            <div className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 rounded-md border p-4">
              <h4 className="text-red-800 dark:text-red-200 text-sm font-semibold">Error</h4>
              <p className="text-red-700 dark:text-red-300 mt-1 text-sm">{error}</p>
            </div>
          )}

          {!error && (
            <CodeTabs labels={['JavaScript', 'cURL', 'HTTP']}>
              <CodeBlock>
                <code className="language-javascript">{jsOutput}</code>
              </CodeBlock>

              <CodeBlock>
                <code className="language-shell">{curlOutput}</code>
              </CodeBlock>

              <CodeBlock>
                <code className="language-http">{httpOutput}</code>
              </CodeBlock>
            </CodeTabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default SqlToRestConverter;
