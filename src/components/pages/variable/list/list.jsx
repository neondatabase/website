import clsx from 'clsx';
import { PropTypes } from 'prop-types';

const List = ({ items }) => (
  <ul className="max-w-[608px] space-y-4 pl-8 xl:space-y-3.5 lg:space-y-3 md:space-y-2.5 sm:pl-0">
    {items.map(({ icon, text }, index) => (
      <li className="flex items-start" key={index}>
        {icon && (
          <div className="relative mr-3.5 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded bg-variable-list-icon-bg sm:mr-3 sm:mt-0">
            <img className="relative" src={icon} alt="" loading="lazy" width={16} height={16} />
            <div className="absolute inset-0 rounded-[inherit] mix-blend-overlay border-image-variable-list-icon-border" />
          </div>
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
