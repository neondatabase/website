function debounce(func, wait = 100) {
  let lastTimeout = null;

  function debounced(...args) {
    const that = this;
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }
    lastTimeout = setTimeout(() => {
      lastTimeout = null;
      Promise.resolve(func.apply(that, args)).then(debounced.resolve).catch(debounced.reject);
    }, wait);
  }

  debounced.cancel = () => {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
      lastTimeout = null;
    }
  };

  return debounced;
}

export default debounce;
