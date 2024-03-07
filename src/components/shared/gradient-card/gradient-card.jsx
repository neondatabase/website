import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';

const GradientCard = ({ className, children, as: Tag = 'div', ...rest }) => {
  const clickable = Tag === Link;

  return (
    <Tag className={clsx(className, 'group relative block h-full rounded-xl')} {...rest}>
      {/* border gradient */}
      <span className="absolute -inset-0.5 rounded-[inherit] bg-[linear-gradient(150deg,rgba(92,97,101,1)0%,rgba(255,255,255,0.02)50%,rgba(30,31,33,1)100%)]" />

      {/* bg */}
      <span
        className={clsx(
          'absolute inset-0 rounded-[inherit] opacity-100',
          'bg-[radial-gradient(162.08%_141.42%_at_0%_0%,rgba(48,50,54,0.20)0%,rgba(48,50,54,0.00)48.97%),linear-gradient(165deg,#1A1C1E_6.13%,#111213_75.96%)]',
          clickable && 'transition-opacity duration-300 group-hover:opacity-0'
        )}
      />

      {/* bg on hover */}
      {clickable && (
        <span
          className={clsx(
            'absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100',
            'bg-[radial-gradient(162.08%_141.42%_at_0%_0%,rgba(58,60,64,0.50)0%,rgba(58,60,64,0.00)48.97%),linear-gradient(165deg,#2C2E32_6.13%,#18191B_75.96%)]'
          )}
        />
      )}

      {/* noise */}
      <span className="absolute inset-0 bg-[url('/images/noise.png')] bg-cover opacity-40" />

      {/* content */}
      <div className="relative h-full">{children}</div>
    </Tag>
  );
};

GradientCard.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  as: PropTypes.oneOf([PropTypes.string, PropTypes.func]),
};

export default GradientCard;
