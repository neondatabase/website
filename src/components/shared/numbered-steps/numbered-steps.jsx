import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import { cn } from 'utils/cn';

const COLUMN_STYLES = {
  3: 'grid-cols-3 gap-x-21',
  4: 'grid-cols-4 gap-x-16 lg:grid-cols-2 lg:gap-y-10',
};

const NumberedSteps = ({
  id,
  className,
  title,
  highlightedTitle,
  items,
  columns = 3,
  figmaNodeId,
}) => (
  <section
    className={cn('pt-30 safe-paddings pb-20 text-white xl:py-16 lg:py-12 md:py-10', className)}
    id={id}
    aria-labelledby={`${id}-heading`}
    data-figma-node-id={figmaNodeId}
  >
    <Container size="1344">
      <h2
        className="max-w-216 text-[2.75rem] leading-dense font-normal tracking-tighter xl:text-4xl lg:max-w-3xl lg:text-3xl md:text-[1.75rem]"
        id={`${id}-heading`}
      >
        {title} <span className="text-gray-new-50">{highlightedTitle}</span>
      </h2>

      <ol
        className={cn(
          'mt-24 grid xl:mt-20 xl:gap-x-10 lg:mt-16 lg:gap-x-6 md:mt-10 md:grid-cols-1 md:gap-y-8',
          COLUMN_STYLES[columns]
        )}
      >
        {items.map(({ id: itemId, title: itemTitle, description }, index) => (
          <li
            className={cn(
              'relative min-w-0 border-l border-gray-new-20 md:border-none md:pl-0',
              columns === 4 ? 'pl-4' : 'pl-6 lg:pl-5'
            )}
            key={itemId}
          >
            <span
              className="font-mono text-lg leading-normal tracking-extra-tight lg:text-base"
              aria-hidden
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-40 text-[1.75rem] leading-tight font-normal tracking-extra-tight text-pretty xl:mt-32 xl:text-2xl lg:mt-24 lg:text-xl md:mt-5">
              {itemTitle}
            </h3>
            <p className="mt-3 text-lg leading-normal tracking-extra-tight text-pretty text-gray-new-70 lg:text-base">
              {description}
            </p>
          </li>
        ))}
      </ol>
    </Container>
  </section>
);

NumberedSteps.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  highlightedTitle: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  columns: PropTypes.oneOf([3, 4]),
  figmaNodeId: PropTypes.string,
};

export default NumberedSteps;
