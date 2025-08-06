import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import GradientBorder from 'components/shared/gradient-border';
import Link from 'components/shared/link';
import iconCursor from 'icons/ai/features-cards/cursor.svg';
import iconMCPServer from 'icons/ai/features-cards/mcp-server.svg';

const ITEMS = [
  {
    title: 'Integrate with Cursor and other AI-first IDEs',
    description:
      'Spin up a Neon database, create branches, inspect query plans, and reset data all from inside the editor.',
    link: '/docs/ai/ai-agents-tools#integrate-neon-in-your-ide',
    linkText: 'Add Neon to your editor',
    icon: iconCursor,
  },
  {
    title: 'MCP Server',
    description:
      'Purpose-built for AI devtools, Neon MCP lets agents manage data workflows from provisioning to tuning.',
    link: 'https://mcp.neon.tech/',
    linkText: 'Get started',
    icon: iconMCPServer,
  },
];

const FeaturesCards = ({
  title = 'Code with AI ',
  description = 'Your AI tools can now do more than write queries: they can manage your database too.',
  items = ITEMS,
  className,
  headerClassName,
  titleClassName,
  descriptionClassName,
  ulClassName,
}) => (
  <section
    className={clsx(
      'features safe-paddings relative mt-[200px] overflow-hidden xl:mt-[194px] lg:mt-[161px] md:mt-[104px]',
      className
    )}
  >
    <Container className="relative z-10 md:max-w-sm md:px-5" size="960">
      <header
        className={clsx(
          'mx-auto flex max-w-3xl flex-col items-center text-center md:max-w-[500px]',
          headerClassName
        )}
      >
        <h2
          className={clsx(
            'font-title text-5xl font-medium leading-none tracking-extra-tight xl:text-[44px] lg:text-4xl md:text-[32px]',
            titleClassName
          )}
        >
          {title}
        </h2>
        <p
          className={clsx(
            'mt-4 text-lg leading-snug tracking-extra-tight text-gray-new-80 lg:mt-3 lg:text-base md:text-pretty',
            descriptionClassName
          )}
        >
          {description}
        </p>
      </header>
      <ul
        className={clsx(
          'mt-11 grid grid-cols-2 gap-5 lg:mt-10 md:grid-cols-1 md:gap-4',
          ulClassName
        )}
      >
        {items.map(({ title, description, link, linkText, icon }) => (
          <li
            className="relative flex size-full flex-col justify-between gap-12 rounded-lg bg-security-card-bg p-6 xl:gap-[55px] lg:gap-8 lg:p-5 md:min-h-[262px]"
            key={title}
          >
            <div className="relative flex size-12 items-center justify-center rounded-full bg-security-slide-icon-bg lg:size-11">
              <Image
                className="md:size-[22px]"
                src={icon}
                alt={title}
                width={24}
                height={24}
                loading="lazy"
              />
              <GradientBorder withBlend />
            </div>
            <div>
              <h3 className="text-lg font-medium leading-none tracking-extra-tight lg:text-balance lg:text-base lg:leading-snug">
                {title}
              </h3>
              <p className="mt-3 text-pretty font-light leading-snug tracking-extra-tight text-gray-new-70 lg:mt-2 lg:text-[15px]">
                {description}
              </p>
              {link && (
                <Link
                  className="mt-4 text-[15px] leading-none -tracking-[0.03em] lg:mt-3.5 lg:text-sm"
                  to={link}
                  theme="white"
                  target="_blank"
                  rel="noopener noreferrer"
                  withArrow
                >
                  {linkText}
                </Link>
              )}
            </div>
            <GradientBorder className="!rounded-[10px]" withBlend />
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

FeaturesCards.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.object.isRequired,
      link: PropTypes.string.isRequired,
      linkText: PropTypes.string.isRequired,
    })
  ),
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  titleClassName: PropTypes.string,
  descriptionClassName: PropTypes.string,
  ulClassName: PropTypes.string,
};

export default FeaturesCards;
