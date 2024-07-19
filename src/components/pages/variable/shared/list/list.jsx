import clsx from 'clsx';
import { PropTypes } from 'prop-types';

const List = ({ items }) => (
  <ul className="max-w-[608px] space-y-4 pl-8 xl:space-y-3.5 lg:space-y-3 md:space-y-2.5 sm:pl-0">
    {items.map(({ icon, text }, index) => (
      <li className="flex items-start" key={index}>
        {icon && (
          <img
            className="mr-3.5 mt-0.5 shrink-0"
            src={icon}
            alt=""
            loading="lazy"
            width={24}
            height={24}
            aria-hidden
          />
        )}
        <div
          className={clsx(
            !icon && [
              'relative pl-3.5',
              'before:absolute before:left-0 before:top-[11px] before:block before:size-1 before:rounded-[1px] before:bg-white',
            ]
          )}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </li>
    ))}
  </ul>
);

List.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      text: PropTypes.string.isRequired,
    })
  ),
};

export default List;
