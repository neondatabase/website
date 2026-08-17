'use client';

import PropTypes from 'prop-types';

import { JSON_SYNTAX_COLORS } from 'utils/api-style';

export const API_OPERATION_H2_CLASS_NAME =
  'scroll-mt-20 text-[28px] leading-tight font-semibold tracking-tight lg:text-[24px] md:text-[20px]';

export const API_OPERATION_H2_WITH_MARGIN_CLASS_NAME = `mb-4.5 ${API_OPERATION_H2_CLASS_NAME}`;

export const SectionHeader = ({ title, badge, right, id }) => (
  <div className="mb-4.5 flex min-h-6 items-center gap-2.5">
    <h2 id={id} className={API_OPERATION_H2_CLASS_NAME}>
      {title}
    </h2>
    {badge && (
      <span className="rounded border border-green-44/40 bg-transparent px-1.5 py-0.5 font-mono text-sm font-semibold text-green-44 dark:border-green-44/40">
        {badge}
      </span>
    )}
    {right && <div className="ml-auto">{right}</div>}
  </div>
);

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  badge: PropTypes.string,
  right: PropTypes.node,
  id: PropTypes.string,
};

export function JsonHighlightValue({ value, indent }) {
  if (value === null) return <span style={{ color: JSON_SYNTAX_COLORS.keyword }}>null</span>;
  if (typeof value === 'boolean')
    return <span style={{ color: JSON_SYNTAX_COLORS.keyword }}>{String(value)}</span>;
  if (typeof value === 'number')
    return <span style={{ color: JSON_SYNTAX_COLORS.number }}>{value}</span>;
  if (typeof value === 'string')
    return (
      <span style={{ color: JSON_SYNTAX_COLORS.string }}>
        {'"'}
        {value}
        {'"'}
      </span>
    );

  const pad = '  '.repeat(indent);
  const innerPad = '  '.repeat(indent + 1);

  if (Array.isArray(value)) {
    if (value.length === 0) return <span>{'[]'}</span>;
    return (
      <>
        {'[\n'}
        {value.map((item, i) => (
          <span key={i}>
            {innerPad}
            <JsonHighlightValue value={item} indent={indent + 1} />
            {i < value.length - 1 ? ',\n' : '\n'}
          </span>
        ))}
        {pad}
        {']'}
      </>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return <span>{'{}'}</span>;
    return (
      <>
        {'{\n'}
        {entries.map(([k, v], i) => (
          <span key={k}>
            {innerPad}
            <span style={{ color: JSON_SYNTAX_COLORS.key }}>
              {'"'}
              {k}
              {'"'}
            </span>
            {': '}
            <JsonHighlightValue value={v} indent={indent + 1} />
            {i < entries.length - 1 ? ',\n' : '\n'}
          </span>
        ))}
        {pad}
        {'}'}
      </>
    );
  }

  return <span>{String(value)}</span>;
}

JsonHighlightValue.propTypes = {
  value: PropTypes.any,
  indent: PropTypes.number,
};
