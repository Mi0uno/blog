import { Language } from '../../types';

export interface FriendLink {
  id: string;
  title: string;
  url: string;
  description: string;
  avatar: string;
}

export interface FriendsPageContent {
  title: string;
  description: string;
  myProjectsTitle: string;
  friendlyLinksTitle: string;
  myProjects: FriendLink[];
  friendlyLinks: FriendLink[];
}

export const FRIENDS_DATA: Record<Language, FriendsPageContent> = {
  zh: {
    title: "友链 & 项目",
    description: "这里收录了我的一些其他项目以及朋友们的博客链接。",
    myProjectsTitle: "我的其他项目",
    friendlyLinksTitle: "友情链接",
    myProjects: [
      {
        id: 'p1',
        title: 'Mi0uno Blog',
        url: 'https://github.com/Mi0uno/blog',
        description: '本站源码，基于 React + Vite + TailwindCSS 构建。',
        avatar: '/logo.svg'
      }
    ],
    friendlyLinks: [
      {
        id: 'f1',
        title: '待添加',
        url: '#',
        description: '欢迎互换友链！',
        avatar: 'https://ui-avatars.com/api/?name=Friend&background=random'
      }
    ]
  },
  en: {
    title: "Friends & Links",
    description: "A collection of my other projects and links to friends' blogs.",
    myProjectsTitle: "My Other Projects",
    friendlyLinksTitle: "Friendly Links",
    myProjects: [
      {
        id: 'p1',
        title: 'Mi0uno Blog',
        url: 'https://github.com/Mi0uno/blog',
        description: 'Source code of this site, built with React + Vite + TailwindCSS.',
        avatar: '/logo.svg'
      }
    ],
    friendlyLinks: [
      {
        id: 'f1',
        title: 'Coming Soon',
        url: '#',
        description: 'Open for link exchange!',
        avatar: 'https://ui-avatars.com/api/?name=Friend&background=random'
      }
    ]
  }
};
