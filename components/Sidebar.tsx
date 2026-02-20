import React, { useEffect, useMemo, useState } from 'react';
import { NAV_ITEMS } from '../src/data/navigation';
import { Language } from '../types';
import { Moon, Sun, Globe, Bomb, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  AnimatePresence
} from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  toggleLanguage: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onTriggerGravity: () => void;
}

function useWindowWidth() {
  const [w, setW] = useState<number>(0);
  useEffect(() => {
    const update = () => setW(window.innerWidth || 0);
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);
  return w;
}

// Very light noise texture for frosted look (fast, no backdrop-filter)
function noiseDataURI(opacity = 0.06) {
  const svg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
  <filter id="n">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="
      1 0 0 0 0
      0 1 0 0 0
      0 0 1 0 0
      0 0 0 ${opacity} 0"/>
  </filter>
  <rect width="120" height="120" filter="url(#n)"/>
</svg>`);
  return `data:image/svg+xml,${svg}`;
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
  const items = NAV_ITEMS[language];
  const { scrollY } = useScroll();
  const ww = useWindowWidth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = ww < 768;

  // Continuous progress (no boolean threshold animation)
  const raw = useTransform(scrollY, [0, 90], [0, 1], { clamp: true });
  const p = useSpring(raw, { stiffness: 260, damping: 32, mass: 0.9 });

  // wrapper translateY (avoid padding/layout)
  const y = useTransform(p, [0, 1], [0, 24]);

  // Cross-fade (compositor only)
  const topOpacity = useTransform(p, [0, 0.7, 1], [1, 0.2, 0]);
  const topScale = useTransform(p, [0, 1], [1, 0.98]);
  const topY = useTransform(p, [0, 1], [0, -6]);

  const pillOpacity = useTransform(p, [0, 0.25, 1], [0, 0.6, 1]);
  const pillScale = useTransform(p, [0, 1], [0.985, 1]);
  const pillY = useTransform(p, [0, 1], [6, 0]);

  // Enable pointer events only on the visually active layer
  const [pillActive, setPillActive] = useState(false);
  useMotionValueEvent(p, 'change', (v) => {
    setPillActive((prev) => {
      if (!prev && v > 0.55) return true;
      if (prev && v < 0.45) return false;
      return prev;
    });
  });

  // Centered pill width (fixed; not animated)
  const collapsedMax = 1024; // ~64rem
  const pillMaxWidth = Math.min(collapsedMax, Math.max(320, ww - 24));

  // 移动端动画值 (必须在条件判断前定义)
  const topBarOpacity = useTransform(p, [0, 0.3, 1], [1, 0, 0]);
  const topBarScale = useTransform(p, [0, 1], [1, 0.95]);
  const topBarY = useTransform(p, [0, 1], [0, -20]);
  const fabOpacity = useTransform(p, [0, 0.3, 1], [0, 0, 1]);
  const fabScale = useTransform(p, [0, 0.3, 1], [0.8, 0.8, 1]);

  // Frosted (opaque) glass palette
  const glassBg =
    theme === 'dark'
      ? 'rgba(17, 24, 39, 0.96)'
      : 'rgba(255, 255, 255, 0.96)';

  const glassBorder =
    theme === 'dark'
      ? 'rgba(255, 255, 255, 0.12)'
      : 'rgba(17, 24, 39, 0.10)';

  const highlight =
    theme === 'dark'
      ? 'linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.03) 42%, rgba(255,255,255,0.00))'
      : 'linear-gradient(to bottom, rgba(255,255,255,0.75), rgba(255,255,255,0.20) 42%, rgba(255,255,255,0.00))';

  const noise = useMemo(() => noiseDataURI(0.06), []);

  const RightContent = () => (
    <div className="flex items-center overflow-x-auto no-scrollbar mask-gradient gap-8">
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
            <span
              className={`
                absolute -bottom-1 left-0 w-full h-[2px] md:h-[3px] bg-black dark:bg-white
                transform transition-transform duration-200
                ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
              `}
            />
          </button>
        );
      })}

      <div className="w-[1px] h-6 md:h-8 bg-gray-200 dark:bg-gray-700 shrink-0 mx-2" />

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <button
          onClick={toggleLanguage}
          className="p-1 md:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-black dark:text-white flex items-center gap-1"
          title="Switch Language"
        >
          <Globe size={20} className="md:w-6 md:h-6" />
          <span className="text-base md:text-lg font-bold">{language === 'zh' ? 'EN' : '中'}</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-1 md:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-black dark:text-white"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} className="md:w-6 md:h-6" /> : <Sun size={20} className="md:w-6 md:h-6" />}
        </button>

        <button
          onClick={onTriggerGravity}
          className="p-1 md:p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors text-black dark:text-white"
          title="Boom!"
        >
          <Bomb size={20} className="md:w-6 md:h-6 hover:text-red-500 transition-colors" />
        </button>
      </div>
    </div>
  );

  const LeftLogo = () => (
    <div
      className="cursor-pointer flex items-center gap-2 group shrink-0"
      onClick={() => setActiveTab('dashboard')}
    >
      <Logo className="transition-colors duration-500 text-black dark:text-white w-10 h-10 md:w-12 md:h-12" />
      <div className="relative flex items-center h-12">
        <div
          className="font-black tracking-tighter uppercase text-black dark:text-white leading-none whitespace-nowrap origin-left"
          style={{ fontSize: '3rem' }}
        >
          mi0034
        </div>
      </div>
    </div>
  );

  const GlassPlate: React.FC<{ radius: number }> = ({ radius }) => (
    <div
      aria-hidden
      className="absolute inset-0 -z-10 pointer-events-none"
      style={{
        borderRadius: radius,
        backgroundColor: glassBg,
        backgroundImage: `${highlight}, url("${noise}")`,
        backgroundBlendMode: 'normal'
      }}
    />
  );

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  // 移动端侧边栏
  const MobileSidebar = () => (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* 侧边栏 */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] z-[70] pointer-events-auto"
            style={{
              backgroundColor: glassBg,
              backgroundImage: `${highlight}, url("${noise}")`,
              borderRight: `1px solid ${glassBorder}`
            }}
          >
            {/* 头部 */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div
                  className="cursor-pointer flex items-center gap-2"
                  onClick={() => handleNavClick('dashboard')}
                >
                  <Logo className="text-black dark:text-white w-10 h-10" />
                  <span className="font-black text-2xl text-black dark:text-white">mi0034</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={24} className="text-black dark:text-white" />
                </button>
              </div>
            </div>

            {/* 导航项 */}
            <div className="p-6 space-y-2">
              {items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl font-bold text-lg transition-all duration-200
                      ${isActive
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* 底部控制按钮 */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-around">
                <button
                  onClick={toggleLanguage}
                  className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-black dark:text-white flex items-center gap-2"
                >
                  <Globe size={20} />
                  <span className="text-sm font-bold">{language === 'zh' ? 'EN' : '中'}</span>
                </button>

                <button
                  onClick={toggleTheme}
                  className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-black dark:text-white"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onTriggerGravity();
                  }}
                  className="p-3 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors text-black dark:text-white"
                >
                  <Bomb size={20} className="hover:text-red-500 transition-colors" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // 移动端顶部栏
  if (isMobile) {
    return (
      <>
        {/* 顶部导航栏 */}
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
          style={{
            opacity: topBarOpacity,
            scale: topBarScale,
            y: topBarY
          }}
        >
          <motion.nav
            style={{
              width: '100%',
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 16,
              paddingBottom: 16,
              borderBottom: `1px solid ${glassBorder}`,
              backgroundColor: glassBg,
              backgroundImage: `${highlight}, url("${noise}")`
            }}
            className="pointer-events-auto flex items-center justify-between"
          >
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu size={24} className="text-black dark:text-white" />
            </button>

            <div
              className="cursor-pointer flex items-center gap-2"
              onClick={() => setActiveTab('dashboard')}
            >
              <Logo className="text-black dark:text-white w-8 h-8" />
              <span className="font-black text-xl text-black dark:text-white">mi0034</span>
            </div>

            <div className="w-10" />
          </motion.nav>
        </motion.div>

        {/* 悬浮球 */}
        <motion.button
          onClick={() => setMobileMenuOpen(true)}
          className="fixed top-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            opacity: fabOpacity,
            scale: fabScale,
            backgroundColor: glassBg,
            backgroundImage: `${highlight}, url("${noise}")`,
            border: `1px solid ${glassBorder}`,
            pointerEvents: pillActive ? 'auto' : 'none'
          }}
        >
          <Menu size={24} className="text-black dark:text-white" />
        </motion.button>

        <MobileSidebar />
      </>
    );
  }

  // 桌面端导航栏
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none overflow-x-hidden"
      style={{ y }}
    >
      {/* ===== TOP NAV (full width) ===== */}
      <motion.nav
        initial={false}
        style={{
          opacity: topOpacity,
          scale: topScale,
          y: topY,
          width: '100%',
          maxWidth: '100%',
          borderRadius: 0,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 24,
          paddingBottom: 24,
          overflow: 'hidden',
          willChange: 'transform, opacity',
          transform: 'translateZ(0)',
          pointerEvents: pillActive ? 'none' : 'auto'
        }}
        className="pointer-events-auto relative flex items-center justify-between box-border"
      >
        <LeftLogo />
        <RightContent />
      </motion.nav>

      {/* ===== PILL NAV (centered) ===== */}
      <motion.nav
        initial={false}
        style={{
          opacity: pillOpacity,
          scale: pillScale,
          y: pillY,

          position: 'absolute',
          left: '50%',
          top: 0,

          // ✅ always centered
          x: '-50%',

          width: '100%',
          maxWidth: pillMaxWidth,

          borderRadius: 99999,
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: 16,
          paddingBottom: 16,

          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: glassBorder,

          overflow: 'hidden',
          willChange: 'transform, opacity',
          pointerEvents: pillActive ? 'auto' : 'none'
        }}
        // ✅ No shadow
        className="pointer-events-auto relative flex items-center justify-between box-border"
      >
        <GlassPlate radius={99999} />

        {/* subtle inner highlight (still no outer shadow) */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: 99999,
            boxShadow:
              theme === 'dark'
                ? 'inset 0 1px 0 rgba(255,255,255,0.10)'
                : 'inset 0 1px 0 rgba(255,255,255,0.70)'
          }}
        />

        <LeftLogo />
        <RightContent />
      </motion.nav>
    </motion.div>
  );
};
