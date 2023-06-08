'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const EXIT_PREVIEW_API_URL = '/api/preview-off';

const PreviewBar = () => {
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(EXIT_PREVIEW_API_URL);
      if (response.ok) {
        router.refresh();
      } else {
        throw new Error('Something went wrong while exiting preview mode');
      }
    } catch (error) {
      /* eslint-disable no-console */
      console.error(error);
    }
  }, [router]);

  return (
    <div className="fixed bottom-0 left-0 z-50 flex items-center gap-2 bg-code-red-1 px-5 py-3 text-white">
      You are in preview mode
      <span className="h-1 w-1 rounded-full bg-current" />
      <button
        type="button"
        className="relative text-inherit underline before:absolute before:-inset-x-5 before:-inset-y-3"
        onClick={fetchData}
      >
        Exit
      </button>
    </div>
  );
};

export default PreviewBar;
