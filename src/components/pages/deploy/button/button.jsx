'use client';

import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import clsx from 'clsx';
import NextLink from 'next/link';
import PropTypes from 'prop-types';

const styles = {
  base: 'inline-flex items-center justify-center font-semibold !leading-none text-center whitespace-nowrap rounded-full transition-colors duration-200 outline-none',
  size: {
    md: 'text-xl tracking-[-0.02em] px-8 py-[22px] px-11 xl:px-9 lg:px-8',
    sm: 'text-base px-[27px] py-[14px]',
  },
  theme: {
    primary: 'bg-green-45 text-black-pure hover:bg-[#00e5bf]',
    'code-copy': 'rounded-md',
    'with-icon':
      'pl-[4.1rem] xl:pl-[4.25rem] lg:pl-[4.25rem] bg-green-45 text-black-pure hover:bg-[#00e5bf]',
    quaternary: 'bg-white text-[#1A1A1A] border-2 border-white hover:border-primary-2',
    text: '[word-spacing:0.7rem] tracking-tighter !p-0 text-green-45 !leading-snug xl:text-lg hover:text-[#00e5bf]',
  },
};

const Button = ({
  className: additionalClassName = null,
  href = null,
  size,
  theme,
  children,
  isAnimated = false,
  ...otherProps
}) => {
  const { RiveComponent } = useRive({
    src: '/animations/pages/deploy/button-lines.riv',
    autoplay: true,
    stateMachines: 'State Machine 1',
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.TopCenter,
    }),
  });
  const className = clsx(styles.base, styles.size[size], styles.theme[theme], additionalClassName);

  const Tag = href ? NextLink : 'button';

  return isAnimated ? (
    <Tag className={clsx('relative', className)} href={href} {...otherProps}>
      {children}
      <RiveComponent
        className={clsx(
          theme === 'with-icon' ? '-top-8' : '-top-0 xl:hidden',
          'pointer-events-none absolute left-1/2 -z-10 w-[120%] min-w-[200px] -translate-x-1/2 [&>*]:!min-h-[180px]'
        )}
      />
    </Tag>
  ) : (
    <Tag className={className} href={href} {...otherProps}>
      {children}
    </Tag>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(styles.size)).isRequired,
  theme: PropTypes.oneOf(Object.keys(styles.theme)).isRequired,
  isAnimated: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default Button;
