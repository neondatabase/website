/* eslint-disable import/prefer-default-export */
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const data = searchParams.get('data');

  const {
    id,
    post_type: postType,
    post_status: postStatus,
    secret,
    permalink,
  } = JSON.parse(Buffer.from(data, 'base64').toString());

  if (secret !== process.env.WP_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  if (postType !== 'post' && postType !== 'page') {
    return new Response('Preview functionality only works for blog posts and pages', {
      status: 401,
    });
  }

  draftMode().enable();

  const redirectSearchParams = new URLSearchParams({
    id,
    status: postStatus,
  });

  const slug = permalink && postStatus === 'publish' ? permalink : 'wp-draft-post-preview-page';

  postType === 'page'
    ? redirect(`/${slug}?${redirectSearchParams.toString()}`)
    : redirect(`/blog/${slug}?${redirectSearchParams.toString()}`);
}
