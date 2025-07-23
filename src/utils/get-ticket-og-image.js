const getTicketOgImage = (data) =>
  data ? '/api/ticket-og?'.concat(new URLSearchParams(data)) : '/api/ticket-og?';

export default getTicketOgImage;
