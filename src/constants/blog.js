const BLOG_BASE_PATH = '/blog/';
const BLOG_CATEGORY_BASE_PATH = `${BLOG_BASE_PATH}category/`;
const BLOG_POSTS_PER_PAGE = 500;
const CATEGORY_COLORS = {
  company: 'text-green-45',
  engineering: 'text-purple-70',
  community: 'text-yellow-70',
  ai: 'text-blue-80',
  'case-study': 'text-pink-90',
  workflows: 'text-blue-80',
  guides: 'text-green-45',
  changelog: 'text-blue-80',
};

const CATEGORY_BG_COLORS = {
  company: 'bg-green-45/10',
  engineering: 'bg-purple-70/10',
  community: 'bg-yellow-70/10',
  ai: 'bg-blue-80/10',
  'case-study': 'bg-pink-90/10',
  workflows: 'bg-blue-80/10',
};

export {
  BLOG_BASE_PATH,
  BLOG_POSTS_PER_PAGE,
  CATEGORY_COLORS,
  CATEGORY_BG_COLORS,
  BLOG_CATEGORY_BASE_PATH,
};
