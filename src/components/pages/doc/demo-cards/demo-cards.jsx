import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';
import { cn } from 'utils/cn';

const DemoCards = ({ className, children = null }) => (
  <ul
    className={cn(
      'demo-cards not-prose my-10! grid grid-cols-2 gap-5 p-0! sm:grid-cols-1',
      className
    )}
  >
    {children}
  </ul>
);

DemoCards.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

// `stack` is a comma-separated string so the card reads the same in MDX and
// in the llms.txt output, where attributes are serialized as plain strings.
const DemoCard = ({ title, description, image, demo, github, stack }) => {
  const primaryHref = demo || github;
  const technologies = stack
    ? stack
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  return (
    <li className="m-0! flex flex-col overflow-hidden border border-gray-new-80 bg-[#E4F1EB]/40 pl-0! text-black-pure transition-colors duration-200 before:hidden hover:border-gray-new-70 dark:border-gray-new-30 dark:bg-gray-new-8 dark:text-white dark:hover:border-gray-new-40">
      <a
        className="relative block aspect-[1200/630] overflow-hidden border-b border-gray-new-80 dark:border-gray-new-30"
        href={primaryHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${title}`}
      >
        {image ? (
          <Image
            className="object-cover object-top"
            src={image}
            alt={`Screenshot of ${title}`}
            sizes="(max-width: 639px) 100vw, 400px"
            fill
          />
        ) : (
          <span className="flex h-full items-center justify-center bg-[#E4F1EB] px-6 text-center text-2xl font-medium tracking-extra-tight text-[#2D8665] dark:bg-[#101815] dark:text-[#34D59A]">
            {title}
          </span>
        )}
      </a>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg leading-snug font-medium tracking-extra-tight">{title}</h3>
        {description && (
          <p className="text-base leading-snug tracking-extra-tight text-gray-new-50 dark:text-gray-new-60">
            {description}
          </p>
        )}
        {technologies.length > 0 && (
          // Spans, not a nested list: the docs list styles override `li` font size.
          <div className="flex flex-wrap gap-1.5">
            {technologies.map((technology) => (
              <span
                className="rounded-full bg-gray-new-50/10 px-2 py-0.5 font-mono text-xs leading-normal text-gray-new-40 dark:bg-gray-new-80/10 dark:text-gray-new-70"
                key={technology}
              >
                {technology}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex gap-5 pt-2 text-sm font-medium">
          {demo && (
            <Link
              className="text-[#2D8665] hover:underline dark:text-[#34D59A]"
              to={demo}
              target="_blank"
              rel="noopener noreferrer"
              icon="external"
              tagName="DemoCard"
              tagText={`${title} live demo`}
            >
              Live demo
            </Link>
          )}
          {github && (
            <Link
              className="text-[#2D8665] hover:underline dark:text-[#34D59A]"
              to={github}
              target="_blank"
              rel="noopener noreferrer"
              icon="external"
              tagName="DemoCard"
              tagText={`${title} GitHub`}
            >
              GitHub
            </Link>
          )}
        </div>
      </div>
    </li>
  );
};

DemoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string,
  demo: PropTypes.string,
  github: PropTypes.string,
  stack: PropTypes.string,
};

export { DemoCard };
export default DemoCards;
