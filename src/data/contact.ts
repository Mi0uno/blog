import { Language } from '../../types';

export interface SocialLinks {
  wechat: string;
  xiaohongshu: string;
  bilibili: string;
  px500: string;
}

export interface ContactContent {
  baseLabel: string;
  locationValue: string;
  contactLabel: string;
  emailMeLabel: string;
  email: string;
  hello: string;
  intro: string;
  socials: SocialLinks;
  tooltip?: string;
  githubLabel: string;
  footerDesign: string;
}

export const CONTACT_DATA: Record<Language, ContactContent> = {
  zh: {
    baseLabel: "BASE",
    locationValue: "广东，深圳",
    contactLabel: "取得联系",
    emailMeLabel: "邮箱",
    email: "mi0034joy@163.com",
    hello: "你好 ;-)",
    intro: "欢迎探讨与合作。",
    socials: {
      wechat: "mi0034的实验房",
      xiaohongshu: "mi0034",
      bilibili: "mi0034",
      px500: "mi0034"
    },
    githubLabel: "GitHub",
    footerDesign: "Powered by Gemini 3 Pro"
  },
  en: {
    baseLabel: "BASE",
    locationValue: "ShenZhen, Guangdong",
    contactLabel: "Get in touch",
    emailMeLabel: "Email Me",
    email: "mi0034joy@163.com",
    hello: "Hello ;-)",
    intro: "Welcome to discuss & cooperate.",
    socials: {
      wechat: "mi0034's Lab",
      xiaohongshu: "mi0034",
      bilibili: "mi0034",
      px500: "mi0034"
    },
    githubLabel: "GitHub",
    footerDesign: "Powered by Gemini 3 Pro"
  }
};
