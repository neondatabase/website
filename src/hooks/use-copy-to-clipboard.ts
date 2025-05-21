import copyToClipboard from 'copy-to-clipboard';
import { useEffect, useState, useCallback } from 'react';

export default function useCopyToClipboard(resetInterval: number | null = null) {
  const [isCopied, setCopied] = useState<boolean>(false);

  const handleCopy = useCallback((text: string | number) => {
    if (typeof text === 'string' || typeof text === 'number') {
      copyToClipboard(text.toString());
      setCopied(true);
    } else {
      setCopied(false);
    }
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isCopied && resetInterval) {
      timeout = setTimeout(() => setCopied(false), resetInterval);
    }
    return () => clearTimeout(timeout);
  }, [isCopied, resetInterval]);

  return { isCopied, handleCopy };
}
