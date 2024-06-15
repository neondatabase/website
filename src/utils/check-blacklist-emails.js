import LINKS from 'constants/links';

import defaultBlockList from './data/hubspot-blacklist.json';

const checkBlacklistEmails = (field) => {
  const { useDefaultBlockList, data } = field.validation;
  const emailBlacklist = useDefaultBlockList ? defaultBlockList : [];

  if (data) {
    String(data)
      .replace(/\s/g, '')
      .split(',')
      .forEach((domain) => emailBlacklist.push(domain));
  }

  return {
    name: 'domain-not-blacklisted',
    exclusive: true,
    message: `Ooops! Only work emails allowed. If this account is for you, <a href="${LINKS.signup}">please sign up to Neon here</a>.`,
    test: (value) => {
      const domain = value.split('@')[1];
      return !emailBlacklist.includes(domain);
    },
  };
};

// eslint-disable-next-line import/prefer-default-export
export { checkBlacklistEmails };
