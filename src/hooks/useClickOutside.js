import { useEffect, useRef } from 'react';

export default function useClickOutside(ref, callback) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (e) => {
      if (
        ref.current &&
        ref.current.contains &&
        !ref.current.contains(e.target)
      ) {
        callbackRef.current();
      }
    };
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('click', handler);
    };
  }, [ref]);
}
