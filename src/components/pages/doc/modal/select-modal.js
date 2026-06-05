const normalizePath = (path) => {
  if (!path) return '/';

  const normalizedPath = `/${path}`.replace(/\/+/g, '/');

  return normalizedPath.length > 1 ? normalizedPath.replace(/\/$/, '') : normalizedPath;
};

const matchesFolder = (pathname, folder) => {
  const normalizedFolder = normalizePath(folder);

  return pathname === normalizedFolder || pathname.startsWith(`${normalizedFolder}/`);
};

const getMatchPriority = (modal, pathname) => {
  const { targeting } = modal;

  if (!targeting) return 1;

  const pages = targeting.pages?.map(normalizePath) ?? [];
  if (pages.includes(pathname)) return 3;

  const folders = targeting.folders ?? [];
  if (folders.some((folder) => matchesFolder(pathname, folder))) return 2;

  if (targeting.all) return 1;

  return 0;
};

const selectModal = (modals, pathname) => {
  const normalizedPathname = normalizePath(pathname);

  return modals.reduce(
    (selection, modal) => {
      const priority = getMatchPriority(modal, normalizedPathname);

      return priority > selection.priority ? { modal, priority } : selection;
    },
    { modal: null, priority: 0 }
  ).modal;
};

export { normalizePath };
export default selectModal;
