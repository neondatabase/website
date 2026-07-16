// Shared style constants for API reference components.
// Used by ApiMethodBadge, ApiResponse, ApiParam, and their tests so that
// color tweaks live in one place and tests catch unintended changes.

export const METHOD_STYLES = {
  GET: 'text-[#00B87B] dark:text-green-45 bg-transparent border-[#00B87B]/40 dark:border-green-45/40',
  POST: 'text-[#426CE0] dark:text-blue-70 bg-transparent border-[#426CE0]/40 dark:border-blue-70/40',
  PUT: 'text-[#BE8A3C] dark:text-brown-70 bg-transparent border-[#BE8A3C]/40 dark:border-brown-70/40',
  PATCH:
    'text-[#E9943E] dark:text-yellow-70 bg-transparent border-[#E9943E]/40 dark:border-yellow-70/40',
  DELETE:
    'text-[#E2301D] dark:text-[#FF5645] bg-transparent border-[#E2301D]/40 dark:border-[#FF5645]/40',
};

export const METHOD_FALLBACK_STYLE =
  'text-gray-new-50 dark:text-gray-new-80 bg-transparent border-gray-new-70 dark:border-gray-new-30';

export const METHOD_TEXT_STYLES = {
  GET: 'text-[#00B87B] dark:text-green-45',
  POST: 'text-[#426CE0] dark:text-blue-70',
  PUT: 'text-[#BE8A3C] dark:text-brown-70',
  PATCH: 'text-[#E9943E] dark:text-yellow-70',
  DELETE: 'text-[#E2301D] dark:text-[#FF5645]',
};

export const METHOD_TEXT_FALLBACK_STYLE = 'text-gray-new-50 dark:text-gray-new-60';

export const INLINE_CODE_STYLES =
  '[&_code]:my-px [&_code]:inline-flex [&_code]:items-center [&_code]:justify-center [&_code]:rounded [&_code]:border [&_code]:border-gray-new-70 [&_code]:bg-transparent [&_code]:px-1! [&_code]:py-px! [&_code]:font-mono! [&_code]:text-sm [&_code]:leading-[1.2] [&_code]:font-normal! [&_code]:tracking-extra-tight [&_code]:break-words [&_code]:text-black-pure! dark:[&_code]:border-gray-new-30 dark:[&_code]:bg-transparent dark:[&_code]:text-white!';

export const TYPE_STYLES = {
  string:
    'border border-[#426CE0]/40 text-[#426CE0] dark:border-blue-70/40 dark:text-blue-70 bg-transparent',
  integer:
    'border border-[#8458D0]/40 text-[#8458D0] dark:border-purple-70/40 dark:text-purple-70 bg-transparent',
  number:
    'border border-[#8458D0]/40 text-[#8458D0] dark:border-purple-70/40 dark:text-purple-70 bg-transparent',
  boolean:
    'border border-[#BE8A3C]/40 text-[#BE8A3C] dark:border-brown-70/40 dark:text-brown-70 bg-transparent',
  object:
    'border border-gray-new-70 text-gray-new-40 dark:border-gray-new-30 dark:text-gray-new-70 bg-transparent',
  array:
    'border border-gray-new-70 text-gray-new-40 dark:border-gray-new-30 dark:text-gray-new-70 bg-transparent',
};

// Text-color class for a JSON-ish type, used in inline schema renderings
// where the type isn't shown as a badge (e.g. body field value previews).
export const getTypeColor = (type) => {
  if (!type) return 'text-gray-new-40 dark:text-gray-new-70';
  if (type === 'string') return 'text-[var(--shiki-token-string)]';
  if (type === 'integer' || type === 'number') return 'text-[var(--shiki-token-constant)]';
  if (type === 'boolean') return 'text-[var(--shiki-token-keyword)]';
  return 'text-gray-new-40 dark:text-gray-new-70';
};

// Client-side JSON/schema highlighter colors. These point at the same CSS
// variables used by Shiki so light and dark docs themes share one palette.
export const JSON_SYNTAX_COLORS = {
  keyword: 'var(--shiki-token-keyword)', // null, true, false
  number: 'var(--shiki-token-constant)',
  string: 'var(--shiki-token-string)',
  key: 'var(--shiki-token-string-expression)',
};

// Status code colors are intentionally aliased to the corresponding HTTP
// method colors — keeps the palette consistent (a 500 is "as bad as DELETE",
// a 400 is "as cautious as PATCH", etc.) and means a method-color tweak
// flows through to status pills automatically.
export const getStatusStyle = (status) => {
  const code = parseInt(status, 10);
  if (code >= 500) return METHOD_STYLES.DELETE;
  if (code >= 400) return METHOD_STYLES.PATCH;
  if (code >= 300) return METHOD_STYLES.POST;
  return METHOD_STYLES.GET;
};
