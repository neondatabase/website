import PropTypes from 'prop-types';
import slugify from 'slugify';

const NumberedStep = ({ number, title, children, tag: Tag = 'h2' }) => {
  const id = slugify(title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
  return (
    <div className="relative mb-3 mt-10 flex items-start gap-3">
      <div
        className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-gray-new-15 text-sm leading-snug tracking-extra-tight text-white after:absolute after:top-[30px] 
    after:h-full after:w-px after:bg-gray-new-80 dark:bg-gray-new-94 dark:text-black-new dark:after:bg-gray-new-15"
      >
        {number}
      </div>
      <div>
        <Tag className="!my-0 scroll-mt-20 lg:scroll-mt-5" id={id}>
          {title}
        </Tag>
        {children}
      </div>
    </div>
  );
};

export default NumberedStep;

NumberedStep.propTypes = {
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  tag: PropTypes.string,
};
