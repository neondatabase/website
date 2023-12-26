import { AnalyticsBrowser } from '@segment/analytics-next';

const analytics = AnalyticsBrowser.load({ writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY });
export default function sendSegmentEvent(eventName, properties) {
  analytics.track(eventName, properties);
}
