import { useState, useEffect } from 'react';

export default function useSwipe(): {
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void;
  swipeDirection: 'left' | 'right' | null;
} {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    if (touchStart === null || touchEnd === null) return;

    const threshold = 30; // Minimum distance to consider as swipe
    const swipeDistance = touchEnd - touchStart;

    setTouchEnd(null);
    // Determine swipe direction
    if (swipeDistance > threshold) {
      setSwipeDirection('right');
    } else if (swipeDistance < -threshold) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection(null);
    }
  }, [touchStart, touchEnd]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.touches[0].clientX);
    setSwipeDirection(null); // Reset swipe direction on new touch start
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.changedTouches[0].clientX);
  };

  return { handleTouchStart, handleTouchEnd, swipeDirection };
};