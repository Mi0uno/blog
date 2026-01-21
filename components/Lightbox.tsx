import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    type: 'image' | 'mermaid';
    data: string; // src for image, svg string for mermaid
    alt?: string;
  } | null;
  originRect: DOMRect | null;
}

export const Lightbox: React.FC<LightboxProps> = ({ isOpen, onClose, content, originRect }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Match transition duration
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // FLIP Animation Logic
  useEffect(() => {
    if (isOpen && originRect && contentRef.current) {
      const el = contentRef.current;
      
      // 1. Get final state (it's already rendered in the DOM but invisible or unstyled?)
      // We need to let the browser render it first to know its natural size in the lightbox.
      // But we want to animate from the start.
      
      // Force a layout calculation to get the "target" dimensions
      const targetRect = el.getBoundingClientRect();
      
      // 2. Calculate the transform to make the target look like the origin
      const scaleX = originRect.width / targetRect.width;
      const scaleY = originRect.height / targetRect.height;
      
      // We want to preserve aspect ratio for the visual scaling if possible, 
      // but for exact overlap we might need independent scaling.
      // Usually lightbox images maintain aspect ratio.
      
      const translateX = originRect.left - targetRect.left + (originRect.width - targetRect.width) / 2;
      const translateY = originRect.top - targetRect.top + (originRect.height - targetRect.height) / 2;

      // 3. Apply the "inverted" state (make it look like the thumbnail)
      el.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
      el.style.transition = 'none';
      el.style.transformOrigin = 'center';

      // 4. Force reflow
      el.offsetHeight;

      // 5. Animate to final state (remove transforms)
      requestAnimationFrame(() => {
        setIsAnimating(true);
        el.style.transition = 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)';
        el.style.transform = 'translate(0, 0) scale(1)';
      });
      
      // Cleanup transition after animation
      const timer = setTimeout(() => {
        setIsAnimating(false);
        if (el) el.style.transition = '';
      }, 400);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, originRect, content?.data]); // Re-run if content changes while open (unlikely) or when opening

  if (!isVisible && !isOpen) return null;

  return createPortal(
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 z-50"
        aria-label="Close lightbox"
      >
        <X size={32} />
      </button>

      {/* Content Container */}
      <div 
        ref={contentRef}
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center outline-none"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
      >
        {content?.type === 'image' && (
          <img 
            src={content.data} 
            alt={content.alt || ''} 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        )}
        
        {content?.type === 'mermaid' && (
          <div 
            className="bg-white dark:bg-[#1e1e1e] p-8 rounded-xl shadow-2xl overflow-auto max-h-[90vh] max-w-[90vw] min-w-[50vw]"
            dangerouslySetInnerHTML={{ __html: content.data }}
          />
        )}
      </div>
    </div>,
    document.body
  );
};
