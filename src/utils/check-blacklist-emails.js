import LINKS from 'constants/links';

import defaultBlockList from './data/hubspot-blacklist.json';

const checkBlacklistEmails = (field) => {
  const { useDefaultBlockList, data } = field.validation;
  // Copy the default list so custom domains from one form don't leak into others
  const emailBlacklist = useDefaultBlockList ? [...defaultBlockList] : [];

  if (data) {
    String(data)
      .replace(/\s/g, '')
      .split(',')
      .forEach((domain) => emailBlacklist.push(domain.toLowerCase()));
  }

  return {
    name: 'domain-not-blacklisted',
    exclusive: true,
    message: `Ooops! Only work emails allowed. If this account is for you, <a href="${LINKS.signup}">please sign up to Neon here</a>.`,
    test: (value) => {
      // Domains are case-insensitive, so `jane@Gmail.com` must match `gmail.com`
      const domain = value.split('@')[1]?.toLowerCase();
      return !emailBlacklist.includes(domain);
    },
  };
};

export { checkBlacklistEmails };
