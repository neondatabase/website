export default function getCookie(name) {
  const cookieValue =
    typeof document !== 'undefined' &&
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
      ?.split('=')[1];

  return cookieValue;
}
