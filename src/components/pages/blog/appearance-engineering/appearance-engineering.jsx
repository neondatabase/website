import Image from 'next/image';
import PropTypes from 'prop-types';

import BlogPostCard from 'components/pages/blog/blog-post-card';
import Link from 'components/shared/link/link';

import { BlogPostCardPropTypes } from '../blog-post-card/blog-post-card';

import PlayIcon from './images/play.inline.svg';

const AppearanceEngineering = ({ appearancesPosts, engineeringPosts }) => (
  <section className="appearance-engineering grid grid-cols-10 gap-x-10 2xl:gap-x-6 lt:grid-cols-12 md:gap-y-20">
    <div className="col-span-4 xl:mr-4 lt:col-span-5 lt:mr-0 md:col-span-full">
      <h2 className="flex items-center text-xs font-semibold uppercase leading-none tracking-[0.02em] text-blue-80">
        <span>Appearances</span>
        <span className="ml-2 h-px grow bg-gray-new-20" />
      </h2>
      <ul>
        {appearancesPosts.map(
          (
            {
              post: {
                title,
                appearancePost: { url, coverImage },
              },
            },
            index
          ) => (
            <li key={index} className="mt-6 lg:mt-5 md:mt-6 md:first:mt-5">
              <Link className="group group flex items-center space-x-4" to={url}>
                {coverImage ? (
                  <Image
                    className="rounded-md xl:h-[74px] xl:w-[74px] lg:h-[72px] lg:w-[72px] md:h-[68px] md:w-[68px]"
                    src={coverImage?.mediaItemUrl}
                    alt={coverImage?.altText || title}
                    width={112}
                    height={112}
                  />
                ) : (
                  <img
                    className="h-28 w-28 rounded-md bg-gray-new-30"
                    src={`data:image/svg+xml;charset=utf-8,%3Csvg width='${112}' height='${112}' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E`}
                    alt=""
                    width={112}
                    height={112}
                    aria-hidden
                  />
                )}

                <div>
                  <h3 className="line-clamp-2 text-lg font-medium leading-tight tracking-[-0.02em] transition-colors duration-200 group-hover:text-green-45 lg:text-base">
                    {title}
                  </h3>
                  <div className="mt-2 flex items-center">
                    <PlayIcon className="mr-2 inline-block" />
                    <span className="text-sm font-medium leading-tight tracking-[-0.02em] text-blue-80 transition-colors duration-200 group-hover:text-[#C2E8F0]">
                      Listen now
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
    <div className="col-span-6 flex flex-col xl:-ml-4 lt:col-span-7 lt:ml-0 md:col-span-full">
      <h2 className="flex items-center text-xs font-semibold uppercase leading-none tracking-[0.02em] text-[#B8ADEB]">
        <span>Engineering</span>
        <span className="ml-2 h-px grow bg-gray-new-20" />
      </h2>
      <div className="mt-6 grid grid-cols-6 gap-x-10 2xl:gap-x-6 lt:col-span-4 lt:grid-cols-7 lg:mt-5 md:gap-y-10">
        <div className="col-span-4 xl:col-span-3 xl:-mr-12 lt:col-span-4 lt:mr-0 md:col-span-full">
          {engineeringPosts.slice(0, 1).map(({ post }, index) => (
            <BlogPostCard className="pb-[18px] lg:pb-2.5" {...post} size="md" key={index} />
          ))}
          {engineeringPosts.slice(1, 3).map(({ post }, index) => (
            <BlogPostCard
              className="border-t border-gray-new-15 py-[18px] last:pb-0 lg:py-4"
              {...post}
              size="xs"
              key={index}
            />
          ))}
        </div>
        <div className="col-span-2 flex flex-col gap-y-7 xl:col-span-3 xl:ml-12 lt:ml-0 md:col-span-full md:grid md:grid-cols-2 md:gap-x-6 xs:grid-cols-1 xs:gap-y-10">
          {engineeringPosts.slice(3, 5).map(({ post }, index) => (
            <BlogPostCard {...post} size="sm" key={index} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

AppearanceEngineering.propTypes = {
  appearancesPosts: PropTypes.arrayOf(
    PropTypes.shape({
      post: PropTypes.shape({
        title: PropTypes.string,
        appearancePost: PropTypes.shape({
          url: PropTypes.string,
          coverImage: PropTypes.shape({
            mediaItemUrl: PropTypes.string,
            altText: PropTypes.string,
          }),
        }),
      }),
    })
  ),
  engineeringPosts: PropTypes.arrayOf(
    PropTypes.shape({
      post: PropTypes.shape({
        ...BlogPostCardPropTypes,
      }),
    })
  ),
};

export default AppearanceEngineering;
