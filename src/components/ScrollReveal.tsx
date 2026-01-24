import { useEffect, useRef, ReactNode } from 'react';
import { useScrollReveal, RevealAnimationType, UseScrollRevealOptions } from '../hooks/useScrollReveal';

/**
 * ScrollReveal 组件属性
 */
export interface ScrollRevealProps {
  /** 子元素 */
  children: ReactNode;
  /** 动画类型，默认 'fade-in-up' */
  animation?: RevealAnimationType;
  /** 延迟时间（毫秒），默认 0 */
  delay?: number;
  /** 持续时间（毫秒），默认 700 */
  duration?: number;
  /** 额外类名 */
  className?: string;
  /** 是否启用，默认 true */
  enabled?: boolean;
  /** 是否只触发一次，默认 true */
  once?: boolean;
  /** 自定义动画类名 */
  customAnimation?: string;
  /** 调试回调 */
  onReveal?: (element: HTMLElement) => void;
  /** 调试回调 */
  onUnreveal?: (element: HTMLElement) => void;
  /** 标签名，默认 'div' */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * ScrollReveal 组件
 * 
 * 封装滚动揭示动画的 React 组件。
 * 提供声明式 API，无需手动管理类名。
 * 
 * 特性：
 * - 声明式 API，易于使用
 * - 支持所有动画类型（fade-in-up, fade-in-down等）
 * - 可配置延迟和持续时间
 * - 支持自定义动画类名
 * - 自动处理 prefers-reduced-motion
 * - GPU 加速优化
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <ScrollReveal>
 *   <h1>标题</h1>
 * </ScrollReveal>
 * 
 * // 自定义动画
 * <ScrollReveal animation="fade-in-left" delay={200}>
 *   <p>从左侧淡入的内容</p>
 * </ScrollReveal>
 * 
 * // 自定义动画类
 * <ScrollReveal customAnimation="my-custom-animation">
 *   <div>自定义动画</div>
 * </ScrollReveal>
 * 
 * // 使用不同标签
 * <ScrollReveal as="section" animation="fade-in-scale">
 *   <h2>节标题</h2>
 *   <p>节内容</p>
 * </ScrollReveal>
 * 
 * // 带回调
 * <ScrollReveal onReveal={(el) => console.log('Revealed:', el)}>
 *   <div>带回调的内容</div>
 * </ScrollReveal>
 * ```
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-in-up',
  delay = 0,
  duration = 700,
  className = '',
  enabled = true,
  once = true,
  customAnimation,
  onReveal,
  onUnreveal,
  as = 'div',
}) => {
  const elementRef = useRef<HTMLElement>(null);

  // 使用 useScrollReveal hook
  useScrollReveal({
    selector: `[data-scroll-reveal]`,
    once,
    enabled,
    onReveal: (element) => {
      if (element === elementRef.current && onReveal) {
        onReveal(element);
      }
    },
    onUnreveal: (element) => {
      if (element === elementRef.current && onUnreveal) {
        onUnreveal(element);
      }
    },
  });

  // 构建类名
  const buildClassName = () => {
    const classes: string[] = [];

    // 添加基础类
    if (customAnimation) {
      classes.push(customAnimation);
    } else {
      classes.push(`reveal-${animation}`);
    }

    // 添加延迟类
    if (delay > 0) {
      classes.push(`delay-${delay}`);
    }

    // 添加持续时间类
    if (duration !== 700) {
      classes.push(`duration-${duration}`);
    }

    // 添加额外类名
    if (className) {
      classes.push(className);
    }

    return classes.join(' ');
  };

  // 构建内联样式
  const buildStyle = () => {
    const style: React.CSSProperties = {};

    // 如果使用自定义延迟，添加内联样式
    if (delay > 0 && !delay.toString().match(/^\d+$/)) {
      style.transitionDelay = `${delay}ms`;
    }

    // 如果使用自定义持续时间，添加内联样式
    if (duration !== 700 && !duration.toString().match(/^\d+$/)) {
      style.transitionDuration = `${duration}ms`;
    }

    return style;
  };

  // 渲染组件
  const Component = as as any;

  return (
    <Component
      ref={elementRef}
      data-scroll-reveal="true"
      className={buildClassName()}
      style={buildStyle()}
    >
      {children}
    </Component>
  );
};

/**
 * ScrollRevealProvider 组件属性
 */
export interface ScrollRevealProviderProps extends UseScrollRevealOptions {
  /** 子元素 */
  children: ReactNode;
}

/**
 * ScrollRevealProvider 组件
 * 
 * 全局配置滚动揭示动画的提供者组件。
 * 可以在应用顶层配置，所有子组件都会继承这些设置。
 * 
 * @example
 * ```tsx
 * <ScrollRevealProvider
 *   threshold={0.2}
 *   rootMargin="0px 0px -100px 0px"
 *   once={false}
 * >
 *   <App />
 * </ScrollRevealProvider>
 * ```
 */
export const ScrollRevealProvider: React.FC<ScrollRevealProviderProps> = ({
  children,
  ...options
}) => {
  useScrollReveal(options);

  return <>{children}</>;
};

/**
 * 预设的动画类型枚举
 */
export const REVEAL_ANIMATIONS = {
  FADE_IN_UP: 'fade-in-up' as RevealAnimationType,
  FADE_IN_DOWN: 'fade-in-down' as RevealAnimationType,
  FADE_IN_LEFT: 'fade-in-left' as RevealAnimationType,
  FADE_IN_RIGHT: 'fade-in-right' as RevealAnimationType,
  FADE_IN_SCALE: 'fade-in-scale' as RevealAnimationType,
  FADE_IN_BLUR: 'fade-in-blur' as RevealAnimationType,
} as const;

/**
 * 预设的延迟时间（毫秒）
 */
export const REVEAL_DELAYS = {
  NONE: 0,
  FAST: 100,
  NORMAL: 200,
  SLOW: 300,
  VERY_SLOW: 500,
} as const;

/**
 * 预设的持续时间（毫秒）
 */
export const REVEAL_DURATIONS = {
  FAST: 300,
  NORMAL: 500,
  SLOW: 700,
  VERY_SLOW: 1000,
  EXTRA_SLOW: 1500,
} as const;

export default ScrollReveal;
