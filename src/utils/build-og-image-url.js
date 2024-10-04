const buildOgImageUrl = (data) =>
  data ? '/api/og?'.concat(new URLSearchParams(data)) : '/api/og?';

export default buildOgImageUrl;
