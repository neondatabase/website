export default function sendGtagEvent(eventName, properties) {
  if (window.zaraz) {
    window.zaraz.track(eventName, properties);
  }
}
