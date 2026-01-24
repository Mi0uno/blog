
export type Language = 'zh' | 'en';

export enum Category {
  ALL = 'All',
  VIDEO = 'Videography',
  DESIGN = 'Graphics & UI',
  PHOTO = 'Photography',
  DEV = 'Development',
  ARTICLE = 'Article'
}

export enum ArticleCategory {
  DIT = 'DiT', // 数媒与课程
  LUNA = 'LUNA', // 影像相关
  TALK = '瞎叨be叨', // 杂记
  AFTER8 = 'After8', // 聊艺术
  SERENITY = '山海疗养院' // 游记
}

export interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  link: string; // WeChat Official Account Link OR path to local markdown file
  coverImage?: string; // Optional, will fallback if not provided
  date?: string;
  isLocal?: boolean; // Whether this is a local markdown article
  tags?: string[]; // Article tags for filtering
  star?: boolean; // Whether this is a featured article
}

export interface ProjectCommon {
  category: string;
  image: string;
  icon?: string;
  websiteUrl?: string;
  githubUrl?: string;
}

export interface ProjectLocalized {
  title: string;
  subtitle: string;
  description: string;
  role: string;
  tags: string[];
  concept?: string;
  roleDetail?: string;
  awards?: string[];
}

export interface Project {
  id: string;
  star?: boolean;
  common: ProjectCommon;
  zh: ProjectLocalized;
  en: ProjectLocalized;
}

export interface Experience {
  id: string;
  year: string;
  title: string;
  institution: string;
  description: string;
  type: 'education' | 'work';
}

export interface Skill {
  name: string;
  level: number; // 0-100
  icon?: string;
}

export interface CompetitionGroup {
  level: string;
  awards: string[];
}

export interface HonorsData {
  scholarships: string[];
  titles: string[];
  competitions: CompetitionGroup[];
}
