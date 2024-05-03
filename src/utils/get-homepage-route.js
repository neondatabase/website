import getCookie from 'utils/get-cookie';

export default function getHomepageRoute() {
  return getCookie('ajs_user_id') ? '/home' : '/';
}
