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
  const destinationPath = modal.destination?.url;

  if (destinationPath?.startsWith('/') && normalizePath(destinationPath) === pathname) return 0;

  if (!targeting) return 1;

  const pages = targeting.pages?.map(normalizePath) ?? [];
  if (pages.includes(pathname)) return 3;

  const folders = targeting.folders ?? [];
  if (folders.some((folder) => matchesFolder(pathname, folder))) return 2;

  if (targeting.all) return 1;

  return 0;
};

// Every page that embeds a video is the destination of one of these modals. Don't stack a floating
// modal on top of an inline video, so show no modal on any internal destination page.
const isEmbedHome = (modals, pathname) =>
  modals.some(
    (modal) =>
      modal.destination?.url?.startsWith('/') && normalizePath(modal.destination.url) === pathname
  );

const selectModal = (modals, pathname) => {
  const normalizedPathname = normalizePath(pathname);

  if (isEmbedHome(modals, normalizedPathname)) return null;

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
