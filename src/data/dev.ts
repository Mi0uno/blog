import { Project } from '../../types';

export const DEV_DATA: Project[] = [
  {
    id: 'dev1',
    common: {
      category: 'Development',
      image: '', // Placeholder
      icon: 'message-circle',
      websiteUrl: 'https://wechat-msganalysis-krgkfhfdcxwmtwst4jc4bw.streamlit.app/',
      githubUrl: 'https://github.com/mi0034/WeChat-MsgAnalysis'
    },
    zh: {
      title: '微信聊天记录数据分析',
      subtitle: 'Python / Streamlit',
      description: '对json格式的聊天记录进行完整的分析，包含时段、内容和互动模式。',
      role: '全栈开发',
      tags: ['Python', 'Streamlit', '数据分析'],
      roleDetail: "独立完成后端数据处理逻辑与前端可视化界面开发。"
    },
    en: {
      title: 'WeChat Msg Analysis',
      subtitle: 'Python / Streamlit',
      description: 'Comprehensive analysis of JSON chat records, including time slots, content, and interaction patterns.',
      role: 'Full Stack Developer',
      tags: ['Python', 'Streamlit', 'Data Analysis'],
      roleDetail: "Independently completed backend data processing logic and frontend visualization interface development."
    }
  },
  {
    id: 'dev2',
    common: {
      category: 'Development',
      image: '', // Placeholder
      icon: 'id-card',
      websiteUrl: 'https://mi0034.github.io/LUNA-Badge/',
      githubUrl: 'https://github.com/mi0034/LUNA-Badge'
    },
    zh: {
      title: '工牌生成器',
      subtitle: 'React / Tailwind',
      description: '具有设计感的自定义工牌生成应用。',
      role: 'vibe builder',
      tags: ['React', 'Tailwind CSS'],
      roleDetail: "You`re absolutely RIGHT!"
    },
    en: {
      title: 'LUNA-Badge Generator',
      subtitle: 'React / Tailwind',
      description: 'A designer badge generator application with custom styles.',
      role: 'vibe builder',
      tags: ['React', 'Tailwind CSS'],
      roleDetail: "You`re absolutely RIGHT!"
    }
  },
  {
    id: 'dev3',
    common: {
      category: 'Development',
      image: '', // Placeholder
      icon: 'file-text',
      websiteUrl: 'https://mi0034.github.io/Md2Design/',
      githubUrl: 'https://github.com/mi0034/Md2Design'
    },
    zh: {
      title: 'Md2Design',
      subtitle: 'React 19 / Tailwind v4',
      description: '将 Markdown 内容快速转换为适合社媒宣发的美观卡片。支持自动分页、浮动图层、自定义字体与样式，以及一键导出 PNG/JPG。',
      role: 'vibe builder',
      tags: ['React 19', 'Tailwind v4', 'Framer Motion', 'Zustand', '工具'],
      roleDetail: "基于 Gemini 3 Pro 与 Trae IDE 开发。"
    },
    en: {
      title: 'Md2Design',
      subtitle: 'React 19 / Tailwind v4',
      description: 'Quickly turn plain Markdown into beautifully styled cards for social media promotion. Supports auto pagination, floating layers, custom fonts, and one-click export.',
      role: 'vibe builder',
      tags: ['React 19', 'Tailwind v4', 'Framer Motion', 'Zustand', 'Tool'],
      roleDetail: "Developed with Gemini 3 Pro & Trae IDE."
    }
  },
  {
    id: 'dev4',
    common: {
      category: 'Development',
      image: '', // Placeholder
      icon: 'film',
      websiteUrl: 'https://mi0034.github.io/CineViz/',
      githubUrl: 'https://github.com/mi0034/CineViz'
    },
    zh: {
      title: 'CineViz',
      subtitle: 'React / Tailwind',
      description: '基于计量电影学的视频节奏与视觉分析工具。',
      role: 'vibe builder',
      tags: ['React', 'Tailwind CSS', 'TypeScript'],
      roleDetail: "请理解我的意思，再生成一次，不要修改前面的代码"
    },
    en: {
      title: 'CineViz',
      subtitle: 'React / Tailwind',
      description: 'A video rhythm and visual analysis tool based on movie theory.',
      role: 'vibe builder',
      tags: ['React', 'Tailwind CSS', 'TypeScript'],
      roleDetail: "Please understand my meaning, and generate it again. Do not modify the code before."
    }
  },
  {
    id: 'dev5',
    common: {
      category: 'Development',
      image: '', // Placeholder
      icon: 'shield',
      githubUrl: 'https://github.com/mi0034/Security-Toolkit'
    },
    zh: {
      title: '网络安全工具包',
      subtitle: 'Python / Bash',
      description: '包含漏洞扫描、密码破解和网络监控的综合安全工具集。',
      role: '安全工程师',
      tags: ['Python', 'Bash', '网络安全', '渗透测试'],
      roleDetail: "自主开发的安全工具，用于学习和实践网络安全技术。"
    },
    en: {
      title: 'Cybersecurity Toolkit',
      subtitle: 'Python / Bash',
      description: 'Comprehensive security toolkit including vulnerability scanning, password cracking, and network monitoring.',
      role: 'Security Engineer',
      tags: ['Python', 'Bash', 'Cybersecurity', 'Penetration Testing'],
      roleDetail: "Self-developed security tools for learning and practicing cybersecurity techniques."
    }
  }
];
