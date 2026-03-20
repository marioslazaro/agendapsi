import { useEffect, useState } from 'react';

export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let startY = 0;
    const threshold = 100;
    
    // We bind to the document body to catch standard mobile pull-down
    const handleTouchStart = (e: TouchEvent) => {
      // Only enable pull to refresh at the very top of the scroll
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && startY > 0) {
        const pullDistance = e.touches[0].clientY - startY;
        if (pullDistance > threshold && !isRefreshing) {
          setIsRefreshing(true);
          onRefresh().finally(() => setIsRefreshing(false));
          startY = 0; // reset
        }
      }
    };

    const handleTouchEnd = () => {
      startY = 0;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh, isRefreshing]);

  return { isRefreshing };
}
