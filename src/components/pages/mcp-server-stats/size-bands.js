const BANDS = [
  { value: 'free', label: 'Free' },
  { value: 'smaller_50', label: 'Paying, smaller 50%' },
  { value: 'next_40', label: 'Next 40%' },
  { value: 'next_9', label: 'Next 9%' },
  { value: 'largest_1', label: 'Largest 1%' },
];

export const CUSTOMER_SIZE_SURFACES = [
  { value: 'mcp', label: 'MCP server' },
  { value: 'cli', label: 'Neon CLI' },
];

export function buildCustomerSize(rows) {
  const byKey = new Map(rows.map((row) => [`${row.band}:${row.surface}`, row.share]));
  rows.forEach(({ band, surface }) => {
    const known =
      BANDS.some(({ value }) => value === band) &&
      CUSTOMER_SIZE_SURFACES.some(({ value }) => value === surface);
    if (!known) throw new Error(`Unknown customer size value "${band}:${surface}"`);
  });

  return BANDS.map(({ value: band, label }) => ({
    key: band,
    label,
    surfaces: CUSTOMER_SIZE_SURFACES.map(({ value: surface, label: surfaceLabel }) => {
      const share = byKey.get(`${band}:${surface}`);
      if (share === undefined) throw new Error(`Missing customer size value "${band}:${surface}"`);
      return { key: surface, label: surfaceLabel, share };
    }),
  }));
}
