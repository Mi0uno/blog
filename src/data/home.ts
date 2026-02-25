import { Language, Category } from '../../types';

export interface HeroItem {
  text: string;
  annotation: string;
  category: Category | null;
}

export interface HomeContent {
  heroItems: HeroItem[];
  intro: string;
  selectedWorks: string;
  featuredArticles: string;
  years: string;
}

export const HOME_DATA: Record<Language, HomeContent> = {
  zh: {
    heroItems: [
      { text: "网络安全", annotation: "（专业领域，持续学习）", category: Category.DEV },
      { text: "平面交互", annotation: "（当前主攻，兴趣所在）", category: Category.DESIGN },
      { text: "应用开发", annotation: "（AI驱动人脑）", category: Category.DEV },
      { text: "手冲咖啡", annotation: "（主要用于维持生命体征）", category: null }
    ],
    intro: "边学边做，让健康和成功永远伴随你我",
    selectedWorks: "精选作品",
    featuredArticles: "精选文章",
    years: "[ 2025 — 2026 ]"
  },
  en: {
    heroItems: [
      { text: "Cybersecurity", annotation: "(Professional Field, Continuous Learning)", category: Category.DEV },
      { text: "Graphic & UI", annotation: "(Main Focus & Passion)", category: Category.DESIGN },
      { text: "Development", annotation: "(Vibe Coder)", category: Category.DEV },
      { text: "Pour-over Coffee", annotation: "(Sustaining Life Signs)", category: null }
    ],
    intro: "Learn by doing. Health and success to us both.",
    selectedWorks: "Selected Works",
    featuredArticles: "Featured Articles",
    years: "[ 2021 — 2026 ]"
  }
};
