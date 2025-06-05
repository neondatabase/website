import { useState } from 'react';

export default function useToast() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info'); // 'info' | 'error' | 'success'
  const [timeoutId, setTimeoutId] = useState(null);

  const showToast = (message, type = 'info') => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setMessage(message);
    setType(type);
    setOpen(true);

    // Set new timeout
    const id = setTimeout(() => {
      setOpen(false);
    }, 4000);

    setTimeoutId(id);
  };

  const hideToast = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setOpen(false);
  };

  return {
    open,
    message,
    type,
    showToast,
    hideToast,
  };
}
