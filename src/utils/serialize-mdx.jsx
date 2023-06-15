import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';

const serializeMdx = async (content) => {
  const mdxSource = await serialize(content, {
    mdxOptions: {
      development: process.env.NODE_ENV === 'development',
      remarkPlugins: [[remarkGfm]],
    },
  });

  return mdxSource;
};

export default serializeMdx;
