import { sql } from '@codemirror/lang-sql';
import * as Dialog from '@radix-ui/react-dialog';
import Editor, { EditorView } from '@uiw/react-codemirror';
import PropTypes from 'prop-types';
import * as React from 'react';

import Button from 'components/shared/button';
import Tooltip from 'components/shared/tooltip';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';

import CheckIcon from './images/check.inline.svg';
import CloseIcon from './images/close.inline.svg';
import CopyIcon from './images/copy.inline.svg';
import SettingsIcon from './images/settings.inline.svg';

export const SetupQueryDialog = ({ setupQuery, onSetupQueryChange }) => {
  const { isCopied, handleCopy } = useCopyToClipboard(3000);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button theme="ghost" size="xxs" className="!p-2" data-tooltip-id="setup-query-tooltip">
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </Dialog.Trigger>
      <Tooltip
        id="setup-query-tooltip"
        content="Configure initial setup query"
        place="top"
        arrowColor="inherit"
      />
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[150] bg-[rgba(12,13,13,0.2)] data-[state=closed]:animate-fade-out-overlay data-[state=open]:animate-fade-in-overlay dark:bg-black/80" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[150] mx-auto max-h-[85vh] w-[calc(100%-32px)] max-w-[756px] -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex h-full max-h-[85vh] flex-col rounded-[10px] border border-gray-new-90 bg-white pt-4 text-black shadow-[4px_4px_10px_rgba(0,0,0,0.06)] data-[state=closed]:animate-dialog-hide data-[state=open]:animate-dialog-show dark:border-gray-new-20 dark:bg-gray-new-8 dark:text-white dark:shadow-[4px_4px_10px_rgba(0,0,0,0.2)]">
            <div className="mb-4 flex items-center justify-between px-6">
              <Dialog.Title className="text-lg font-medium">Setup Query</Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="absolute right-5 top-4 flex h-6 w-6 items-center justify-center"
                  aria-label="Close"
                  type="button"
                >
                  <CloseIcon className="h-4 w-4 text-gray-new-60 dark:text-gray-new-50" />
                </button>
              </Dialog.Close>
            </div>
            <div className="flex-1 bg-gray-new-94 dark:bg-gray-new-10">
              <div className="group relative">
                <Editor
                  className="bg-gray-new-98 dark:bg-gray-new-10 [&>div]:!bg-gray-new-98 [&>div]:dark:!bg-gray-new-10 [&_.cm-focused]:outline-none"
                  value={setupQuery}
                  theme="dark"
                  basicSetup={{
                    foldGutter: false,
                    highlightActiveLineGutter: false,
                    lineNumbers: false,
                    crosshairCursor: true,
                    highlightActiveLine: false,
                  }}
                  extensions={[sql({ upperCaseKeywords: true }), EditorView.lineWrapping]}
                  minHeight="auto"
                  style={{
                    fontFamily:
                      'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    overflow: 'auto',
                    lineHeight: '2',
                    height: '100%',
                    minHeight: '200px',
                    padding: '8px 10px',
                  }}
                  onChange={onSetupQueryChange}
                />

                <button
                  theme="ghost"
                  size="xxs"
                  className="absolute right-2 top-2 rounded border border-gray-new-90 bg-white p-1.5 text-gray-new-80 opacity-0 transition-[background-color,opacity,visibility] duration-200 hover:bg-gray-new-94 group-hover:visible group-hover:opacity-100 dark:border-gray-new-20 dark:bg-gray-new-10 dark:text-gray-new-80 dark:hover:bg-gray-new-15"
                  type="button"
                  disabled={isCopied}
                  onClick={() => handleCopy(setupQuery)}
                >
                  {isCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end rounded-b-lg bg-white px-6 py-4 dark:bg-gray-new-8">
              <Dialog.Close asChild>
                <Button theme="gray-15" size="xxs" className="!px-4 !py-2">
                  Save
                </Button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

SetupQueryDialog.propTypes = {
  setupQuery: PropTypes.string.isRequired,
  onSetupQueryChange: PropTypes.func.isRequired,
};
