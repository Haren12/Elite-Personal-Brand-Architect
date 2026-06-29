/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Translation {
  title: string;
  excerpt: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  author: {
    name: string;
    avatar: string;
    bioEn: string;
    bioNp: string;
    role: string;
  };
  translations: {
    en: Translation;
    ne: Translation; // Nepali
  };
  featuredImage: string;
  gallery?: string[];
  videoUrl?: string;
  categories: string[];
  tags: string[];
  publishedAt: string; // ISO Date
  isFeatured: boolean;
  isPopular: boolean;
  status: 'draft' | 'published' | 'scheduled';
  readingTimeMin: number;
  views: number;
  commentsCount: number;
}

export interface NewsItem {
  id: string;
  slug: string;
  translations: {
    en: Translation;
    ne: Translation;
  };
  featuredImage: string;
  videoUrl?: string;
  category: 'Artificial Intelligence' | 'Cyber Security' | 'Programming' | 'Web Development' | 'WordPress' | 'SEO' | 'Digital Marketing' | 'Startup' | 'Nepal News' | 'World News' | 'Opinion' | 'Tutorials' | 'Health & Wellness' | 'Education' | 'Business & Finance' | 'Lifestyle' | 'Sports & Fitness' | 'General News' | 'Travel & Tourism' | 'Entertainment' | 'Science & Technology' | 'Agriculture & Farming' | 'Food & Recipes' | string;
  tags: string[];
  publishedAt: string;
  isBreaking: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  isEditorsPick: boolean;
  isSticky: boolean;
  status: 'draft' | 'published' | 'scheduled';
  author: string;
  readingTimeMin: number;
  views: number;
}

export interface Skill {
  name: string;
  level: number; // 0 to 100
  category: 'Frontend' | 'Backend' | 'Database & DevOps' | 'SEO & Marketing' | 'AI & Special';
}

export interface Project {
  id: string;
  title: string;
  descriptionEn: string;
  descriptionNp: string;
  image: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface Experience {
  id: string;
  roleEn: string;
  roleNp: string;
  company: string;
  periodEn: string;
  periodNp: string;
  descriptionEn: string;
  descriptionNp: string;
}

export interface Service {
  id: string;
  titleEn: string;
  titleNp: string;
  descriptionEn: string;
  descriptionNp: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  roleEn: string;
  roleNp: string;
  company: string;
  contentEn: string;
  contentNp: string;
  avatar: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  imageUrl?: string;
  recipient?: string;
  instructor?: string;
  length?: string;
  credentialId?: string;
}

export interface Achievement {
  id: string;
  titleEn: string;
  titleNp: string;
  descriptionEn: string;
  descriptionNp: string;
  date: string;
}

export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl: string;
}

export interface AnalyticsData {
  visitorsCount: number;
  viewsCount: number;
  viewsHistory: { date: string; visitors: number; views: number }[];
  popularPosts: { title: string; views: number; type: 'blog' | 'news' }[];
  searchKeywords: { keyword: string; count: number }[];
  brokenLinks: { url: string; source: string; status: number }[];
}
