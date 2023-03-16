export default async function exit(req, res) {
  // Exit the current user from "Preview Mode". This function accepts no args.
  const { slug, pageType } = req.query;

  if (pageType === 'blog') {
    res.clearPreviewData({ path: `/blog/${slug}` });
  } else {
    res.clearPreviewData({});
  }

  // Redirect the user back to the index page.
  res.writeHead(307, { Location: '/' });
  res.end();
}
