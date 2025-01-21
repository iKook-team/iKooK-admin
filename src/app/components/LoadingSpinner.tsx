import { ReactNode } from 'react';

interface LoadingSpinnerProps {
  isLoading: boolean;
  children?: ReactNode;
}

export function LoadingSpinner({ isLoading, children }: LoadingSpinnerProps) {
  return (
    <>
      {children}
      {isLoading && <span className="loading loading-spinner"></span>}
    </>
  );
}
