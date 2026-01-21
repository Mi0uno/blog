import { ArticleCategory, Language } from '../types';

export interface ArticlesPageContent {
  title: string;
  description: string;
}

export const ARTICLES_PAGE_DATA: Record<Language, ArticlesPageContent> = {
  zh: {
    title: '文章',
    description: '个人思考、学习分享与生活记录。'
  },
  en: {
    title: 'Articles',
    description: 'Thoughts, learning journey, and life records.'
  }
};

// Import generated data
// We use require here because the generated file might not exist at compile time if we were using a bundler that checks existence,
// but since we are in Vite, we can just import it.
// However, to make it seamless, we should probably just replace this file's content with the generated content
// OR make this file re-export the generated content.
// But the user wants to "fix the logic", so replacing the hardcoded list with the generated one is the goal.

// Since we are generating `src/data/generated_articles.ts`, we can just import from there.
// But wait, `generated_articles.ts` exports `ARTICLE_DATA` as well.
// So we can just re-export it.

import { ARTICLE_DATA as GENERATED_DATA } from './generated_articles';

export const ARTICLE_DATA = GENERATED_DATA;
