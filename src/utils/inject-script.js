export const injectScript = (src) =>
  new Promise((resolve, reject) => {
    const existScript = document.head.querySelector(`script[src="${src}"]`);

    if (existScript) {
      resolve();
    } else {
      const newScript = document.createElement('script');
      newScript.onload = resolve;
      newScript.onerror = reject;
      newScript.src = src;
      document.head.appendChild(newScript);
    }
  });
