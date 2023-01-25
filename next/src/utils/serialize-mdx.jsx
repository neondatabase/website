import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';

const serializeMdx = async (content) => {
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [[remarkGfm]],
    },
  });

  return mdxSource;
};

export default serializeMdx;
