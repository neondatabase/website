import clsx from 'clsx';
import PropTypes from 'prop-types';
import slugify from 'slugify';

const NumberedStep = ({ title, children, tag: Tag = 'h2' }) => {
  const id = slugify(title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
  return (
    <li
      className={clsx(
        'relative !mb-0 !mt-10 flex w-full items-start gap-3 !pl-0',
        'before:flex before:size-6 before:items-center before:justify-center before:rounded-full before:bg-gray-new-15 before:text-sm before:leading-snug before:tracking-extra-tight before:text-white before:content-[counter(section)] before:[counter-increment:section]',
        'after:absolute after:left-3 after:top-[34px] after:h-[calc(100%+16px)] after:w-px after:bg-gray-new-80',
        'first:!mt-7 last:overflow-hidden',
        'dark:before:bg-gray-new-94 dark:before:text-black-new dark:after:bg-gray-new-15',
        {
          'before:mt-1': Tag === 'h2',
          'before:mt-0.5': Tag === 'h3',
        }
      )}
    >
      <div className="w-[calc(100%-100px)] flex-1 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        <Tag className="!my-0 scroll-mt-20 lg:scroll-mt-5" id={id}>
          {title}
        </Tag>
        {children}
      </div>
    </li>
  );
};

export default NumberedStep;

NumberedStep.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  tag: PropTypes.string,
};
