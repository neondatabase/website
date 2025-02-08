/**
 * Example usage:
 * <SqlEditor
    defaultQuery={`INSERT INTO users (name, email) VALUES ('John Doe', 'john.doe@example.com');\nSELECT * FROM users;`}
    setupQuery="CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255));"
    />
 */

'use client';
import * as React from 'react';
import { useState } from 'react';
import Editor from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { Pool } from '@neondatabase/serverless';
import * as semicolons from 'postgres-semicolons';
import useSWRMutation from 'swr/mutation';
import * as Toast from '@radix-ui/react-toast';
import * as Tooltip from '@radix-ui/react-tooltip';
import { QueryResults } from './query-results';
import Button from 'components/shared/button';
import PlayIcon from './images/play.inline.svg';
import LoaderIcon from './images/loader.inline.svg';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import CopyIcon from './images/copy.inline.svg';
import CheckIcon from './images/check.inline.svg';
import { SetupQueryDialog } from './setup-query-dialog';

const useDatabase = () => {
  const [connectionState, setConnectionState] = useState({
    uri: null,
    isConnecting: false,
    error: null,
  });

  const connect = async () => {
    setConnectionState((prev) => ({ ...prev, isConnecting: true }));
    try {
      const projectData = document.cookie
        .split('; ')
        .find((row) => row.startsWith('neon-project='));

      if (projectData) {
        const { connectionUri } = JSON.parse(decodeURIComponent(projectData.split('=')[1]));
        if (connectionUri) {
          setConnectionState({
            uri: connectionUri,
            isConnecting: false,
            error: null,
          });
          return connectionUri;
        }
      }

      const response = await fetch('/api/deploy-postgres', { method: 'POST' });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error.message);
      }

      setConnectionState({
        uri: data.result.connectionUri,
        isConnecting: false,
        error: null,
      });
      return data.result.connectionUri;
    } catch (error) {
      const errorMessage = `Failed to establish database connection: ${error.message}`;
      setConnectionState({
        uri: null,
        isConnecting: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  return { ...connectionState, connect };
};

const executeQueries = async (connectionUri, queries, options = { timeout: 30000 }) => {
  const pool = new Pool({ connectionString: connectionUri });
  const results = [];

  try {
    for (const query of queries) {
      const executionTime = Date.now();

      try {
        // Add query timeout
        const queryPromise = pool.query(query);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Query timeout')), options.timeout)
        );

        const queryResult = await Promise.race([queryPromise, timeoutPromise]);

        results.push({
          result: queryResult,
          success: true,
          error: null,
          queryTime: Date.now() - executionTime,
        });
      } catch (error) {
        results.push({
          result: null,
          success: false,
          error: {
            message: error.message,
            code: error.code || 'UNKNOWN_ERROR',
          },
          queryTime: Date.now() - executionTime,
        });

        // Break execution if it's a critical error
        if (error.code === '28P01' || error.code === '3D000') {
          break;
        }
      }
    }
  } finally {
    await pool.end();
  }

  return results;
};

export const SqlEditor = ({ defaultQuery, setupQuery: defaultSetupQuery }) => {
  const [query, setQuery] = useState(defaultQuery);
  const [setupQuery, setSetupQuery] = useState(
    defaultSetupQuery
      ? `-- The setup query runs once after the initial page loads. It will rerun after a page refresh.\n\n${defaultSetupQuery}`
      : defaultSetupQuery
  );
  const [hasRunSetupQuery, setHasRunSetupQuery] = useState(false);
  const [queryResults, setQueryResults] = useState([]);
  const [toastOpen, setToastOpen] = useState(false);
  const { isCopied, handleCopy } = useCopyToClipboard(3000);

  const { uri: connectionUri, isConnecting, error: connectionError, connect } = useDatabase();

  const { trigger: executeQuery, isMutating: isQueryLoading } = useSWRMutation(
    'query',
    async (key, { arg }) => {
      const { connectionUri, query } = arg;

      // Validate query
      if (!query.trim()) {
        throw new Error('Query cannot be empty');
      }

      const splits = semicolons.parseSplits(query, true);
      const queries = semicolons.nonEmptyStatements(query, splits.positions);

      if (queries.length === 0) {
        throw new Error('No valid queries found');
      }

      // Track analytics
      if (typeof window !== 'undefined' && window.zaraz) {
        window.zaraz.track('Queries ran', {
          text: 'Postgres Sandbox run query',
          queryCount: queries.length,
        });
      }

      return executeQueries(connectionUri, queries);
    }
  );

  const handleQuery = async (e) => {
    e.preventDefault();
    setQueryResults([]);

    try {
      // Ensure connection
      const currentConnectionUri = connectionUri || (await connect());

      // Run setup query if needed
      if (setupQuery && !hasRunSetupQuery) {
        const setupResults = await executeQuery({
          query: setupQuery,
          connectionUri: currentConnectionUri,
        });

        const setupError = setupResults.find((result) => !result.success);
        if (setupError) {
          throw new Error(`Setup query failed: ${setupError.error.message}`);
        }
        setHasRunSetupQuery(true);
      }

      // Execute main query
      const results = await executeQuery({
        query,
        connectionUri: currentConnectionUri,
      });

      setQueryResults(results);
    } catch (error) {
      setQueryResults([
        {
          success: false,
          result: null,
          error: {
            message: error.message,
            code: error.code || 'QUERY_ERROR',
          },
          queryTime: 0,
        },
      ]);
    }
  };

  return (
    <Toast.Provider swipeDirection="right">
      <Tooltip.Provider delayDuration={300}>
        <form onSubmit={handleQuery}>
          <div className="not-prose relative m-6 mx-auto w-full">
            <div className="group flex items-center justify-between gap-2 rounded-t-lg border-b border-gray-new-90 bg-gray-new-98 px-4 py-1.5 dark:border-gray-new-20 dark:bg-gray-new-10">
              <div />
              <div className="ml-auto flex items-center gap-2">
                {defaultSetupQuery && (
                  <SetupQueryDialog
                    setupQuery={setupQuery}
                    onSetupQueryChange={(value) => setSetupQuery(value)}
                  />
                )}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Button
                      theme="ghost"
                      size="xxs"
                      className="!p-2"
                      type="submit"
                      disabled={isQueryLoading}
                    >
                      {isQueryLoading ? (
                        <LoaderIcon className="h-4 w-4 animate-spin" />
                      ) : (
                        <PlayIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className="TooltipContent" sideOffset={5}>
                      <span className="block rounded-md bg-gray-new-98 px-3 py-2 text-sm leading-snug tracking-tight text-gray-new-20 shadow-lg dark:bg-gray-new-15 dark:text-gray-new-90">
                        Run query
                      </span>
                      <Tooltip.Arrow className="TooltipArrow fill-gray-new-98 dark:fill-gray-new-15" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </div>
            </div>

            <div className="group relative text-sm">
              <Editor
                value={query}
                theme="dark"
                basicSetup={{
                  foldGutter: false,
                  highlightActiveLineGutter: false,
                  crosshairCursor: true,
                  highlightActiveLine: false,
                  lineNumbers: false,
                }}
                extensions={[sql({ upperCaseKeywords: true })]}
                onChange={(value) => setQuery(value)}
                style={{
                  fontFamily:
                    'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                  lineHeight: '2',
                  height: '100%',
                  minHeight: '80px',
                  padding: '8px 10px',
                  borderRadius: queryResults?.length > 0 ? '0' : '0 0 8px 8px',
                }}
                className="bg-gray-new-10 [&>div]:!bg-gray-new-98 [&>div]:dark:!bg-gray-new-10 [&_.cm-focused]:outline-none"
              />
              <button
                theme="ghost"
                size="xxs"
                className="invisible absolute right-2 top-2  rounded border border-gray-7 bg-gray-9 p-1.5 text-gray-new-80 opacity-0 transition-[background-color,opacity,visibility] duration-200 hover:bg-white group-hover:visible group-hover:opacity-100 dark:border-gray-3 dark:bg-gray-new-10 dark:text-gray-8 dark:hover:bg-gray-new-8 lg:visible lg:opacity-100"
                type="button"
                onClick={() => handleCopy(query)}
                disabled={isCopied}
              >
                {isCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              </button>
            </div>

            {/* Results Panel */}
            <div className="relative">
              {queryResults?.length > 0 && <QueryResults queryResults={queryResults} />}
            </div>
          </div>
        </form>

        <Toast.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          duration={8000}
          className="data-[state=open]:animate-slideIn data-[state=closed]:animate-hide space-y-3 rounded-lg border border-gray-new-94 bg-white !p-4 text-gray-new-30 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:transition-[transform_200ms_ease-out] dark:border-[#16181D] dark:bg-[#0B0C0F] dark:text-gray-new-70 dark:shadow-[0px_14px_20px_0px_rgba(0,0,0,0.50)] "
        >
          <Toast.Title className="flex items-center gap-x-2 whitespace-nowrap leading-none tracking-[-0.01em]">
            Postgres database provisioned
          </Toast.Title>
          <Toast.Description className="text-sm">
            Provisioned a Postgres database. Get started with a free Neon account.
          </Toast.Description>

          <Toast.Action asChild altText="Sign up for Neon">
            <Button
              theme="primary"
              size="xxs"
              className="mt-2 w-full"
              onClick={() => window.open('https://console.neon.tech/sign_up', '_blank')}
            >
              Sign up →
            </Button>
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px] [&>li]:list-none [&>ol]:list-none" />
      </Tooltip.Provider>
    </Toast.Provider>
  );
};
