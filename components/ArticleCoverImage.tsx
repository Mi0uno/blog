import React, { useState, useEffect } from 'react';
import { BookOpen, ImageOff } from 'lucide-react';

interface ArticleCoverImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export const ArticleCoverImage: React.FC<ArticleCoverImageProps> = ({ 
  src, 
  alt, 
  className = "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform",
  fallbackClassName = "w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800/50"
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (!src || hasError) {
    return (
      <div className={fallbackClassName}>
        {hasError ? (
          <ImageOff size={32} className="text-gray-300 dark:text-gray-600" />
        ) : (
          <BookOpen size={32} className="text-gray-300 dark:text-gray-600" />
        )}
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`absolute inset-0 ${fallbackClassName} animate-pulse`}>
           <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
        </div>
      )}
      <img 
        src={imgSrc} 
        alt={alt} 
        loading="lazy"
        decoding="async"
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleError}
        onLoad={handleLoad}
        referrerPolicy="no-referrer"
      />
    </>
  );
};
