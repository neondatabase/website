// Shared style constants for API reference components.
// Used by ApiMethodBadge, ApiResponse, ApiParam, and their tests so that
// color tweaks live in one place and tests catch unintended changes.

export const METHOD_STYLES = {
  GET: 'text-[#00B87B] dark:text-green-45 bg-[#00B87B]/10 dark:bg-green-45/10 border-[#00B87B]/20 dark:border-green-45/20',
  POST: 'text-[#426CE0] dark:text-blue-70 bg-[#426CE0]/10 dark:bg-blue-70/10 border-[#426CE0]/20 dark:border-blue-70/20',
  PUT: 'text-[#BE8A3C] dark:text-brown-70 bg-[#BE8A3C]/10 dark:bg-brown-70/10 border-[#BE8A3C]/20 dark:border-brown-70/20',
  PATCH:
    'text-[#E9943E] dark:text-yellow-70 bg-[#E9943E]/10 dark:bg-yellow-70/10 border-[#E9943E]/20 dark:border-yellow-70/20',
  DELETE:
    'text-[#E2301D] dark:text-[#FF5645] bg-[#E2301D]/10 dark:bg-[#FF5645]/10 border-[#E2301D]/20 dark:border-[#FF5645]/20',
};

export const METHOD_FALLBACK_STYLE =
  'text-gray-new-50 dark:text-gray-new-80 bg-gray-new-50/10 dark:bg-gray-new-80/10 border-gray-new-50/20 dark:border-gray-new-80/20';

export const TYPE_STYLES = {
  string: 'text-[#426CE0] dark:text-blue-70 bg-[#426CE0]/10 dark:bg-blue-70/10',
  integer: 'text-[#8458D0] dark:text-purple-70 bg-[#8458D0]/10 dark:bg-purple-70/10',
  number: 'text-[#8458D0] dark:text-purple-70 bg-[#8458D0]/10 dark:bg-purple-70/10',
  boolean: 'text-[#BE8A3C] dark:text-brown-70 bg-[#BE8A3C]/10 dark:bg-brown-70/10',
  object: 'text-gray-new-40 dark:text-gray-new-70 bg-gray-new-40/10 dark:bg-gray-new-70/10',
  array: 'text-gray-new-40 dark:text-gray-new-70 bg-gray-new-40/10 dark:bg-gray-new-70/10',
};

// Text-color class for a JSON-ish type, used in inline schema renderings
// where the type isn't shown as a badge (e.g. body field value previews).
export const getTypeColor = (type) => {
  if (!type) return 'text-gray-new-40 dark:text-gray-new-70';
  if (type === 'string') return 'text-[#CE9178]';
  if (type === 'integer' || type === 'number') return 'text-[#B5CEA8]';
  if (type === 'boolean') return 'text-[#569CD6]';
  return 'text-gray-new-40 dark:text-gray-new-70';
};

// VS Code-style palette for the client-side JSON syntax highlighter
// (see JsonHighlightValue in operation-shared.jsx). Used as inline `style`
// values, NOT Tailwind class arbitrary values, so it's safe to interpolate.
export const JSON_SYNTAX_COLORS = {
  keyword: '#569CD6', // null, true, false
  number: '#B5CEA8',
  string: '#CE9178',
  key: '#9CDCFE',
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
