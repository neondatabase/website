export default function getCookie(name) {
  const cookieValue =
    document &&
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
      ?.split('=')[1];

  return cookieValue;
}
