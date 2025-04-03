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
      'For a seamless experience when prompting or vibe coding full stack apps with agents like Replit, v0, Lovable, Bolt and more.',
    image: createApp,
  },
];

const Usage = () => (
  <section className="usage safe-paddings relative overflow-hidden pt-[200px]">
    <Container size="768">
      <h2 className="font-title text-[52px] font-medium leading-none tracking-extra-tight xl:text-[44px] lg:text-4xl md:text-[32px]">
        Neon lets you ship faster with AI
      </h2>
      <ul className="mt-14 space-y-[72px]">
        {ITEMS.map(({ title, description, link, image }, index) => (
          <li
            className={clsx('flex items-center gap-14', index % 2 === 0 && 'flex-row-reverse')}
            key={title}
          >
            <div>
              <h3 className="text-2xl font-medium leading-snug tracking-extra-tight">{title}</h3>
              <p className="mt-2 text-lg tracking-extra-tight text-gray-new-70">{description}</p>
              {link && (
                <Link
                  className="mt-4 text-lg leading-none tracking-[-0.03em]"
                  to={link.url}
                  theme="white"
                  withArrow
                >
                  {link.text}
                </Link>
              )}
            </div>
            <div className="relative shrink-0 overflow-hidden rounded-[14px]">
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
