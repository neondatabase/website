'use client';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import parse from 'html-react-parser';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import CodeTabs from 'components/pages/doc/code-tabs';
import CodeBlockWrapper from 'components/shared/code-block-wrapper';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import highlight from 'lib/shiki';

const HighlightedCode = ({ code, language }) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    let cancelled = false;
    highlight(code, language).then((result) => {
      if (!cancelled) setHtml(result);
    });
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  if (!html) {
    return (
      <pre
        className="my-0 overflow-x-auto !bg-gray-new-98 p-4 text-sm leading-relaxed dark:!bg-gray-new-10"
        data-language={language}
      >
        <code>{code}</code>
      </pre>
    );
  }

  return <>{parse(html)}</>;
};

HighlightedCode.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
};

const LanguageSelect = ({ languages, value, onChange }) => {
  const selectedLanguage = languages.find((language) => language.key === value) ?? languages[0];

  return (
    <Listbox value={selectedLanguage.key} onChange={onChange}>
      <div className="flex items-center gap-2">
        <span className="sr-only">Select language</span>
        <ListboxButton className="group flex h-8 min-w-30 cursor-pointer items-center justify-between gap-3 border border-gray-new-80 bg-transparent px-3 pr-0 text-left text-sm text-gray-new-20 transition-colors hover:border-gray-new-60 focus-visible:border-secondary-8 focus-visible:outline-none data-open:border-secondary-8 dark:border-gray-new-20 dark:text-gray-new-90 dark:hover:border-gray-new-30 dark:focus-visible:border-primary-1 dark:data-open:border-primary-1">
          <span>{selectedLanguage.label}</span>
          <div className="flex h-full w-5.5 items-center justify-center border-l border-gray-new-80 dark:border-gray-new-20">
            <ChevronIcon className="mx-auto size-3.5 shrink-0 text-gray-new-50 transition-transform duration-200 group-data-open:rotate-180 dark:text-gray-new-60" />
          </div>
        </ListboxButton>
      </div>

      <ListboxOptions
        anchor="bottom start"
        className="z-50 w-(--button-width) border border-gray-new-80 bg-white p-1 text-sm text-gray-new-20 shadow-lg transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0 dark:border-gray-new-20 dark:bg-black-new dark:text-gray-new-90"
        modal={false}
        transition
      >
        {languages.map((language) => (
          <ListboxOption
            key={language.key}
            value={language.key}
            className="group flex min-h-8 cursor-pointer items-center gap-3 px-2.5 py-1.5 transition-colors select-none data-focus:bg-gray-new-94 data-selected:bg-gray-new-98 dark:data-focus:bg-gray-new-15 dark:data-selected:bg-gray-new-10"
          >
            <span>{language.label}</span>
            <svg
              viewBox="0 0 10 10"
              className="ml-auto size-2.5 shrink-0 text-secondary-8 opacity-0 group-data-selected:opacity-100 dark:text-primary-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden
            >
              <path d="M1.5 5 L4 7.5 L8.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};

LanguageSelect.propTypes = {
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const ModelDetailClient = ({ row, snippets, initialMode }) => {
  const router = useRouter();
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const languages = useMemo(() => {
    const all = snippets.tabs[mode]?.languages ?? [];
    // Mastra can't reach Responses-only (Codex) models through the
    // OpenAI-compatible endpoint yet, so drop it for those in the text tab.
    if (mode === 'text' && row.isResponsesOnly) {
      return all.filter((language) => language.key !== 'mastra');
    }
    return all;
  }, [snippets, mode, row.isResponsesOnly]);

  const [langKey, setLangKey] = useState(languages[0]?.key);

  useEffect(() => {
    setLangKey((currentKey) =>
      languages.some((language) => language.key === currentKey) ? currentKey : languages[0]?.key
    );
  }, [languages]);

  const activeLang = languages.find((language) => language.key === langKey) ?? languages[0];
  if (!activeLang) return null;

  const placeholder = snippets.modelIdPlaceholder;
  const codeForModel = activeLang.code.split(placeholder).join(row.id);
  const codeFilename =
    { typescript: 'index.ts', python: 'main.py', bash: 'request.sh' }[activeLang.lang] || 'snippet';

  const changeMode = (nextMode) => {
    setMode(nextMode);

    const url = new URL(window.location.href);
    if (nextMode === 'image') url.searchParams.set('mode', 'image');
    else url.searchParams.delete('mode');
    router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false });
  };

  return (
    <div className="not-prose mt-6 flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        {row.isImageCapable && (
          <div
            className="inline-flex h-9 border border-gray-new-80 bg-white p-0.75 dark:border-gray-new-20 dark:bg-black-new"
            role="group"
            aria-label="Select model mode"
          >
            {['text', 'image'].map((modeKey) => (
              <button
                key={modeKey}
                type="button"
                aria-pressed={mode === modeKey}
                className={
                  mode === modeKey
                    ? 'bg-gray-new-94 px-2 text-[.8125rem] font-medium text-gray-new-10 dark:bg-[#1D1E20] dark:text-white'
                    : 'px-2 text-[.8125rem] font-medium text-gray-new-50 transition-colors hover:text-gray-new-30 focus-visible:outline-gray-new-30 dark:text-[#8E9196] dark:hover:text-gray-new-80 dark:focus-visible:outline-gray-new-60'
                }
                onClick={() => changeMode(modeKey)}
              >
                {modeKey === 'text' ? 'Text' : 'Image'}
              </button>
            ))}
          </div>
        )}

        <LanguageSelect languages={languages} value={activeLang.key} onChange={setLangKey} />
      </div>

      {activeLang.install && (
        <CodeBlockWrapper
          className="rounded-none border border-gray-new-80 dark:border-gray-new-20 [&>pre]:my-0 [&>pre]:rounded-none [&>pre]:bg-white! [&>pre]:py-4 [&>pre]:dark:bg-black-pure!"
          as="div"
          copyCode={activeLang.install}
          copyButtonClassName="visible! opacity-100!"
        >
          <HighlightedCode code={activeLang.install} language="bash" />
        </CodeBlockWrapper>
      )}

      <CodeTabs labels={[codeFilename, '.env']} bodyClassName="bg-white dark:bg-black-pure">
        <CodeBlockWrapper
          className="[&>pre]:my-0 [&>pre]:rounded-none [&>pre]:bg-white! [&>pre]:py-4 [&>pre]:dark:bg-black-pure!"
          as="div"
          copyCode={codeForModel}
        >
          <HighlightedCode code={codeForModel} language={activeLang.lang} />
        </CodeBlockWrapper>
        <CodeBlockWrapper
          className="[&>pre]:my-0 [&>pre]:rounded-none [&>pre]:bg-white! [&>pre]:py-4 [&>pre]:dark:bg-black-pure!"
          as="div"
          copyCode={snippets.envExample}
        >
          <HighlightedCode code={snippets.envExample} language="bash" />
        </CodeBlockWrapper>
      </CodeTabs>
    </div>
  );
};

ModelDetailClient.propTypes = {
  row: PropTypes.object.isRequired,
  initialMode: PropTypes.oneOf(['text', 'image']).isRequired,
  snippets: PropTypes.shape({
    modelIdPlaceholder: PropTypes.string.isRequired,
    tabs: PropTypes.object.isRequired,
    envExample: PropTypes.string.isRequired,
  }).isRequired,
};

export default ModelDetailClient;
