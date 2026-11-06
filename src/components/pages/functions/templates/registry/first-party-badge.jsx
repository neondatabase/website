import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

const FirstPartyBadge = ({ className }) => (
  <span
    className={cn(
      'inline-flex shrink-0 items-center gap-[7px] border border-[#303236] bg-white/[0.03] px-2 py-1 font-mono text-[11px] leading-[14px] font-medium tracking-[0.04em] whitespace-nowrap text-[#e4e5e7] uppercase',
      className
    )}
  >
    <span className="size-[5px] shrink-0 bg-[#00e599]" aria-hidden />
    First Party
  </span>
);

FirstPartyBadge.propTypes = {
  className: PropTypes.string,
};

export default FirstPartyBadge;
