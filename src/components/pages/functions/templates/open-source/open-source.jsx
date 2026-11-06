import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';
import ArrowRightIcon from 'icons/arrow-right.inline.svg';
import { cn } from 'utils/cn';

import DotIcon from './dot-icon';

const CONTAINER_CLASS_NAME =
  'mx-auto w-[calc(100%-6rem)] max-w-[84rem] max-[1001px]:w-[calc(100%-4rem)] md:w-[calc(100%-2.5rem)]';
// Same rail as the catalog above, so the label column lines up with the filters.
const GRID_CLASS_NAME =
  'grid grid-cols-[13rem_minmax(0,1fr)] gap-x-10 max-[1251px]:grid-cols-[11.5rem_minmax(0,1fr)] max-[1251px]:gap-x-[1.875rem] lg:grid-cols-1 lg:gap-y-8';
// Columns follow the "Built for agents" section on the product pages.
const ITEM_CLASS_NAME =
  'flex min-w-0 flex-col border-l border-gray-new-20 pl-6 md:border-t md:border-l-0 md:pt-6 md:pl-0 md:first:border-t-0 md:first:pt-0'; // taste-skill-ignore
// Order follows the visitor's path: learn how templates work, add your own, then ask for what's missing.
const ITEMS = [
  {
    id: 'how-to',
    icon: 'steps',
    title: 'Learn the basics',
    description:
      'Add a template with one command or one prompt, run it locally, and deploy it to your branch.',
    action: { label: 'How to use templates', to: LINKS.functionsTemplatesDocs },
  },
  {
    id: 'contribute',
    icon: 'plus',
    title: 'Contribute your own',
    description:
      'Open a pull request in neondatabase/examples. Once Neon reviews and merges it, it shows up here and in the CLI within about an hour.',
    action: { label: 'Contribute a template', to: LINKS.functionsRegistry },
  },
  {
    id: 'discord',
    icon: 'gap',
    title: 'Request a template',
    description:
      'Missing an integration? Tell the community and the Neon team what you need on Discord.',
    action: { label: 'Ask on Discord', to: '/discord', isNewTab: true },
  },
];

// One quiet link style for every column; the order carries the priority.
const Action = ({ action, source }) => (
  <Link
    className="group inline-flex items-center gap-2 text-base leading-snug tracking-extra-tight text-white transition-colors hover:text-green-45 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-45"
    to={action.to}
    tagName={`Functions Templates ${action.label} ${source}`}
    {...(action.isNewTab && { target: '_blank', rel: 'noopener noreferrer', prefetch: false })}
  >
    {action.label}
    <ArrowRightIcon
      className="size-3 shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
      aria-hidden
    />
  </Link>
);

Action.propTypes = {
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    isNewTab: PropTypes.bool,
  }).isRequired,
  source: PropTypes.string.isRequired,
};

const OpenSource = ({
  id = 'open-source',
  withHowTo = true,
  source = 'Catalog',
  containerClassName = CONTAINER_CLASS_NAME,
  withLabel = true,
}) => {
  const items = withHowTo ? ITEMS : ITEMS.filter((item) => item.id !== 'how-to');

  return (
    <section
      id={id}
      className="scroll-mt-20 bg-black-pure pt-28 pb-40 text-white xl:pt-24 xl:pb-32 lg:pt-20 lg:pb-24 md:pt-12 md:pb-20"
      aria-labelledby={`${id}-heading`}
    >
      <div className={cn(containerClassName, withLabel && GRID_CLASS_NAME)}>
        {withLabel && (
          <SectionLabel className="mt-3 lg:mt-0" theme="white">
            Open source
          </SectionLabel>
        )}

        <div className="min-w-0">
          <h2
            id={`${id}-heading`}
            className="max-w-[60rem] text-5xl leading-dense font-normal tracking-tighter text-pretty text-gray-new-50 2xl:text-[2.75rem] xl:text-[2.25rem] md:text-[1.75rem]"
          >
            <span className="text-white">Every template is open source.</span> Add one with a prompt
            or a single command. Missing the one you need? Ask the community or build it.
          </h2>

          <ul
            className={cn(
              'mt-20 grid gap-x-14 xl:gap-x-10 lg:gap-x-8 md:mt-14 md:grid-cols-1 md:gap-y-12',
              items.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
            )}
          >
            {items.map((item) => (
              <li key={item.id} className={ITEM_CLASS_NAME}>
                <DotIcon className="size-14 text-white" shape={item.icon} />
                <h3 className="mt-7 text-2xl leading-snug tracking-tighter lg:text-xl">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[22rem] text-base leading-normal tracking-extra-tight text-gray-new-60 lg:text-[0.9375rem]">
                  {item.description}
                </p>
                <div className="mt-auto pt-8 md:pt-5">
                  <Action action={item.action} source={source} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

OpenSource.propTypes = {
  id: PropTypes.string,
  withHowTo: PropTypes.bool,
  source: PropTypes.string,
  containerClassName: PropTypes.string,
  withLabel: PropTypes.bool,
};

export default OpenSource;
