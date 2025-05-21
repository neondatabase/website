const getFormattedDate = (date: string): string =>
  new Date(date).toLocaleDateString(
    {},
    { timeZone: 'UTC', month: 'short', day: '2-digit', year: 'numeric' }
  );

export default getFormattedDate;
