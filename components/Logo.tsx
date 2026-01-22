import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="mi0034 Logo"
      role="img"
    >
      <title>mi0034 Logo</title>
      <path d="M15 15 V 85 H 30 V 40 L 50 60 L 70 40 V 85 H 85 V 15 L 50 50 L 15 15 Z" />
    </svg>
  );
};
