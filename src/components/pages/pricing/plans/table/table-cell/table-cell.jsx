import PropTypes from 'prop-types';

import InfoIcon from 'components/shared/info-icon';

const CellItem = ({ title, subtitle, info, id, index, subindex }) => (
  <p className="font-light leading-snug tracking-extra-tight">
    {title}
    {info && (
      <span className="whitespace-nowrap">
        &nbsp;
        <InfoIcon
          className="relative top-0.5 ml-0.5 inline-block"
          tooltip={info}
          tooltipId={`${id}-${index}${subindex ? `-${subindex}` : ''}`}
        />
      </span>
    )}
    {subtitle && <span className="mt-1 block text-sm text-gray-new-60">{subtitle}</span>}
  </p>
);

CellItem.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  info: PropTypes.string,
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  subindex: PropTypes.number,
};

const TableCell = ({ item, ...otherProps }) => {
  if (item === undefined) return null;

  if (Array.isArray(item)) {
    return (
      <div className="space-y-2.5">
        {item.map((subitem, index) => (
          <CellItem {...subitem} {...otherProps} subindex={index + 1} key={index} />
        ))}
      </div>
    );
  }

  const title = item?.title || item;
  const { subtitle, info } = item;
  return <CellItem title={title} subtitle={subtitle} info={info} {...otherProps} />;
};

TableCell.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

export default TableCell;
