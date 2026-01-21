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
      { text: "应用开发", annotation: "（vibe builder）", category: Category.DEV },
      { text: "炒粉炒饭", annotation: "（还在学）", category: null }
    ],
    intro: "懂安全的开发者才能构建更可靠的产品。|边学边做，MVP生活，迈向全栈，但更看重实际价值。",
    selectedWorks: "精选作品",
    featuredArticles: "精选文章",
    years: "[ 2021 — 2026 ]"
  },
  en: {
    heroItems: [
      { text: "Cybersecurity", annotation: "(Professional Field, Continuous Learning)", category: Category.DEV },
      { text: "Graphic & UI", annotation: "(Main Focus & Passion)", category: Category.DESIGN },
      { text: "Development", annotation: "(Vibe Coder)", category: Category.DEV },
      { text: "Cooking", annotation: "(Still Learning)", category: null }
    ],
    intro: "A developer who understands security can build more reliable products. | Learning by doing, living the MVP life, aiming for full-stack, but valuing actual impact above all.",
    selectedWorks: "Selected Works",
    featuredArticles: "Featured Articles",
    years: "[ 2021 — 2026 ]"
  }
};
