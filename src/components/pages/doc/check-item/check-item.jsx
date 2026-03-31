'use client';

import PropTypes from 'prop-types';
import slugify from 'slugify';

import Link from 'components/shared/link';
import { cn } from 'utils/cn';

const CheckItem = ({ title, href, children, checklist = [], onToggle, ...otherProps }) => {
  const id = slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  }).replace(/_/g, '');

  const isChecked = checklist.includes(id);
  const WrapperTag = href ? 'div' : 'label';
  const TitleTag = href ? Link : 'label';
  const titleProps = href ? { href } : { htmlFor: id };

  return (
    <li className="!m-0 before:hidden">
      <WrapperTag
        className={cn('relative block pl-[30px]', !href && 'cursor-pointer')}
        htmlFor={!href ? id : null}
      >
        <input
          className={cn(
            'appearance-none remove-autocomplete-styles',
            !href ? 'pointer-events-none' : 'cursor-pointer',
            'absolute top-1 left-0 z-10 size-4 border border-gray-new-80 transition-colors duration-200 hover:bg-gray-new-95',
            'dark:border-gray-new-20 dark:hover:bg-white/5',
            'before:absolute before:inset-0 before:z-10 before:bg-[url(/images/checklist.svg)] before:bg-[size:10px_10px] before:bg-center before:bg-no-repeat',
            'before:opacity-0 before:transition-opacity before:duration-200 checked:before:opacity-100',
            'dark:before:invert dark:checked:border-gray-new-30'
          )}
          type="checkbox"
          id={id}
          checked={isChecked}
          onChange={() => onToggle(id)}
        />
        <TitleTag
          className={cn(
            'm-0 w-fit cursor-pointer text-lg leading-tight font-normal tracking-normal',
            'text-black-pure dark:text-white',
            href &&
              'underline decoration-black-pure/40 decoration-dashed decoration-1 underline-offset-[3px] hover:decoration-black-pure dark:text-white dark:decoration-white/40 hover:dark:decoration-white/100 sm:break-words'
          )}
          {...titleProps}
          {...otherProps}
        >
          {title}
        </TitleTag>
      </WrapperTag>
      <div className="mt-2 pl-[30px] text-gray-new-40 opacity-90 dark:text-gray-new-60 md:mt-1.5 [&_p]:m-0 [&_p]:text-base [&_p]:tracking-tight">
        {children}
      </div>
    </li>
  );
};

CheckItem.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string,
  children: PropTypes.node.isRequired,
  checklist: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default CheckItem;
