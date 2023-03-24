export default async function preview(req, res) {
  const { data } = req.query;

  // Parse data considering it's a json in a base64 string
  const {
    id,
    post_type: postType,
    post_status: postStatus,
    secret,
    permalink,
  } = JSON.parse(Buffer.from(data, 'base64').toString());

  // Check the secret and next parameters
  // This secret should only be known by this API route
  if (secret !== process.env.WP_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (postType !== 'post') {
    return res.status(401).json({ message: 'Preview functionality only works for blog posts' });
  }

  const blogPostPath = `/blog/${permalink}`;

  // Enable Preview Mode by setting the cookies
  res.setPreviewData(
    {
      id,
      slug: permalink,
      status: postStatus,
    },
    {
      path: blogPostPath,
    }
  );

  // Redirect to the path from the fetched post
  // We don't redirect to `req.query.slug` as that might lead to open redirect vulnerabilities
  res.writeHead(307, { Location: blogPostPath });
  res.end();
}
