const getShortName = (name) => {
  if (typeof name !== 'string') return name;

  const names = name.split(' ');

  if (names.length === 1) return name;

  const firstName = names[0];
  const lastName = names[names.length - 1];
  const lastInitial = `${lastName.substring(0, 1)}.`;

  return `${firstName} ${lastInitial}`;
};

export default getShortName;
