import { ForwardedRef } from 'react';

export function getCurrentFromRef<T>(ref: ForwardedRef<T>) {
  if (typeof ref === 'function') {
    return undefined;
  }
  return ref?.current;
}
