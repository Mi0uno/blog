import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <motion.img
      layout
      src="/logo.png"
      alt="mi0034 Logo"
      className={className}
    />
  );
};
