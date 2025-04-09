import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import GradientBorder from 'components/shared/gradient-border/index';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

import aiTools from './images/ai-tools.jpg';
import createApp from './images/create-app.jpg';

const ITEMS = [
  {
    title: 'Connect Neon via MCP Server',
    description:
      'Neon lets you connect AI tools like Cursor, Windsurf, Zed, Claude Desktop, Cline and more right from the Neon console.',
    link: {
      text: 'Sign up now',
      url: LINKS.signup,
    },
    image: aiTools,
  },
  {
    title: 'Database with Neon Auth',
    description:
      'For a seamless experience when prompting or vibe coding full stack apps with agents like&nbsp;Replit, v0, Lovable, Bolt and more.',
    image: createApp,
  },
];

const Usage = () => (
  <section className="usage safe-paddings relative mt-[200px] xl:mt-[176px] lg:mt-[152px] md:mt-[104px]">
    <Container className="!max-w-3xl md:!max-w-sm md:px-5">
      <h2 className="font-title text-[52px] font-medium leading-none tracking-extra-tight xl:text-5xl lg:text-4xl md:text-[32px]">
        Neon lets you ship faster with AI
      </h2>
      <ul className="mt-14 space-y-[72px] lg:mt-12 lg:space-y-16 md:mx-auto md:mt-10 md:space-y-12">
        {ITEMS.map(({ title, description, link, image }, index) => (
          <li
            className="grid grid-cols-2 items-center gap-14 lg:gap-12 md:grid-cols-1 md:gap-6"
            key={title}
          >
            <div className="lg:pt-1 md:pt-0">
              <h3 className="text-2xl font-medium leading-snug tracking-extra-tight lg:text-xl md:text-lg">
                {title}
              </h3>
              <p
                className="mt-2 text-lg tracking-tight text-gray-new-70 lg:text-base md:mt-1.5"
                dangerouslySetInnerHTML={{ __html: description }}
              />
              {link && (
                <Link
                  className="mt-4 text-lg leading-none tracking-[-0.03em] lg:text-base"
                  to={link.url}
                  theme="white"
                  withArrow
                >
                  {link.text}
                </Link>
              )}
            </div>
            <div
              className={clsx(
                'relative shrink-0 overflow-hidden rounded-[14px]',
                index % 2 === 0 && '-order-1 md:order-none'
              )}
            >
              <Image src={image} alt="" width={356} height={231} quality={100} priority />
              <GradientBorder withBlend />
            </div>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Usage;
