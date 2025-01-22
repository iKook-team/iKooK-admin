import useDebounce from './useDebounce.ts';
import { useState } from 'react';

export default function useDebouncedValue<T>(input: T, timeout = 300): T {
  const [value, setValue] = useState(input);

  const [, __] = useDebounce(() => setValue(input), timeout, [input]);

  return value;
}
