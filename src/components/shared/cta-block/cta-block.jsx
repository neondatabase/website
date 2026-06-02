import PropTypes from 'prop-types';

import BgDecor from 'components/pages/use-case/bg-decor';
import Button from 'components/shared/button';
import { cn } from 'utils/cn';

const sizeClassNames = {
  sm: {
    block: 'px-6 py-5 sm:px-5 mt-8 xl:mt-5',
    heading: 'text-xl sm:text-lg leading-none tracking-extra-tight font-medium',
    description: 'leading-snug text-14 tracking-extra-tight mt-2.5',
  },
  md: {
    block: 'px-7 py-6 lg:pr-10 sm:p-6 mt-10 xl:mt-9 lg:mt-8 sm:mt-6',
    heading: 'text-2xl sm:text-xl leading-snug tracking-tight font-semibold',
    description: 'leading-snug text-base tracking-tight mt-1.5',
  },
};

const themeClassNames = {
  row: {
    container: 'items-center justify-between',
  },
  column: {
    container: 'flex-col items-center',
  },
};

const CtaBlock = ({
  className,
  title,
  description,
  buttonText,
  buttonUrl,
  buttonClassName,
  linkText,
  linkUrl,
  size = 'md',
  theme = 'row',
  hasDecor = true,
}) => (
  <div
    className={cn(
      'cta-on-template not-prose relative w-full overflow-hidden rounded-lg',
      sizeClassNames[size].block,
      hasDecor ? 'bg-[#09090B] bg-template-cta' : 'bg-black-new',
      className
    )}
  >
    <div
      className={cn(
        'relative z-10 flex gap-6 sm:flex-col sm:items-center',
        themeClassNames[theme].container
      )}
    >
      <div className={cn(theme === 'column' && 'text-center', 'sm:text-center')}>
        {title && (
          <h2 className={cn(sizeClassNames[size].heading, 'my-0! text-gray-new-98')}>{title}</h2>
        )}
        {description && (
          <p
            className={cn(
              'text-pretty [&>a]:text-primary-2 [&>a:hover]:cursor-pointer [&>a:hover]:underline',
              sizeClassNames[size].description,
              theme === 'column' && 'max-w-[520px]',
              hasDecor ? 'text-gray-new-98/70' : 'text-gray-new-60'
            )}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>
      <div
        className={cn(
          theme === 'column' &&
            'flex w-full justify-center gap-6 sm:flex-col sm:items-center sm:gap-5'
        )}
      >
        <Button
          className={cn(
            'h-10 px-7 text-base font-semibold! tracking-tighter sm:w-full sm:max-w-sm',
            buttonClassName
          )}
          theme="primary"
          to={buttonUrl}
        >
          {buttonText}
        </Button>
        {linkText && linkUrl && (
          <Button className="text-base font-medium" theme="white" to={linkUrl} withArrow>
            {linkText}
          </Button>
        )}
      </div>
    </div>
    {hasDecor && <BgDecor hasBorder hasPattern />}
  </div>
);

CtaBlock.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
  buttonClassName: PropTypes.string,
  linkText: PropTypes.string,
  linkUrl: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(sizeClassNames)),
  theme: PropTypes.oneOf(Object.keys(themeClassNames)),
  hasDecor: PropTypes.bool,
};

CtaBlock.defaultProps = {
  className: '',
  title: '',
  description: '',
  buttonClassName: '',
  linkText: '',
  linkUrl: '',
  size: 'md',
  theme: 'row',
  hasDecor: true,
};

export default CtaBlock;
