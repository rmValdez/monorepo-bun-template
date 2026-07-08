"use client";

import { useEffect, useRef, useState } from "react";

export function useDebounce<T>(value: T, delay: number, callback: () => void = () => {}) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const cbRef = useRef(callback);

  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      cbRef.current();
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
