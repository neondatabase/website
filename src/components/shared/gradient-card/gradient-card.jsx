import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';

const GradientCard = ({ className, children, as: Tag = 'div', ...rest }) => {
  const clickable = Tag === Link;

  return (
    <Tag className={clsx(className, 'relative h-full rounded-xl')} {...rest}>
      <span className="absolute -inset-0.5 rounded-[inherit] bg-[linear-gradient(150deg,rgba(92,97,101,1)0%,rgba(255,255,255,0.02)50%,rgba(30,31,33,1)100%)]" />
      <div className="group relative z-10 flex h-full flex-col justify-start overflow-hidden rounded-[inherit] px-8 pb-10 pt-9 md:p-7 md:pb-8">
        <span
          className={clsx(
            'absolute inset-0 opacity-100',
            'bg-[radial-gradient(162.08%_141.42%_at_0%_0%,rgba(48,50,54,0.20)0%,rgba(48,50,54,0.00)48.97%),linear-gradient(165deg,#1A1C1E_6.13%,#111213_75.96%)]',
            clickable && 'transition-opacity duration-300 group-hover:opacity-0'
          )}
        />
        {clickable && (
          <span
            className={clsx(
              'absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
              'bg-[radial-gradient(162.08%_141.42%_at_0%_0%,rgba(58,60,64,0.50)0%,rgba(58,60,64,0.00)48.97%),linear-gradient(165deg,#2C2E32_6.13%,#18191B_75.96%)]'
            )}
          />
        )}
        <span className="absolute inset-0 bg-[url('/images/noise.png')] bg-cover opacity-40" />
        <div className="relative z-10 flex h-full flex-col justify-start">{children}</div>
      </div>
    </Tag>
  );
};

GradientCard.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  as: PropTypes.oneOf([PropTypes.string, PropTypes.func]),
};

export default GradientCard;
