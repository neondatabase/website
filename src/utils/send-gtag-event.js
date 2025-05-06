export default function sendGtagEvent(eventName, properties) {
  console.log('sendGtagEvent', eventName, properties);
  if (window.zaraz) {
    window.zaraz.track(eventName, properties);
  }
}
