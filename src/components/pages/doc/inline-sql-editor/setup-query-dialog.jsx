import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Editor, { EditorView } from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import Button from 'components/shared/button';
import CloseIcon from './images/close.inline.svg';
import SettingsIcon from './images/settings.inline.svg';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import CopyIcon from './images/copy.inline.svg';
import CheckIcon from './images/check.inline.svg';

export const SetupQueryDialog = ({ setupQuery, onSetupQueryChange }) => {
  const { isCopied, handleCopy } = useCopyToClipboard(3000);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button theme="ghost" size="xxs" className="!p-2">
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[150] bg-[rgba(12,13,13,0.2)] data-[state=closed]:animate-fade-out-overlay data-[state=open]:animate-fade-in-overlay dark:bg-black/80" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[150] mx-auto max-h-[85vh] w-full max-w-[756px] -translate-x-1/2 -translate-y-1/2 lg:h-full lg:max-h-full lg:max-w-full">
          <div className="relative flex h-full max-h-[85vh] flex-col rounded-[10px] border border-gray-new-20 bg-gray-new-8 pt-4 text-white shadow-[4px_4px_10px_rgba(0,0,0,0.5)] data-[state=closed]:animate-dialog-hide data-[state=open]:animate-dialog-show lg:h-full lg:max-h-screen lg:rounded-none">
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
            <div className="bg-gray-new-10">
              <div className="group relative">
                <Editor
                  className="[&>div]:!bg-gray-new-98 [&>div]:dark:!bg-gray-new-10 [&_.cm-focused]:outline-none"
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
                  onChange={onSetupQueryChange}
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
                />

                <button
                  theme="ghost"
                  size="xxs"
                  className="invisible absolute right-2 top-2 rounded border border-gray-7 bg-gray-9 p-1.5 text-gray-new-80 opacity-0 transition-[background-color,opacity,visibility] duration-200 hover:bg-white group-hover:visible group-hover:opacity-100 dark:border-gray-3 dark:bg-gray-new-10 dark:text-gray-8 dark:hover:bg-gray-new-8 lg:visible lg:opacity-100"
                  type="button"
                  onClick={() => handleCopy(setupQuery)}
                  disabled={isCopied}
                >
                  {isCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end px-6 py-4">
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
