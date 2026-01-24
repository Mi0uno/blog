import { useEffect, useRef, useCallback } from 'react';

/**
 * 滚动揭示动画类型
 * Scroll Reveal Animation Types
 */
export type RevealAnimationType = 
  | 'fade-in-up'
  | 'fade-in-down'
  | 'fade-in-left'
  | 'fade-in-right'
  | 'fade-in-scale'
  | 'fade-in-blur';

/**
 * useScrollReveal Hook 配置选项
 * Configuration Options for useScrollReveal Hook
 */
export interface UseScrollRevealOptions {
  /** 要观察的元素选择器，默认 '.reveal-on-scroll' */
  selector?: string;
  /** 触发阈值（0-1），默认 0.1 */
  threshold?: number | number[];
  /** 根边距，默认 '0px 0px -50px 0px' */
  rootMargin?: string;
  /** 是否只触发一次，默认 true */
  once?: boolean;
  /** 默认动画类型，默认 'fade-in-up' */
  defaultAnimation?: RevealAnimationType;
  /** 是否启用，默认 true */
  enabled?: boolean;
  /** 是否观察动态添加的内容，默认 true */
  observeDynamicContent?: boolean;
  /** 调试函数 */
  onReveal?: (element: HTMLElement) => void;
  /** 调试函数 */
  onUnreveal?: (element: HTMLElement) => void;
}

/**
 * useScrollReveal Hook
 * 
 * 高性能、可配置的滚动揭示动画 Hook。
 * 使用 IntersectionObserver API 实现高效的视口检测。
 * 
 * 特性：
 * - 可配置的触发阈值和边距
 * - 支持多种动画类型（fade-in-up, fade-in-down等）
 * - 可选择是否只触发一次
 * - 支持动态添加的内容
 * - 自动处理 prefers-reduced-motion
 * - GPU 加速优化
 * - 内存友好的资源清理
 * 
 * @example
 * ```tsx
 * // 基础用法
 * useScrollReveal();
 * 
 * // 自定义配置
 * useScrollReveal({
 *   selector: '.animate-on-scroll',
 *   threshold: 0.2,
 *   rootMargin: '0px 0px -100px 0px',
 *   once: false,
 *   defaultAnimation: 'fade-in-scale',
 *   onReveal: (el) => console.log('Revealed:', el),
 * });
 * 
 * // 在组件中使用
 * <div className="reveal-on-scroll">内容</div>
 * <div className="reveal-fade-in-left delay-200">从左淡入</div>
 * ```
 */
export const useScrollReveal = (options: UseScrollRevealOptions = {}) => {
  const {
    selector = '.reveal-on-scroll',
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    once = true,
    defaultAnimation = 'fade-in-up',
    enabled = true,
    observeDynamicContent = true,
    onReveal,
    onUnreveal,
  } = options;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);
  const revealedElementsRef = useRef<Set<HTMLElement>>(new Set());

  /**
   * 处理元素进入视口
   */
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const target = entry.target as HTMLElement;

      if (entry.isIntersecting) {
        // 元素进入视口
        if (!revealedElementsRef.current.has(target)) {
          // 添加动画类
          target.classList.add('is-visible');
          revealedElementsRef.current.add(target);

          // 调试回调
          if (onReveal) {
            onReveal(target);
          }

          // 如果只触发一次，则停止观察
          if (once && observerRef.current) {
            observerRef.current.unobserve(target);
          }
        }
      } else if (!once) {
        // 元素离开视口且允许重复触发
        if (revealedElementsRef.current.has(target)) {
          target.classList.remove('is-visible');
          revealedElementsRef.current.delete(target);

          // 调试回调
          if (onUnreveal) {
            onUnreveal(target);
          }
        }
      }
    });
  }, [once, onReveal, onUnreveal]);

  /**
   * 观察新元素
   */
  const observeElements = useCallback(() => {
    if (!observerRef.current) return;

    // 获取所有需要观察的元素
    const elements = document.querySelectorAll<HTMLElement>(
      `${selector}:not(.is-visible)`
    );

    elements.forEach((element) => {
      // 检查元素是否已被观察
      if (!revealedElementsRef.current.has(element)) {
        observerRef.current!.observe(element);
      }
    });
  }, [selector]);

  useEffect(() => {
    // 检查是否启用
    if (!enabled) {
      return;
    }

    // 检查浏览器是否支持 IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      // 回退方案：立即显示所有元素
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el) => {
        el.classList.add('is-visible');
        if (onReveal) {
          onReveal(el);
        }
      });
      return;
    }

    // 检查用户是否偏好减少动画
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // 用户偏好减少动画，立即显示所有元素
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el) => {
        el.classList.add('is-visible');
        if (onReveal) {
          onReveal(el);
        }
      });
      return;
    }

    // 创建 IntersectionObserver
    const observerOptions: IntersectionObserverInit = {
      root: null, // 视口
      rootMargin,
      threshold,
    };

    observerRef.current = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );

    // 初始观察
    observeElements();

    // 设置 MutationObserver 以处理动态添加的内容
    if (observeDynamicContent) {
      mutationObserverRef.current = new MutationObserver((mutations) => {
        let shouldUpdate = false;

        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            shouldUpdate = true;
          }
        });

        if (shouldUpdate) {
          // 使用 requestAnimationFrame 优化性能
          requestAnimationFrame(() => {
            observeElements();
          });
        }
      });

      mutationObserverRef.current.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    // 监听媒体查询变化
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        // 用户偏好减少动画，立即显示所有元素
        const elements = document.querySelectorAll<HTMLElement>(selector);
        elements.forEach((el) => {
          el.classList.add('is-visible');
          if (onReveal) {
            onReveal(el);
          }
        });
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    // 清理函数
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);

      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect();
        mutationObserverRef.current = null;
      }

      revealedElementsRef.current.clear();
    };
  }, [
    enabled,
    selector,
    threshold,
    rootMargin,
    once,
    observeDynamicContent,
    handleIntersection,
    observeElements,
    onReveal,
  ]);

  /**
   * 手动触发元素揭示（用于测试或特殊情况）
   */
  const revealElement = useCallback((element: HTMLElement) => {
    if (!revealedElementsRef.current.has(element)) {
      element.classList.add('is-visible');
      revealedElementsRef.current.add(element);

      if (onReveal) {
        onReveal(element);
      }

      if (once && observerRef.current) {
        observerRef.current.unobserve(element);
      }
    }
  }, [once, onReveal]);

  /**
   * 重置所有已揭示的元素
   */
  const resetRevealed = useCallback(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      `${selector}.is-visible`
    );

    elements.forEach((element) => {
      element.classList.remove('is-visible');
      revealedElementsRef.current.delete(element);

      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    });
  }, [selector]);

  return {
    revealElement,
    resetRevealed,
    observer: observerRef.current,
  };
};

export default useScrollReveal;
