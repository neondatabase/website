export default function sendGtagEvent(eventName) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
  });
}
