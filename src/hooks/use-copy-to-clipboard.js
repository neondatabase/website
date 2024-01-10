import copyToClipboard from 'copy-to-clipboard';
import { useEffect, useState, useCallback } from 'react';

export default function useCopyToClipboard(resetInterval = null) {
  const [isCopied, setCopied] = useState(false);

  const handleCopy = useCallback((text) => {
    if (typeof text === 'string' || typeof text === 'number') {
      copyToClipboard(text.toString());
      setCopied(true);
    } else {
      setCopied(false);
    }
  }, []);

  useEffect(() => {
    let timeout;
    if (isCopied && resetInterval) {
      timeout = setTimeout(() => setCopied(false), resetInterval);
    }
    return () => clearTimeout(timeout);
  }, [isCopied, resetInterval]);

  return { isCopied, handleCopy };
}
