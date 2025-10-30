import { useMemo } from 'react';

export const usePerformanceGlass = (blurAmount: number = 2) => {
  return useMemo(() => ({
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: `blur(${blurAmount}px)`,
    WebkitBackdropFilter: `blur(${blurAmount}px)`,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transform: 'translate3d(0, 0, 0)' as const,
    backfaceVisibility: 'hidden' as const,
  }), [blurAmount]);
};