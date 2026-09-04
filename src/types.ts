export interface SkillCapability {
  id: string;
  title: string;
  shortDescription: string;
  category: 'mobile' | 'backend' | 'devops' | 'security' | 'ai' | 'iot';
  icon: string;
  badge: string;
  evidenceKey: string;
  skills: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  current?: boolean;
  summary: string;
  bulletPoints: {
    category: string;
    text: string;
    metrics?: string;
    capabilityTag: string;
  }[];
  technologies: string[];
  backedCapabilities: string[];
  featuredStat?: {
    value: string;
    label: string;
  };
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: 'mobile' | 'backend' | 'devops' | 'iot';
  categoryLabel: string;
  featured: boolean;
  bannerGradient: string;
  technologies: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  overview: string;
  challenge: string;
  solution: string;
  architectureHighlights: string[];
  results: string[];
  links?: {
    label: string;
    url: string;
    type: 'github' | 'live' | 'store' | 'docs';
  }[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  author: string;
  filename: string;
  format?: 'markdown' | 'html';
  content?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  inquiryType: string;
  message: string;
}

export interface ContactValidationErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface NotificationReceipt {
  receiptId: string;
  timestamp: string;
  senderName: string;
  senderEmail: string;
  inquiryType: string;
  subject: string;
  messageSnippet: string;
  targetEmail: string;
  status: 'delivered' | 'queued';
}
