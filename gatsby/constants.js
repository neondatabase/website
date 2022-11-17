const DRAFT_FILTER = process.env.IS_PRODUCTION === 'true' ? [false] : [true, false];

const POST_REQUIRED_FIELDS = ['title', 'description', 'author'];
const STATIC_PAGE_REQUIRED_FIELDS = ['title'];
const DOC_REQUIRED_FIELDS = ['title'];
const RELEASE_NOTES_REQUIRED_FIELDS = ['label'];

module.exports = {
  DRAFT_FILTER,
  POST_REQUIRED_FIELDS,
  STATIC_PAGE_REQUIRED_FIELDS,
  DOC_REQUIRED_FIELDS,
  RELEASE_NOTES_REQUIRED_FIELDS,
};
