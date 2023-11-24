import Analytics from 'analytics-node';

const analytics = new Analytics(process.env.SEGMENT_WRITE_KEY);

export default function sendSegmentEvent(eventName, properties) {
  analytics.track(eventName, properties);
}
