import React, { useEffect, useState } from 'react';

interface CounterDisplayProps {
  count: number;
  loading: boolean;
}

export const CounterDisplay: React.FC<CounterDisplayProps> = ({ count, loading }) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    // Animate the number counting up
    let start = 0;
    const end = count;
    if (start === end) return;

    // Basic ease-out counter animation
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const ease = 1 - Math.pow(1 - progress, 4);
      
      const current = Math.floor(ease * end);
      setDisplayCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [count]);

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className={`text-6xl md:text-8xl font-mono tracking-tighter transition-all duration-500 text-bone ${loading ? 'opacity-50 blur-[2px]' : ''}`}>
        {displayCount.toLocaleString()}
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <div className="w-1.5 h-1.5 bg-blood-bright rounded-full animate-pulse"></div>
        <p className="text-xs md:text-sm text-gray-500 tracking-[0.2em] uppercase">
          People Still Here (Live Count) 
        </p>
      </div>
    </div>
  );
};