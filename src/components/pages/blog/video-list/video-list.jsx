import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import getFormattedDate from 'utils/get-formatted-date';

const VideoList = ({ videos }) => (
  <section className="videos flex flex-col">
    <h2 className="flex items-center text-xs font-semibold uppercase leading-none tracking-[0.02em] text-pink-90">
      <span>Video</span>
      <span className="ml-2 h-px grow bg-gray-new-20" />
    </h2>
    <div className="mt-6 grid grid-cols-3 gap-x-10">
      {videos.map(
        (
          {
            video: {
              title,
              date,
              videoPost: { url, coverImage, author },
            },
          },
          index
        ) => {
          const formattedDate = getFormattedDate(date);
          return (
            <Link className="group" to={url} key={index} target="_blank" rel="noopener noreferrer">
              <article>
                {coverImage?.mediaItemUrl ? (
                  <Image
                    className="w-full rounded-md"
                    src={coverImage?.mediaItemUrl}
                    alt={coverImage?.altText || title}
                    width={716}
                    height={370}
                  />
                ) : (
                  <img
                    className="w-full rounded-md bg-gray-new-30"
                    src={`data:image/svg+xml;charset=utf-8,%3Csvg width='${716}' height='${370}' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E`}
                    alt=""
                    width={716}
                    height={370}
                    aria-hidden
                  />
                )}
                <h1 className="mt-4 text-lg font-medium leading-tight tracking-[-0.02em] transition-colors duration-200 group-hover:text-green-45">
                  {title}
                </h1>
                <div className="mt-2.5 flex items-center">
                  <Image
                    className="mr-2 rounded-full"
                    src={author.postAuthor?.image?.mediaItemUrl}
                    alt={author?.title}
                    width={28}
                    height={28}
                  />

                  <div className="flex items-center lg:flex-col lg:items-start md:flex-row md:items-center">
                    <span className="truncate text-sm leading-tight tracking-[-0.02em] text-gray-new-90">
                      {author?.title}
                    </span>

                    <span
                      className="relative block shrink-0 pl-5 text-[13px] font-light uppercase leading-none tracking-[-0.02em] text-gray-new-80 before:absolute before:left-2.5 before:top-1/2 before:inline-block before:h-[3px] before:w-[3px] before:rounded-full before:bg-gray-new-30 lg:mt-1 lg:pl-0 lg:before:hidden md:mt-0 md:pl-5 md:before:inline-block"
                      dateTime={date}
                    >
                      {formattedDate}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          );
        }
      )}
    </div>
    <Link
      className="ml-auto inline-flex items-center text-sm font-medium leading-none tracking-[-0.02em] text-pink-90"
      to="https://www.youtube.com/@neondatabase/videos"
      withArrow
    >
      All videos
    </Link>
  </section>
);

VideoList.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      video: PropTypes.shape({
        title: PropTypes.string,
        date: PropTypes.string,
        videoPost: PropTypes.shape({
          url: PropTypes.string,
          coverImage: PropTypes.shape({
            mediaItemUrl: PropTypes.string,
            altText: PropTypes.string,
          }),
        }),
      }),
    })
  ),
};

export default VideoList;
