export default function sendGtagEvent(event) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
  });
}
