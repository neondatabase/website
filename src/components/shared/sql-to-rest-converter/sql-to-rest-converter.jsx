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
import parse from 'html-react-parser';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import CodeTabs from 'components/pages/doc/code-tabs';
import CodeBlockWrapper from 'components/shared/code-block-wrapper';
import highlight from 'lib/shiki';

const neonImportLibrary = `
import { createClient } from "@neondatabase/neon-js";

// An example of how to use the data api with neon auth can be found here:
// https://github.com/neondatabase-labs/neon-data-api-neon-auth

const client = createClient<Database>({
  auth: {
    url: 'NEON-AUTH-URL',
  },
  dataApi: {
    url: 'DATA-API-URL',
  },
});


// Perform signin using client.auth before making any requests to the data api

const { data, error } = await client`;

const neonImportLibraryOwnAuth = `
import { fetchWithToken, NeonPostgrestClient } from '@neondatabase/postgrest-js';

const client = new NeonPostgrestClient({
  dataApiUrl: 'DATA-API-URL',
  options: {
    global: {
      // Replace this with your actual token fetching logic, e.g., from your auth provider
      fetch: fetchWithToken(async () => {
        // Example: return await getAccessTokenFromAuthProvider();
        return 'your-access-token-here';
      }),
    },
  }
});

const { data, error } = await client`;

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
  const [jsOutputNeonAuth, setJsOutputNeonAuth] = useState('');
  const [jsOutputOwnAuth, setJsOutputOwnAuth] = useState('');
  const [highlightedJsNeonAuth, setHighlightedJsNeonAuth] = useState('');
  const [highlightedJsOwnAuth, setHighlightedJsOwnAuth] = useState('');
  const [highlightedCurl, setHighlightedCurl] = useState('');
  const [highlightedHttp, setHighlightedHttp] = useState('');
  const [error, setError] = useState('');
  const { resolvedTheme } = useTheme();

  const convertSql = async (sql) => {
    try {
      const statement = await processSql(sql);

      const httpRequest = await renderHttp(statement);

      const baseUrl = 'http://localhost:54321/rest/v1';
      const curlCommand = formatCurl(baseUrl, httpRequest);

      const rawHttp = formatHttp(baseUrl, httpRequest);

      const { code: jsCode } = await renderSupabaseJs(statement);

      const jsCodeWithNeon = jsCode.replace(
        'const { data, error } = await supabase',
        neonImportLibrary
      );

      const jsCodeWithOwnAuth = jsCode.replace(
        'const { data, error } = await supabase',
        neonImportLibraryOwnAuth
      );

      setCurlOutput(curlCommand);
      setHttpOutput(rawHttp);
      setJsOutputNeonAuth(jsCodeWithNeon);
      setJsOutputOwnAuth(jsCodeWithOwnAuth);
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

  useEffect(() => {
    const highlightAll = async () => {
      try {
        const [jsHtmlNeon, jsHtmlOwn, curlHtml, httpHtml] = await Promise.all([
          highlight(jsOutputNeonAuth || '', 'javascript'),
          highlight(jsOutputOwnAuth || '', 'javascript'),
          highlight(curlOutput || '', 'bash'),
          highlight(httpOutput || '', 'text'),
        ]);
        setHighlightedJsNeonAuth(jsHtmlNeon);
        setHighlightedJsOwnAuth(jsHtmlOwn);
        setHighlightedCurl(curlHtml);
        setHighlightedHttp(httpHtml);
      } catch (e) {
        // silently ignore highlight errors
      }
    };
    highlightAll();
  }, [jsOutputNeonAuth, jsOutputOwnAuth, curlOutput, httpOutput]);

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
            <CodeTabs
              labels={[
                'JavaScript (With Neon Auth)',
                'JavaScript (Bring your own Auth)',
                'cURL',
                'HTTP',
              ]}
            >
              <CodeBlockWrapper>{parse(highlightedJsNeonAuth || '')}</CodeBlockWrapper>

              <CodeBlockWrapper>{parse(highlightedJsOwnAuth || '')}</CodeBlockWrapper>

              <CodeBlockWrapper>{parse(highlightedCurl || '')}</CodeBlockWrapper>

              <CodeBlockWrapper>{parse(highlightedHttp || '')}</CodeBlockWrapper>
            </CodeTabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default SqlToRestConverter;
