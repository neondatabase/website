export default function sendGtagEvent(eventName, properties) {
  if (window.zaraz) {
    const result = window.zaraz.track(eventName, properties);
    return Promise.resolve(result);
  }
  return Promise.resolve();
}
