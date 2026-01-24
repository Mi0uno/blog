import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAppeared, setHasAppeared] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const shouldShow = window.scrollY > 300;
      if (shouldShow) {
        setIsVisible(true);
        setHasAppeared(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    // Check initial scroll position
    toggleVisibility();

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Don't render anything until the user has scrolled down enough to trigger the first appearance
  // This prevents the exit animation from playing on initial page load
  if (!hasAppeared) {
    return null;
  }

  return (
    <div className="fixed right-6 bottom-24 z-40 flex flex-col items-end gap-4 pointer-events-none">
      <button
        onClick={scrollToTop}
        className={`
          pointer-events-auto w-12 h-12
          bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl
          border border-white/20 dark:border-zinc-700/50
          rounded-full shadow-lg
          flex items-center justify-center
          text-zinc-600 dark:text-zinc-400
          transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          hover:scale-110 active:scale-95
          group cursor-pointer
          ${isVisible ? 'animate-message-pop' : 'animate-message-pop-out'}
        `}
        aria-label="Back to top"
      >
        <ArrowUp 
          size={20} 
          className="group-hover:-translate-y-1 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" 
        />
      </button>
    </div>
  );
};
