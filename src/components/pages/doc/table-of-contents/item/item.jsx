import clsx from 'clsx';
import PropTypes from 'prop-types';

const linkClassName =
  'py-1.5 block text-sm leading-tight transition-colors duration-200 text-gray-new-40 hover:text-black-new dark:text-gray-new-90 dark:hover:text-white [&_code]:rounded-sm [&_code]:leading-none [&_code]:py-px [&_code]:bg-gray-new-94 [&_code]:px-1.5 [&_code]:font-mono [&_code]:font-normal dark:[&_code]:bg-gray-new-15';

const handleAnchorClick = (e, anchor) => {
  e.preventDefault();
  document.querySelector(anchor).scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
  // changing hash without default jumps to anchor
  // eslint-disable-next-line no-restricted-globals
  if (history.pushState) {
    // eslint-disable-next-line no-restricted-globals
    history.pushState(false, false, anchor);
  } else {
    // old browser support
    window.location.hash = anchor;
  }
};
const Item = ({ title, level, href, id, currentAnchor }) => (
  <a
    className={clsx(linkClassName, {
      'text-black-new dark:text-white font-medium': currentAnchor === id,
    })}
    style={{
      marginLeft: level === 1 ? '' : `${(level - 1) * 0.5}rem`,
    }}
    href={href}
    dangerouslySetInnerHTML={{ __html: title }}
    onClick={(e) => handleAnchorClick(e, href)}
  />
);

Item.propTypes = {
  title: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  href: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  currentAnchor: PropTypes.string,
};

export default Item;
