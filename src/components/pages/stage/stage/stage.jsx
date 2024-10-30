'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

import Button from 'components/shared/button';
import TwitterShareButton from 'components/shared/twitter-share-button';
import { DEPLOY_AGENDA } from 'constants/deploy';

// TODO: Replace with actual video
const DEPLOY_STAGE_VIDEO =
  'https://www.youtube.com/embed/Mz4OsXP6dvc?autoplay=1&vq=hd1080&mute=1&rel=0&start=';

const Stage = () => {
  const [videoSource, setVideoSource] = useState(DEPLOY_STAGE_VIDEO);

  return (
    <>
      <div className="flex flex-col bg-live-video">
        <h1 className="sr-only">Neon Developer Days Live translation</h1>
        <div className="flex grow items-center">
          <div className="relative w-full pb-[56.25%]">
            <iframe
              className="absolute left-0 top-0 h-full w-full"
              allow="autoplay; picture-in-picture; web-share"
              src={videoSource}
              title="Neon Live"
              width="100%"
              height="100%"
              allowFullScreen
            />
          </div>
        </div>
        <div className="flex h-20 items-center justify-between bg-black px-8 py-10 lg:h-14 lg:px-11 lg:py-2 md:h-12 md:px-8 md:py-0 sm:h-10 sm:px-4">
          <h2 className="ml-6 text-[28px] font-semibold leading-none tracking-tighter text-white lg:ml-0 md:text-2xl xs:text-lg">
            Neon Live
          </h2>
          <TwitterShareButton
            className="!gap-0 !px-0 !text-sm !font-light tracking-[-0.02em]"
            url={`${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/stage`}
            shareText="Watching @neondatabase Deploy live! 🔥 Join at "
            iconSize="small"
          >
            Share your thoughts on Twitter
          </TwitterShareButton>
        </div>
      </div>
      <div className="bg-gray-0 relative max-h-[calc(100vh-71px)] overflow-y-auto px-4 py-6 xl:max-h-[calc(100vh-91px)] lg:max-h-none lg:px-11 md:px-8 sm:px-4">
        <h2 className="text-2xl font-semibold leading-dense tracking-tighter text-white md:text-xl">
          Schedule (PT)
        </h2>
        <ul className="mt-4 flex flex-col gap-5 md:gap-4">
          {DEPLOY_AGENDA.map((item, index) => {
            const { event, company, time, speaker, blogPostUrl, timestamp } = item;
            return (
              <li key={index}>
                <div className="flex items-center">
                  <time
                    className="text-sm font-light leading-none tracking-[0.04em] text-gray-5"
                    dateTime={`2023-03-29T${time.slice(0, 5)}`}
                  >
                    {time}
                  </time>
                  {blogPostUrl && (
                    <Button
                      className="ml-auto !font-mono !font-medium opacity-80 ![word-spacing:0]"
                      size="sm"
                      theme="text"
                      href={blogPostUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Read blog post
                    </Button>
                  )}
                </div>
                <button
                  className={clsx(
                    'border-gray-10 mt-2 w-full rounded-[6px] border px-4 py-3 text-left transition-colors duration-200',
                    time ? 'hover:cursor-pointer hover:border-[#797D86]' : 'hover:cursor-default'
                  )}
                  type="button"
                  onClick={() =>
                    timestamp
                      ? setVideoSource(DEPLOY_STAGE_VIDEO.replace('&mute=1', '') + timestamp)
                      : false
                  }
                >
                  <h3 className="text-base font-medium leading-[1.25] tracking-tighter text-white">
                    {event}
                  </h3>
                  <figure className="mt-3 flex items-center">
                    {speaker.avatar && (
                      <Image
                        className="mr-2"
                        width={28}
                        height={28}
                        quality={100}
                        src={speaker.avatar}
                        alt={speaker.name}
                      />
                    )}

                    <figcaption className="font-mono text-sm font-light leading-[1.25] tracking-tight text-gray-5">
                      {speaker.name}, {company}
                    </figcaption>
                  </figure>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Stage;
