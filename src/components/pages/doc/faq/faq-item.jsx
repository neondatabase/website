import PropTypes from 'prop-types';
import slugify from 'slugify';

import { cn } from 'utils/cn';

const FaqItem = ({ question, children, id = null, defaultOpen = false }) => {
  const itemId =
    id ||
    slugify(question, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@?]/g,
    }).replace(/_/g, '');

  return (
    <details id={itemId} open={defaultOpen} className="faq-item group my-0!">
      <summary
        className={cn(
          'flex cursor-pointer list-none items-start gap-3 py-3.5',
          'marker:content-none [&::-webkit-details-marker]:hidden'
        )}
      >
        <span
          className={cn(
            'relative top-[8px] size-2 shrink-0 rotate-45 border-t border-r border-gray-new-50',
            'transition-transform duration-200 group-open:rotate-135 dark:border-gray-new-60'
          )}
          aria-hidden
        />
        <h3 className="m-0! text-base leading-snug tracking-tight text-black-pure dark:text-white">
          {question}
        </h3>
      </summary>
      <div className="faq-answer pl-5 *:first:mt-0">{children}</div>
    </details>
  );
};

FaqItem.propTypes = {
  question: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
  defaultOpen: PropTypes.bool,
};

export default FaqItem;
