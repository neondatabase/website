import clsx from 'clsx';

import Container from 'components/shared/container/container';

import RssIcon from './images/rss.inline.svg';
import TwitterIcon from './images/twitter.inline.svg';
import YoutubeIcon from './images/youtube.inline.svg';

const items = [
  {
    name: 'Neon on <mark class="text-blue-80">Twitter</mark>',
    description: 'Get top-notch product insights and updates',
    icon: TwitterIcon,
    background: '/images/pages/blog/bg-blue.svg',
    className:
      'after:bg-[radial-gradient(circle,rgba(173,224,235,0.6)_0%,rgba(12,13,13,0.5)_110%)]',
    url: 'https://twitter.com/neondatabase/',
  },
  {
    name: 'Stay ahead with <mark class="text-yellow-70">RSS</mark>',
    description: 'Exceptional product insights',
    icon: RssIcon,
    background: '/images/pages/blog/bg-yellow.svg',
    className:
      'after:bg-[radial-gradient(circle,rgba(240,240,117,0.6)_0%,rgba(12,13,13,0.5)_110%)]',
    url: '/blog/rss.xml',
  },
  {
    name: 'Neon on <mark class="text-pink-90">YouTube</mark>',
    description: 'Exceptional product insights',
    icon: YoutubeIcon,
    background: '/images/pages/blog/bg-pink.svg',
    className:
      'after:bg-[radial-gradient(circle,rgba(255,204,229,0.6)_0%,rgba(12,13,13,0.5)_110%)]',
    url: 'https://www.youtube.com/channel/UCoMzQTJSIr7-RU1QbomQI2w',
  },
];

const Communities = () => (
  <section className="pt-20 pb-[104px]">
    <Container className="flex flex-col items-center" size="mdDoc">
      <h2 className="text-4xl leading-none tracking-tight">Connect with Neon’s communities</h2>
      <ul className="mt-14 grid w-full grid-cols-3 gap-x-10 xl:gap-x-6 lg:gap-x-4">
        {items.map(({ name, description, icon: Icon, background, className, url }, index) => {
          const isExternal = url.startsWith('http');
          return (
            <li
              className={clsx(
                'relative rounded-md after:absolute after:-inset-px after:rounded-md after:p-px',
                className
              )}
              key={index}
            >
              <a
                className="relative z-10 flex items-center justify-between overflow-hidden rounded-md bg-black-new py-6 px-7"
                to={url}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
              >
                <img
                  className="absolute right-0 -z-10 h-full w-auto object-cover"
                  src={background}
                  alt=""
                  width={457}
                  height={92}
                  aria-hidden
                />
                <div>
                  <h3
                    className="text-2xl font-medium leading-none tracking-tighter [&_mark]:bg-transparent"
                    dangerouslySetInnerHTML={{ __html: name }}
                  />
                  <p className="mt-2.5 text-sm leading-none tracking-[-0.02em] text-gray-new-70">
                    {description}
                  </p>
                </div>
                <Icon className="h-14 w-14" />
              </a>
            </li>
          );
        })}
      </ul>
    </Container>
  </section>
);

export default Communities;
