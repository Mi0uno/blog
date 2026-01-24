
import React, { useState } from 'react';
import { NAV_ITEMS } from '../src/data/navigation';
import { Language } from '../types';
import { Moon, Sun, Globe, Bomb } from 'lucide-react';
import { Logo } from './Logo';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  toggleLanguage: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onTriggerGravity: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  language,
  toggleLanguage,
  theme,
  toggleTheme,
  onTriggerGravity
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldBeScrolled = latest > 50;
    if (shouldBeScrolled !== isScrolled) {
      setIsScrolled(shouldBeScrolled);
    }
  });

  const items = NAV_ITEMS[language];

  // Spring configuration for organic iOS-like feel
  const springTransition = {
    type: "spring" as const,
    stiffness: 180,
    damping: 24,
    mass: 1
  };

  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none overflow-x-hidden"
      initial={false}
      animate={{ 
        paddingTop: isScrolled ? '1.5rem' : '0px'
      }}
      transition={springTransition}
    >
      <motion.nav 
        layout
        initial={false}
        animate={{
          width: isScrolled ? 'auto' : '100%',
          backgroundColor: isScrolled 
            ? (theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)') 
            : 'rgba(0,0,0,0)', // Transparent at top
          borderColor: isScrolled 
            ? (theme === 'dark' ? 'rgba(31,41,55,0.5)' : 'rgba(229,231,235,0.5)') 
            : 'rgba(0,0,0,0)',
          borderRadius: isScrolled ? '9999px' : '0px',
          borderWidth: isScrolled ? '1px' : '0px',
          paddingLeft: isScrolled ? '2.5rem' : '1.5rem', // px-10 vs px-6
          paddingRight: isScrolled ? '2.5rem' : '1.5rem',
          paddingTop: isScrolled ? '1rem' : '1.5rem', // py-4 vs py-6
          paddingBottom: isScrolled ? '1rem' : '1.5rem',
          gap: isScrolled ? '3rem' : '3rem',
        }}
        style={{
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          borderStyle: 'solid',
        }}
        transition={springTransition}
        className={`
          pointer-events-auto
          flex items-center justify-between 
          shadow-sm
          ${isScrolled ? 'shadow-2xl' : 'shadow-none'}
          box-border
        `}
      >
        
        {/* Logo Left - Text Based */}
        <motion.div
          layout="position"
          className="cursor-pointer flex items-center gap-2 group shrink-0"
          onClick={() => setActiveTab('dashboard')}
        >
          <Logo className={`transition-colors duration-500 text-black dark:text-white ${isScrolled ? 'w-10 h-10' : 'w-12 h-12 md:w-16 md:h-16'}`} />
          <motion.div
            layout="position"
            className="relative flex items-center"
            style={{ 
              height: isScrolled ? '1.875rem' : '3rem',
              width: isScrolled ? 'auto' : 'auto'
            }}
          >
            <motion.h1 
              layout="position"
              className={`font-black tracking-tighter uppercase text-black dark:text-white leading-none whitespace-nowrap origin-left`}
              animate={{
                scale: isScrolled ? 0.625 : 1, // 1.875rem / 3rem = 0.625
              }}
              style={{
                fontSize: '3rem', // Fixed base size
              }}
              transition={springTransition}
            >
              mi0034
            </motion.h1>
          </motion.div>
        </motion.div>

        {/* Links Right */}
        <motion.div 
          layout="position"
          className={`flex items-center overflow-x-auto no-scrollbar mask-gradient ${isScrolled ? 'gap-8' : 'gap-12'}`}
        >
          {items.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  text-base md:text-xl font-bold uppercase tracking-wide transition-colors duration-200 relative group whitespace-nowrap
                  ${isActive ? 'text-black dark:text-white' : 'text-gray-400 hover:text-black dark:hover:text-white'}
                `}
              >
                {item.label}
                {/* Underline for hover/active */}
                <span className={`absolute -bottom-1 left-0 w-full h-[2px] md:h-[3px] bg-black dark:bg-white transform transition-transform duration-200 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </button>
            )
          })}

          {/* Divider */}
          <div className="w-[1px] h-6 md:h-8 bg-gray-200 dark:bg-gray-700 shrink-0 mx-2"></div>

          {/* Controls: Language & Theme & Gravity */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
             {/* Language Toggle */}
             <button
               onClick={toggleLanguage}
               className="p-1 md:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-black dark:text-white flex items-center gap-1"
               title="Switch Language"
             >
               <Globe size={20} className="md:w-6 md:h-6" />
               <span className="text-base md:text-lg font-bold">{language === 'zh' ? 'EN' : '中'}</span>
             </button>

             {/* Theme Toggle */}
             <button 
               onClick={toggleTheme}
               className="p-1 md:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-black dark:text-white"
               title="Toggle Theme"
             >
               {theme === 'light' ? <Moon size={20} className="md:w-6 md:h-6" /> : <Sun size={20} className="md:w-6 md:h-6" />}
             </button>
             
             {/* Gravity Bonus Toggle */}
             <button 
               onClick={onTriggerGravity}
               className="p-1 md:p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors text-black dark:text-white"
               title="Boom!"
             >
               <Bomb size={20} className="md:w-6 md:h-6 hover:text-red-500 transition-colors" />
             </button>
          </div>

        </motion.div>
      </motion.nav>
    </motion.div>
  );
};
