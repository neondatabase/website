'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PostHogProviderBase } from 'posthog-js/react';
import { ReactNode, useEffect } from 'react';

interface PostHogProviderProps {
  children: ReactNode;
}

// Provider configured based by the official Posthog documentation:
// https://posthog.com/docs/libraries/next-js

const PostHogProvider = ({ children }: PostHogProviderProps) => {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

    if (key) {
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: 'identified_only',
        capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      });
    }
  }, []);

  return <PostHogProviderBase client={posthog}>{children}</PostHogProviderBase>;
};

export default PostHogProvider;
