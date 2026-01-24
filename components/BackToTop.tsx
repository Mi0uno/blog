import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

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

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed right-6 bottom-24 z-40 flex flex-col items-end gap-4 pointer-events-none">
      <button
        onClick={scrollToTop}
        className="pointer-events-auto w-12 h-12 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-700/50 rounded-full shadow-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:scale-110 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group animate-fade-in cursor-pointer"
        aria-label="Back to top"
      >
        <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform duration-300" />
      </button>
    </div>
  );
};
