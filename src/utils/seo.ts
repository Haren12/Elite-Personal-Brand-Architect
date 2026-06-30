/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlogPost, NewsItem } from '../types';

const SITE_URL = 'https://harendralamsal.name.np';

export function getPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    'name': 'Harendra Lamsal',
    'url': SITE_URL,
    'image': `${SITE_URL}/harendra_profile.jpg`, // Real professional headshot (Absolute URL for Google Search integration)
    'email': 'harendralamsal4140@gmail.com',
    'jobTitle': 'Lead Full-Stack Developer & SEO Specialist',
    'description': 'Elite Software Engineer, WordPress Specialist, Digital Marketer and AI Strategist from Nepal.',
    'sameAs': [
      'https://github.com',
      'https://linkedin.com',
      'https://twitter.com',
      'https://harendralamsal.name.np'
    ],
    'knowsAbout': [
      'Web Development',
      'React',
      'Next.js',
      'WordPress',
      'Search Engine Optimization',
      'Digital Marketing',
      'Artificial Intelligence'
    ]
  };
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    'url': SITE_URL,
    'name': 'Harendra Lamsal | Portfolio, Blog & News Portal',
    'description': 'Professional personal portfolio, technology blog and tech news portal managed by Harendra Lamsal.',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${SITE_URL}/?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    'name': 'Lamsal Web Solutions',
    'url': SITE_URL,
    'logo': 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=400&q=80',
    'email': 'harendralamsal4140@gmail.com',
    'founder': {
      '@type': 'Person',
      'name': 'Harendra Lamsal'
    }
  };
}

export function getBreadcrumbSchema(links: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': links.map((link, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': link.name,
      'item': `${SITE_URL}${link.url}`
    }))
  };
}

export function getBlogPostingSchema(post: BlogPost, lang: 'en' | 'ne') {
  const t = lang === 'ne' ? post.translations.ne : post.translations.en;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${SITE_URL}/blog/${post.slug}#posting`,
    'headline': t.title,
    'description': t.excerpt,
    'image': post.featuredImage,
    'datePublished': post.publishedAt,
    'dateModified': post.publishedAt,
    'author': {
      '@type': 'Person',
      'name': post.author.name,
      'url': SITE_URL
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Harendra Lamsal',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=400&q=80'
      }
    },
    'mainEntityOfPage': `${SITE_URL}/blog/${post.slug}`
  };
}

export function getNewsArticleSchema(news: NewsItem, lang: 'en' | 'ne') {
  const t = lang === 'ne' ? news.translations.ne : news.translations.en;
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${SITE_URL}/news/${news.slug}#article`,
    'headline': t.title,
    'description': t.excerpt,
    'image': news.featuredImage,
    'datePublished': news.publishedAt,
    'dateModified': news.publishedAt,
    'author': {
      '@type': 'Person',
      'name': news.author,
      'url': SITE_URL
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Harendra News Portal',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=400&q=80'
      }
    },
    'mainEntityOfPage': `${SITE_URL}/news/${news.slug}`
  };
}
