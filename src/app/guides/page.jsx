/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import Link from 'components/shared/link/link';
import LINKS from 'constants/links';
import { getAllPosts } from 'utils/api-guides';
import getMetadata from 'utils/get-metadata';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  if (!posts) return notFound();
  return posts.map(({ slug }) => {
    const slugsArray = slug.split('/');
    return {
      slug: slugsArray,
    };
  });
}

export async function generateMetadata() {
  // TO-DO: Update real data here
  return getMetadata({
    title: 'Neon Guides',
    // description: '',
    // type: '',
  });
}

export default async function GuidePage() {
  const posts = await getAllPosts();
  // TO-DO: Update text here
  if (!posts) return 'No guides yet';

  return (
    <div className="col-span-6 col-start-4 -mx-10 flex flex-col 2xl:col-span-7 2xl:mx-5 xl:col-span-9 xl:ml-11 xl:mr-0 xl:max-w-[750px] lg:ml-0 lg:max-w-none lg:pt-0 md:mx-auto md:pb-[70px] sm:pb-8">
      <ul className="flex flex-col space-y-6">
        {posts.map(({ title, slug }) => (
          <li key={slug}>
            <Link className="group" to={`${LINKS.guides}/${slug}`}>
              <article className="flex items-center space-x-3">
                <div>
                  <h1 className="line-clamp-2 text-[18px] font-semibold leading-tight tracking-[-0.02em] transition-colors duration-200 group-hover:text-green-45">
                    {title}
                  </h1>
                </div>
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
