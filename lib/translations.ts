export type Language = "en" | "zh";

export const translations = {
  // Navigation
  nav: {
    about: { en: "About", zh: "关于" },
    research: { en: "Research", zh: "研究" },
    projects: { en: "Projects", zh: "作品" },
    music: { en: "Music", zh: "音乐" },
    musicSpecimens: { en: "Music Specimens", zh: "声音标本" },
    blog: { en: "Blog", zh: "随笔" },
    knowledge: { en: "Knowledge", zh: "知识库" },
    cv: { en: "CV", zh: "简历" },
  },

  // Branding
  brand: {
    echo: { en: "Echo", zh: "回声" },
    garden: { en: "Garden", zh: "花园" },
  },

  // Home page
  home: {
    tagline: {
      en: "A space for sound, research & growing ideas",
      zh: "一处关于声音、研究与生长的角落",
    },
    welcome: {
      en: "Hello, welcome to Echo Garden",
      zh: "你好，欢迎来到回声花园",
    },
    description: {
      en: "A quiet digital garden where research meets creation. Here you will find daily sound improvisations, essays on listening, and traces of inquiry into sonic interaction and embodied computing.",
      zh: "一座安静的数字花园，研究与创作在此相遇。这里有日常的声音即兴、关于聆听的随笔，以及对声音交互与具身计算的探索痕迹。",
    },
    exploreTitle: { en: "Explore the Garden", zh: "探索花园" },
    recentUpdates: { en: "Recent Updates", zh: "最近动态" },
    viewAllUpdates: { en: "View all updates", zh: "查看全部" },
    ongoingCollection: { en: "Ongoing collection", zh: "持续收录中" },
    established: { en: "Est. 2024", zh: "始于 2024" },
  },

  // Garden pages (for home page cards)
  gardenPages: {
    about: {
      title: { en: "About", zh: "关于" },
      points: {
        en: ["Who I am", "Research interests", "Background"],
        zh: ["关于我", "研究兴趣", "学术背景"],
      },
    },
    research: {
      title: { en: "Research", zh: "研究" },
      points: {
        en: ["Sonic interaction", "Embodied computing", "Current focus"],
        zh: ["声音交互", "具身计算", "当前方向"],
      },
    },
    projects: {
      title: { en: "Projects", zh: "作品" },
      points: {
        en: ["Cross-disciplinary work", "Prototypes", "Experiments"],
        zh: ["跨学科实践", "原型制作", "探索实验"],
      },
    },
    musicSpecimens: {
      title: { en: "Music Specimens", zh: "声音标本" },
      points: {
        en: ["Daily improvisations", "Sound notes", "Piano pieces"],
        zh: ["日常即兴", "声音札记", "钢琴小品"],
      },
    },
    blog: {
      title: { en: "Blog", zh: "随笔" },
      points: {
        en: ["Essays", "Reflections", "Collected fragments"],
        zh: ["随想录", "思绪碎片", "文字收集"],
      },
    },
    knowledge: {
      title: { en: "Knowledge", zh: "知识库" },
      points: {
        en: ["Reference notes", "Formulas", "Learning traces"],
        zh: ["参考笔记", "公式整理", "学习痕迹"],
      },
    },
  },

  // Audio player
  audioPlayer: {
    nowPlaying: { en: "Now playing", zh: "正在播放" },
    shuffleToDiscover: { en: "Shuffle to discover", zh: "随机聆听" },
    viewAllSpecimens: { en: "View all specimens", zh: "查看全部标本" },
    shuffle: { en: "Shuffle", zh: "随机" },
  },

  // About page
  about: {
    title: { en: "About", zh: "关于" },
    greeting: {
      en: "Hi, I am a graduate researcher in Media Arts & Sciences, advised by",
      zh: "你好，我是媒体艺术与科学方向的研究生，导师是",
    },
    advisorName: { en: "Prof. Advisor Name", zh: "导师姓名" },
    greetingEnd: { en: "Nice to meet you here.", zh: "很高兴在这里与你相遇。" },
    
    whatICareAbout: { en: "What I Care About", zh: "我关心的问题" },
    curiosity: {
      en: "I am curious about the relationship between sound and body:",
      zh: "我好奇声音与身体之间的关系：",
    },
    questions: {
      en: [
        "How can sound respond to gesture, breath, and presence?",
        "What happens when we design instruments that listen back?",
        "How does spatial audio shape our sense of place?",
      ],
      zh: [
        "声音如何回应手势、呼吸与在场？",
        "当我们设计出能够倾听的乐器时，会发生什么？",
        "空间音频如何塑造我们对场所的感知？",
      ],
    },

    whereFrom: { en: "Where I Come From & Where I Am Going", zh: "我从哪里来，要去哪里" },
    background: {
      en: "I studied Mechanical Engineering as an undergraduate, where I first encountered acoustics and became fascinated by how physical systems produce sound. That curiosity led me to explore instrument design, then interactive media, and eventually here.",
      zh: "本科时我学习机械工程，在那里第一次接触声学，并对物理系统如何产生声音产生了浓厚兴趣。这份好奇引领我探索乐器设计，后来是交互媒体，最终来到这里。",
    },
    currentWork: {
      en: "Right now, I am building sonic interfaces that respond to breath and movement — trying to make technology feel less like a tool and more like a conversation.",
      zh: "现在，我正在构建能够响应呼吸和动作的声音界面——试图让技术不再只是工具，而更像是一场对话。",
    },

    beyondLab: { en: "Beyond the Lab", zh: "实验室之外" },
    personalLife: {
      en: "When I am not in the lab, I spend time improvising on piano, walking in botanical gardens, and collecting field recordings of everyday sounds.",
      zh: "不在实验室的时候，我会在钢琴上即兴演奏，在植物园里散步，收集日常生活中的声音。",
    },

    researchInterests: { en: "Research Interests", zh: "研究方向" },
    interests: {
      en: ["Sonic Interaction Design", "Embodied Computing", "Spatial Audio", "Tangible Interfaces"],
      zh: ["声音交互设计", "具身计算", "空间音频", "实体交互"],
    },

    explore: { en: "Explore", zh: "探索更多" },
    researchJourney: { en: "Research Journey", zh: "研究历程" },
    soundDiary: { en: "Sound Diary", zh: "声音日记" },
    writing: { en: "Writing", zh: "文字" },
    graduateResearcher: { en: "Graduate Researcher", zh: "研究生" },
    department: { en: "Media Arts & Sciences", zh: "媒体艺术与科学" },
  },

  // Research page
  research: {
    pageTitle: { en: "Research", zh: "研究" },
    subtitle: { en: "Research Journey", zh: "研究历程" },
    description: {
      en: "A path of deepening questions. Three long-term projects that trace a journey from initial curiosity through exploration to focused research practice.",
      zh: "一条不断深入的提问之路。三个长期项目，从最初的好奇，到探索，再到专注的研究实践。",
    },
    currentFocus: { en: "Current Focus", zh: "当前方向" },
    explore: { en: "Explore", zh: "探索" },
    journeyTitle: { en: "The Journey", zh: "研究旅程" },
    viewProject: { en: "View project", zh: "查看详情" },
    inquiryContinues: { en: "The inquiry continues", zh: "探索仍在继续" },
    current: { en: "Current", zh: "进行中" },
    phases: {
      encounter: { en: "Encounter", zh: "初遇" },
      exploration: { en: "Exploration", zh: "探索" },
      inquiry: { en: "Inquiry", zh: "深究" },
    },
    present: { en: "Present", zh: "至今" },
  },

  // Projects page
  projects: {
    pageTitle: { en: "Projects", zh: "作品" },
    subtitle: { en: "Project Archive", zh: "作品档案" },
    description: {
      en: "Cross-disciplinary work spanning mechanical, hardware, software, and acoustic domains.",
      zh: "跨学科实践，涵盖机械、硬件、软件与声学领域。",
    },
    projects: { en: "projects", zh: "个作品" },
    viewProject: { en: "View project", zh: "查看详情" },
    viewDetails: { en: "View details", zh: "查看详情" },
    filterDomain: { en: "Domain", zh: "领域" },
    filterType: { en: "Type", zh: "类型" },
    filterSkills: { en: "Skills", zh: "技能" },
    clear: { en: "Clear", zh: "清除" },
    clearAll: { en: "Clear all filters", zh: "清除所有筛选" },
    allProjects: { en: "All Projects", zh: "全部作品" },
    filteredResults: { en: "Filtered Results", zh: "筛选结果" },
    noMatch: { en: "No projects match the current filters", zh: "没有符合筛选条件的作品" },
    crossDisciplinary: { en: "Cross-disciplinary work", zh: "跨学科实践" },
  },

  // Music Specimens page (diary)
  diary: {
    pageTitle: { en: "Music Specimens", zh: "声音标本" },
    subtitle: { en: "Specimen Cabinet", zh: "标本柜" },
    preserved: { en: "preserved", zh: "件收藏" },
  },

  // Blog page
  blog: {
    pageTitle: { en: "Blog", zh: "随笔" },
    subtitle: { en: "Reading Room", zh: "阅读室" },
    description: {
      en: "Essays and collected fragments on sound, listening, and the practice of attention.",
      zh: "关于声音、聆听与专注力实践的随想与碎片。",
    },
    essays: { en: "Essays", zh: "文章" },
    notes: { en: "Notes", zh: "札记" },
    fragments: { en: "Fragments", zh: "碎片" },
    readMore: { en: "Read more", zh: "阅读更多" },
    read: { en: "Read", zh: "阅读" },
    collectedWritings: { en: "Collected writings", zh: "文字收集" },
  },

  // Knowledge page
  knowledge: {
    pageTitle: { en: "Knowledge", zh: "知识库" },
    subtitle: { en: "Reference Grove", zh: "参考林" },
    entries: { en: "entries", zh: "条目" },
    search: { en: "Search notes, formulas...", zh: "搜索笔记、公式..." },
    allTopics: { en: "All topics", zh: "全部主题" },
    viewEntry: { en: "View entry", zh: "查看详情" },
    all: { en: "All", zh: "全部" },
    allEntries: { en: "All Entries", zh: "全部条目" },
    resultsFor: { en: "Results for", zh: "搜索结果" },
    noMatches: { en: "No matches for", zh: "未找到" },
    noEntriesYet: { en: "No entries yet", zh: "暂无条目" },
    clearSearch: { en: "Clear search", zh: "清除搜索" },
    match: { en: "match", zh: "条结果" },
    matches: { en: "matches", zh: "条结果" },
  },

  // CV page
  cv: {
    pageTitle: { en: "Curriculum Vitae", zh: "简历" },
    subtitle: { en: "Curriculum Vitae", zh: "个人简历" },
    description: { en: "Academic background, publications, and experience.", zh: "学术背景、发表与经历。" },
    education: { en: "Education", zh: "教育背景" },
    experience: { en: "Experience", zh: "经历" },
    publications: { en: "Publications", zh: "发表" },
    skills: { en: "Skills", zh: "技能" },
    downloadPdf: { en: "Download PDF", zh: "下载 PDF" },
    lastUpdated: { en: "Last updated", zh: "最近更新" },
  },

  // Common
  common: {
    viewAll: { en: "View all", zh: "查看全部" },
    readMore: { en: "Read more", zh: "阅读更多" },
    back: { en: "Back", zh: "返回" },
    loading: { en: "Loading...", zh: "加载中..." },
  },
} as const;

// Helper function to get translation
export function t(
  key: string,
  lang: Language
): string {
  const keys = key.split(".");
  let value: any = translations;
  
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  if (value && typeof value === "object" && lang in value) {
    return value[lang];
  }
  
  return key;
}
