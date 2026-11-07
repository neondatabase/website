import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import { cn } from 'utils/cn';

import ShareChange from './share-change';

const BAR_COLOR = '#00E599';

const ShareList = ({
  id,
  title,
  description,
  rows,
  isMono = false,
  footnote,
  className = 'mt-40 xl:mt-32 lg:mt-24 md:mt-16',
}) => (
  <section className={cn('safe-paddings', className)} aria-labelledby={id}>
    <Container size="1280">
      <h2
        className="max-w-206 text-[2.75rem] leading-dense font-normal tracking-tighter text-gray-new-50 xl:text-4xl lg:max-w-3xl lg:text-3xl md:text-[1.75rem]"
        id={id}
      >
        <span className="text-white">{title}</span> {description}
      </h2>
      <ol className="mt-16 border-t border-gray-new-20 lg:mt-12 md:mt-8">
        {rows.map(({ key, label, color, share, change, isGrouped }, index) => (
          <li
            key={key}
            className="grid grid-cols-[3rem_15rem_minmax(0,1fr)_5rem_8rem] items-center gap-x-4 border-b border-gray-new-15 py-3.5 md:grid-cols-[2rem_minmax(0,1fr)_4.5rem] md:gap-y-2"
          >
            <span className="font-mono text-sm text-gray-new-50 tabular-nums">
              {isGrouped ? '' : String(index + 1).padStart(2, '0')}
            </span>
            <span
              className={cn(
                'truncate leading-snug tracking-extra-tight text-white',
                isMono ? 'font-mono text-base lg:text-sm' : 'text-lg lg:text-base'
              )}
            >
              {label ?? key}
            </span>
            <span
              className="h-2 bg-gray-new-10 md:col-span-3 md:col-start-1 md:row-start-2"
              aria-hidden="true"
            >
              <span
                className="block h-full"
                style={{ width: `${share}%`, backgroundColor: color ?? BAR_COLOR }}
              />
            </span>
            <span className="text-right text-lg tracking-extra-tight text-white tabular-nums lg:text-base md:col-start-3 md:row-start-1">
              {share.toFixed(1)}%
            </span>
            <ShareChange
              className="text-right text-sm tracking-extra-tight tabular-nums md:hidden"
              change={change}
            />
          </li>
        ))}
      </ol>
      <p className="mt-6 max-w-[672px] text-sm leading-normal tracking-extra-tight text-gray-new-50">
        {footnote}
      </p>
    </Container>
  </section>
);

ShareList.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string,
      color: PropTypes.string,
      share: PropTypes.number.isRequired,
      change: PropTypes.number,
      isGrouped: PropTypes.bool,
    })
  ).isRequired,
  isMono: PropTypes.bool,
  className: PropTypes.string,
  footnote: PropTypes.node.isRequired,
};

export default ShareList;
