const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const DRAFT_FILTER = IS_PRODUCTION ? [false] : [true, false];

const POST_REQUIRED_FIELDS = ['title', 'description', 'author'];
const STATIC_PAGE_REQUIRED_FIELDS = ['title'];
const DOC_REQUIRED_FIELDS = ['title'];

module.exports = {
  IS_PRODUCTION,
  DRAFT_FILTER,
  POST_REQUIRED_FIELDS,
  STATIC_PAGE_REQUIRED_FIELDS,
  DOC_REQUIRED_FIELDS,
};
