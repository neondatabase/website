import { useEffect } from 'react';

const events = [`mousedown`, `touchstart`];

export default function useClickOutside(refs, onClickOutside) {
  const isOutside = (element) =>
    refs.every((ref) => !ref.current || !ref.current.contains(element));

  const onClick = (event) => {
    if (isOutside(event.target)) {
      onClickOutside();
    }
  };

  useEffect(() => {
    events.forEach((event) => document.addEventListener(event, onClick));

    return () => {
      events.forEach((event) => document.removeEventListener(event, onClick));
    };
  });
}
