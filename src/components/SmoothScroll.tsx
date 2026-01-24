import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * SmoothScroll Component
 * 
 * 集成 Lenis 平滑滚动库，提供流畅的滚动体验。
 * 使用 requestAnimationFrame 实现高性能动画。
 * 
 * 特性：
 * - GPU 加速的平滑滚动
 * - 可配置的滚动参数（阻尼、持续时间等）
 * - 自动处理触摸事件（移动端友好）
 * - 无障碍支持（prefers-reduced-motion）
 * - 自动清理资源
 * 
 * @example
 * ```tsx
 * <SmoothScroll
 *   duration={1.2}
 *   easing={(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)}
 *   smooth={true}
 * />
 * ```
 */
interface SmoothScrollProps {
  /** 滚动持续时间（秒），默认 1.2 */
  duration?: number;
  /** 缓动函数，默认平滑缓动 */
  easing?: (t: number) => number;
  /** 是否启用平滑滚动，默认 true */
  smooth?: boolean;
  /** 触摸灵敏度，默认 1 */
  touchMultiplier?: number;
  /** 滚动系数，默认 0.1 */
  smoothTouch?: boolean;
  /** 是否锁定触摸滚动，默认 false */
  lock?: boolean;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({
  duration = 1.2,
  easing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth = true,
  touchMultiplier = 1,
  smoothTouch = true,
  lock = false,
}) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // 检查用户是否偏好减少动画
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 如果用户偏好减少动画，则不启用平滑滚动
    if (prefersReducedMotion || !smooth) {
      return;
    }

    // 初始化 Lenis
    const lenis = new Lenis({
      duration,
      easing,
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch,
      touchMultiplier,
      touchInertiaMultiplier: 35,
      infinite: false,
      autoResize: true,
      lock,
    });

    lenisRef.current = lenis;

    // 使用 requestAnimationFrame 实现高性能动画循环
    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    // 监听媒体查询变化（用户可能动态更改偏好设置）
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        // 用户偏好减少动画，停止平滑滚动
        lenis.destroy();
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      } else if (!lenisRef.current) {
        // 重新初始化平滑滚动
        const newLenis = new Lenis({
          duration,
          easing,
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch,
          touchMultiplier,
          touchInertiaMultiplier: 35,
          infinite: false,
          autoResize: true,
          lock,
        });
        lenisRef.current = newLenis;
        rafRef.current = requestAnimationFrame(raf);
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    // 清理函数
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [duration, easing, smooth, touchMultiplier, smoothTouch, lock]);

  return null;
};

export default SmoothScroll;
