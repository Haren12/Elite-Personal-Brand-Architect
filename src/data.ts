/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlogPost, NewsItem, Skill, Project, Experience, Service, Testimonial, Certification, Achievement, AnalyticsData } from './types';

export const SKILLS_DATA: Skill[] = [
  { name: 'React / Next.js', level: 95, category: 'Frontend' },
  { name: 'TypeScript', level: 92, category: 'Frontend' },
  { name: 'Tailwind CSS', level: 98, category: 'Frontend' },
  { name: 'Vite & TanStack', level: 88, category: 'Frontend' },
  { name: 'Node.js / Express', level: 90, category: 'Backend' },
  { name: 'Supabase & PostgreSQL', level: 92, category: 'Database & DevOps' },
  { name: 'Firebase & Firestore', level: 85, category: 'Database & DevOps' },
  { name: 'Docker & Kubernetes', level: 75, category: 'Database & DevOps' },
  { name: 'WordPress Core / PHP', level: 94, category: 'Backend' },
  { name: 'Enterprise SEO', level: 96, category: 'SEO & Marketing' },
  { name: 'Digital Marketing', level: 92, category: 'SEO & Marketing' },
  { name: 'Google Analytics & GTM', level: 90, category: 'SEO & Marketing' },
  { name: 'Gemini & AI Prompting', level: 94, category: 'AI & Special' },
  { name: 'Machine Learning Basics', level: 70, category: 'AI & Special' }
];

export const EXPERIENCES_DATA: Experience[] = [
  {
    id: 'exp-1',
    roleEn: 'Founder & Lead Consultant',
    roleNp: 'संस्थापक तथा प्रमुख सल्लाहकार',
    company: 'Lamsal Web Solutions & Freelancing Brand',
    periodEn: '2022 - Present',
    periodNp: '२०२२ - हालसम्म',
    descriptionEn: 'Designed, developed, and optimized premium bespoke web applications, enterprise WordPress themes, and tailored SEO architectures for national and international clients. Engineered highly efficient marketing campaigns driving thousands of leads.',
    descriptionNp: 'स्वदेशी तथा विदेशी ग्राहकहरूका लागि प्रिमियम वेभ एपहरू, एण्टरप्राइज वर्डप्रेस थिमहरू र एसईओ आर्किटेक्चरहरूको डिजाइन, विकास र अप्टिमाइजेशन। हजारौं लीडहरू सिर्जना गर्ने कुशल डिजिटल मार्केटिङ अभियानहरूको सञ्चालन।'
  },
  {
    id: 'exp-2',
    roleEn: 'Senior Full Stack & SEO Developer',
    roleNp: 'वरिष्ठ फुल-स्ट्याक तथा एसईओ डेभलपर',
    company: 'Nepal Tech Innovation Group',
    periodEn: '2020 - 2022',
    periodNp: '२०२० - २०२२',
    descriptionEn: 'Led a cross-functional development team building high-performance react platforms. Implemented strict WCAG accessibility guidelines, structured schema markups, and secured automated deployment pipelines on Vercel and AWS.',
    descriptionNp: 'उच्च प्रदर्शन गर्ने रियाक्ट प्लेटफर्महरू निर्माण गर्न डेभलपमेण्ट टोलीको नेतृत्व। WCAG पहुँचयोग्यता निर्देशिकाहरू, व्यवस्थित स्कीमा मार्कअपहरू र भर्सेल र एडब्लुएसमा स्वचालित डिप्लोयमेण्ट पाइपलाइनहरूको स्थापना।'
  },
  {
    id: 'exp-3',
    roleEn: 'Web Development & WordPress Specialist',
    roleNp: 'वेभ विकास तथा वर्डप्रेस विशेषज्ञ',
    company: 'Kathmandu Software Hub',
    periodEn: '2018 - 2020',
    periodNp: '२०१८ - २०२०',
    descriptionEn: 'Customized complex plugins and themes, optimized site load speeds (achieving sub-second performance on critical landing pages), and led technical SEO audits for major technology blogs.',
    descriptionNp: 'जटिल वर्डप्रेस प्लगइन र थिमहरूको निर्माण, वेभसाइट लोड हुने गति सुधार (मुख्य ल्याण्डिङ पेजहरूमा सेकेन्ड भन्दा कम समय), र प्रमुख प्रविधि ब्लगहरूको प्राविधिक एसईओ अडिट।'
  }
];

export const SERVICES_DATA: Service[] = [
  {
    id: 'srv-1',
    titleEn: 'Enterprise Web Development',
    titleNp: 'एण्टरप्राइज वेभ विकास',
    descriptionEn: 'Crafting ultra-fast, robust React, Next.js, and static websites designed for maximum performance, clean visual layouts, and responsive interaction.',
    descriptionNp: 'अधिकतम पर्फर्मेन्स, सफा र आकर्षक लेआउटका साथै उत्तरदायी रियाक्ट, नेक्स्ट डट जेएस र स्ट्याटिक वेभसाइटहरूको निर्माण।',
    icon: 'Terminal'
  },
  {
    id: 'srv-2',
    titleEn: 'Advanced SEO & Speed Optimization',
    titleNp: 'उच्च-स्तरीय एसईओ र गति अप्टिमाइजेशन',
    descriptionEn: 'Improving organic visibility and search rankings using advanced schema strategies, perfect Core Web Vitals, and keyword orchestration.',
    descriptionNp: 'वैज्ञानिक स्कीमा रणनीतिहरू, उत्कृष्ट कोर वेभ भाइटल्स र किवर्ड व्यवस्थापनको मद्दतले अर्गानिक सर्च र्‍याङ्किङमा सुधार।',
    icon: 'TrendingUp'
  },
  {
    id: 'srv-3',
    titleEn: 'Custom WordPress Architecture',
    titleNp: 'कस्टम वर्डप्रेस आर्किटेक्चर',
    descriptionEn: 'Developing secure, scalable WordPress themes and customized plugin ecosystems built without bloated libraries or page-speed bottlenecks.',
    descriptionNp: 'सुरक्षित, स्केलेबल वर्डप्रेस थिम र प्लगइन इकोसिस्टमहरूको विकास, जसले वेभसाइटको गतिलाई कहिल्यै ढिलो बनाउँदैन।',
    icon: 'Cpu'
  },
  {
    id: 'srv-4',
    titleEn: 'AI Solutions & Conversational Bots',
    titleNp: 'एआई सोलुसन र च्याटबोटहरू',
    descriptionEn: 'Integrating modern Gemini AI models to automate content generation, localized translations, smart content suggestions, and live interaction layers.',
    descriptionNp: 'सामग्री सिर्जना, स्थानीय अनुवाद र प्रयोगकर्ता अन्तरक्रिया स्वचालित गर्न आधुनिक जेमिनाई एआई मोडलहरूको एकीकरण।',
    icon: 'Sparkles'
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 'prj-1',
    title: 'Nepal Tech Hub Platform',
    descriptionEn: 'A high-performance technology portal featuring breaking local news, live programming tutorials, and custom digital marketing telemetry tools.',
    descriptionNp: 'ताजा नेपाली प्रविधि समाचार, प्रोग्रामिङ ट्यूटोरियल र डिजिटल मार्केटिङ उपकरणहरू समेटिएको उच्च प्रदर्शन क्षमता भएको डिजिटल पोर्टल।',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'Next.js', 'PostgreSQL', 'SEO Schema'],
    demoUrl: 'https://harendralamsal.name.np',
    githubUrl: 'https://github.com',
    featured: true
  },
  {
    id: 'prj-2',
    title: 'Lamsal Analytics Console',
    descriptionEn: 'An open-source SEO crawling framework that automatically audits meta structures, analyzes search trends, and flags broken links on thousands of pages.',
    descriptionNp: 'हजारौं पेजहरूमा एसईओ मेटा संरचना अडिट गर्ने, सर्च ट्रेण्ड्स विश्लेषण गर्ने र बिग्रेका लिङ्कहरू पहिचान गर्ने खुला स्रोत एनालिटिक्स प्लेटफर्म।',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    tags: ['TypeScript', 'Tailwind', 'D3.js', 'Vite'],
    demoUrl: 'https://harendralamsal.name.np',
    githubUrl: 'https://github.com',
    featured: true
  },
  {
    id: 'prj-3',
    title: 'Sanskrit-Nepali Translation API',
    descriptionEn: 'AI-assisted semantic router that uses Gemini models to translate ancient philosophy documents into standard English and localized Nepali text.',
    descriptionNp: 'प्राचीन दर्शन सम्बन्धी सामग्रीहरूलाई अङ्ग्रेजी र नेपाली भाषामा भावानुवाद गर्न जेमिनाई मोडल प्रयोग गरिएको एआई अनुवाद प्रणाली।',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    tags: ['Gemini API', 'Express', 'Node.js', 'TypeScript'],
    demoUrl: 'https://harendralamsal.name.np',
    githubUrl: 'https://github.com',
    featured: false
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'tst-1',
    name: 'Bishnu Prasad Pokharel',
    roleEn: 'Chief Technology Officer',
    roleNp: 'मुख्य प्रविधि अधिकृत',
    company: 'Himalayan Digital Solutions',
    contentEn: 'Harendra possesses a rare combination of pure development skills and deep tactical SEO knowledge. Our search engine traffic grew by 350% within four months of implementing his optimized custom React framework.',
    contentNp: 'हरेन्द्रसँग उत्कृष्ट प्रोग्रामिङ सीप र गहिरो एसईओ ज्ञानको दुर्लभ संयोजन छ। उहाँले डिजाइन गर्नुभएको रियाक्ट फ्रेमवर्क लागू गरेको चार महिनाभित्र हाम्रो सर्च इन्जिन ट्राफिक ३५०% ले वृद्धि भयो।',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'tst-2',
    name: 'Dr. Aaradhya Sharma',
    roleEn: 'Digital Marketing Director',
    roleNp: 'डिजिटल मार्केटिङ निर्देशक',
    company: 'Aura Media International',
    contentEn: 'Working with Harendra on custom WordPress architectures and AI-driven content pipelines has been game-changing. He delivers highly robust code ahead of schedule, with impeccable accessibility and responsive design.',
    contentNp: 'कस्टम वर्डप्रेस र एआई-सञ्चालित सामग्री विकासमा हरेन्द्रसँग काम गर्नु असाधारण रह्यो। उहाँले तोकिएको समय अगावै उत्कृष्ट पहुँचयोग्यता र रेस्पोन्सिभ डिजाइन सहितको उत्कृष्ट कोड उपलब्ध गराउनुहुन्छ।',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

export const CERTIFICATIONS_DATA: Certification[] = [
  {
    id: 'cert-1',
    title: 'Complete web development course',
    issuer: 'Udemy',
    date: 'June 28, 2026',
    credentialUrl: 'https://ude.my/UC-b44c0cd2-6616-478b-95aa-e50de3973c3f',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    recipient: 'Harendra Lamsal',
    instructor: 'Hitesh Choudhary',
    length: '100 total hours',
    credentialId: 'UC-b44c0cd2-6616-478b-95aa-e50de3973c3f'
  },
  {
    id: 'cert-2',
    title: 'Build a free website with WordPress',
    issuer: 'Coursera',
    date: 'June 28, 2026',
    credentialUrl: 'https://coursera.org/verify/YYQ4WCFDL2IA',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    recipient: 'Harendra Lamsal',
    instructor: 'Delphine Sangotokun, MPH, Ph.D. (Public Health specialist)',
    length: 'Guided Project',
    credentialId: 'YYQ4WCFDL2IA'
  }
];

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 'ach-1',
    titleEn: 'First Place - National Nepal AI Hackathon',
    titleNp: 'प्रथम स्थान - राष्ट्रिय नेपाल एआई ह्याकाथन',
    descriptionEn: 'Built an offline-first regional AI health consultation engine that supports text-to-speech in remote dialects.',
    descriptionNp: 'दूरदराजका स्थानीय भाषाहरूमा आवाज मार्फत स्वास्थ्य सल्लाह दिने अफलाइन-फर्स्ट स्वास्थ्य परामर्श प्रणाली निर्माण गरी प्रथम स्थान हासिल।',
    date: '2024'
  },
  {
    id: 'ach-2',
    titleEn: 'Vercel Community Contributor Recognition',
    titleNp: 'भर्सेल कम्युनिटी कन्ट्रीब्युटर सम्मान',
    descriptionEn: 'Contributed performance optimizations to serverless static generators, reducing build cold-starts.',
    descriptionNp: 'सर्भरलेस स्ट्याटिक जेनेरेटरहरूमा गति सुधार सम्बन्धी योगदान, जसले वेभसाइट बिल्ड हुने समय घटाउन मद्दत गर्यो।',
    date: '2023'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'optimizing-react-19-server-side-rendering',
    author: {
      name: 'Harendra Lamsal',
      avatar: '/harendra_profile.jpg',
      bioEn: 'Harendra is a leading Full Stack developer specializing in React, high-performance SEO, and AI integrations.',
      bioNp: 'हरेन्द्र रियाक्ट, उच्च-स्तरीय एसईओ र एआई एकीकरणमा दख्खल राख्ने एक अग्रणी फुल-स्ट्याक डेभलपर हुन्।',
      role: 'Chief Solution Architect'
    },
    translations: {
      en: {
        title: 'Mastering React 19 SSR for Advanced Performance and Flawless SEO',
        excerpt: 'React 19 brings powerful advancements in Server-Side Rendering (SSR). Discover how to eliminate hydration mismatches, orchestrate optimal caching structures, and boost Core Web Vitals to rank #1.',
        content: `### Introduction to React 19 Server Features

React 19 marks a major evolutionary step for web developers. With native Support for Actions, Server Components, and refined asset loading, we can build web solutions that feel instantaneous and rank exceptionally well on search engines.

#### The Hydration Mismatch Conundrum

Hydration mismatches are the enemy of enterprise SEO. When your server-rendered HTML differs by a single character from the client-rendered output, the browser throws an error, discards the prerendered DOM, and reconstructs it. This destroys performance metrics like **Interaction to Next Paint (INP)**.

To avoid this, always structure state carefully:
- Avoid utilizing client-specific variables (like \`window.innerWidth\` or local times) during the initial render.
- Wrap environment-sensitive components in a structured client-only hook or trigger state inside \`useEffect\`.

\`\`\`tsx
// Safe React 19 dynamic client component pattern
import { useState, useEffect } from 'react';

export function SafeClientTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);

  if (!time) return <span className="animate-pulse">Loading...</span>;
  return <span>{time}</span>;
}
\`\`\`

#### Complete Schema Integration

For flawless indexing, React 19 natively handles document metadata:

\`\`\`tsx
export function ArticleSeo({ post }) {
  return (
    <>
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt
        })}
      </script>
    </>
  );
}
\`\`\`

By ensuring perfectly formed JSON-LD script blocks are embedded directly inside server-side responses, search crawlers can parse and index rich results on Google in real-time. This is how we achieve a 100% SEO Lighthouse rating.`
      },
      ne: {
        title: 'रियाक्ट १९ एसएसआर (SSR): उत्कृष्ट गति र सर्वोत्कृष्ट एसईओका लागि अन्तिम गाइड',
        excerpt: 'रियाक्ट १९ ले सर्भर-साइड रेण्डरिङमा ठूलो परिवर्तन ल्याएको छ। हाइड्रेशन गल्तीहरू कसरी हटाउने, क्यासिङलाई व्यवस्थित कसरी गर्ने र सर्च इन्जिनमा पहिलो स्थानमा कसरी आउने भन्ने कुरा यहाँ सिक्नुहोस्।',
        content: `### रियाक्ट १९ सर्भर विशेषताहरूको परिचय

रियाक्ट १९ वेभ डेभलपरहरूका लागि एउटा ठूलो फड्को हो। सर्भर कम्पोनेण्ट र द्रुत एसेट लोडिङका कारण हामीले तत्काल रेस्पोन्स गर्ने र सर्च इन्जिनमा शीर्ष स्थान प्राप्त गर्ने वेभसाइट निर्माण गर्न सक्छौं।

#### हाइड्रेशन (Hydration) समस्या समाधान

हाइड्रेशन त्रुटिहरू एसईओका लागि हानिकारक मानिन्छन्। जब सर्भरबाट आएको HTML र ब्राउजरमा लोड भएको रियाक्ट कोडमा थोरै मात्र भिन्नता हुन्छ, ब्राउजरले गल्ती देखाउँछ। यसले वेभसाइटको गति सुस्त बनाउँछ।

यसबाट बच्नका लागि सधैं सजग रहनुहोस्:
- सुरुवाती रेण्डरिङमा \`window.innerWidth\` वा स्थानीय समय जस्ता क्लाइण्ट-विशिष्ट कुराहरू प्रयोग नगर्नुहोस्।
- \`useEffect\` भित्र मात्र यस्ता स्टेटहरू सेट गर्नुहोस्।

\`\`\`tsx
// सुरक्षित रियाक्ट १९ क्लाइण्ट प्याटर्न
import { useState, useEffect } from 'react';

export function SafeClientTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);

  if (!time) return <span className="animate-pulse">लोड हुँदैछ...</span>;
  return <span>{time}</span>;
}
\`\`\`

#### पूर्ण स्कीमा मार्कअप एकीकरण

उत्कृष्ट सर्च रिजल्ट्सका लागि रियाक्ट १९ मा सिधै मेटाडेटा लोड गर्न सकिन्छ। यसले गुगल बोटलाई सामग्री सजिलै बुझ्न मद्दत गर्दछ र हाम्रो एसईओ र्‍याङ्किङ सधैं अगाडि रहन्छ।`
      }
    },
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    categories: ['Web Development', 'React'],
    tags: ['React 19', 'SSR', 'SEO', 'Core Web Vitals'],
    publishedAt: '2026-06-25T10:00:00Z',
    isFeatured: true,
    isPopular: true,
    status: 'published',
    readingTimeMin: 6,
    views: 1240,
    commentsCount: 14
  },
  {
    id: 'blog-2',
    slug: 'advanced-wordpress-headless-graphql-architecture',
    author: {
      name: 'Harendra Lamsal',
      avatar: '/harendra_profile.jpg',
      bioEn: 'Harendra is a leading Full Stack developer specializing in React, high-performance SEO, and AI integrations.',
      bioNp: 'हरेन्द्र रियाक्ट, उच्च-स्तरीय एसईओ र एआई एकीकरणमा दख्खल राख्ने एक अग्रणी फुल-स्ट्याक डेभलपर हुन्।',
      role: 'Chief Solution Architect'
    },
    translations: {
      en: {
        title: 'Architecting Headless WordPress with GraphQL and TanStack Start',
        excerpt: 'Decouple your Content Management System (CMS) without losing native features. Learn to build high-security headless WordPress setups connected via high-speed GraphQL queries.',
        content: `### Why Headless WordPress?

Traditional WordPress is phenomenal for content editing, but standard monolithic architectures often suffer from performance bottlenecks, bloated database queries, and security vulnerabilities. By decoupling WordPress, we use it strictly as a Headless CMS, while our front-end uses TanStack Start or custom React.

#### The GraphQL API Advantage

Using WPGraphQL provides a clean, single-endpoint graph structure rather than the multiple nested endpoints required by standard REST APIs. This drastically reduces the number of roundtrips and optimizes mobile data consumption.

\`\`\`graphql
# Fetch featured posts with lightweight payload
query GetFeaturedPosts {
  posts(where: { categoryName: "Technology" }, first: 10) {
    nodes {
      id
      title
      slug
      excerpt
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
}
\`\`\`

#### Absolute Security & RLS

When your public frontend never talks directly to the SQL database, SQL injections are completely eliminated. Keep your administration panel hosted on a private, firewalled domain while routing content delivery through CDN edges. This is how modern technology enterprises operate.`
      },
      ne: {
        title: 'ग्राफक्यूएल (GraphQL) र रियाक्टको प्रयोग गरी हेडलेस वर्डप्रेसको निर्माण',
        excerpt: 'आफ्नो कन्टेण्ट म्यानेजमेण्ट सिस्टम (CMS) लाई डि-कपल गरी गति र सुरक्षा दोब्बर बनाउनुहोस्। ग्राफक्यूएल र प्रिमियम फ्रण्टइण्ड सेटअप बारे विस्तृत सिक्नुहोस्।',
        content: `### हेडलेस वर्डप्रेस किन ?

परम्परागत वर्डप्रेस सामग्री सम्पादनका लागि उत्कृष्ट छ, तर यसले वेभसाइट लोड हुने गति सुस्त बनाउन सक्छ र सुरक्षामा जोखिम हुन सक्छ। वर्डप्रेसलाई हेडलेस बनाएर कन्टेण्ट एपीआईका रूपमा प्रयोग गर्दा गति र सुरक्षा असाधारण हुन्छ।

#### ग्राफक्यूएल एपीआईको फाइदा

WPGraphQL को प्रयोगले साधारण REST API को तुलनामा एकैपटकमा धेरै डेटा थोरै पेलोडमा तान्न मद्दत गर्छ। यसले गर्दा मोबाइल प्रयोगकर्ताहरूका लागि वेभसाइट लोड हुने समय सेकेन्डको सानो अंशमा घट्दछ।`
      }
    },
    featuredImage: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=1200&q=80',
    categories: ['WordPress', 'SEO'],
    tags: ['Headless CMS', 'GraphQL', 'Security', 'Performance'],
    publishedAt: '2026-06-20T14:30:00Z',
    isFeatured: false,
    isPopular: true,
    status: 'published',
    readingTimeMin: 5,
    views: 890,
    commentsCount: 8
  }
];

export const INITIAL_NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    slug: 'google-gemini-1-5-pro-redefines-multimodal-context-windows-coding',
    translations: {
      en: {
        title: 'Google Gemini 1.5 Pro Unveiled: Redefining Multimodal Context Windows and Enterprise Coding Workflows',
        excerpt: 'Google officially rolls out Gemini 1.5 Pro, featuring an industry-first 2 million token context window. With native audio/video understanding and advanced coding intelligence, it establishes a new pinnacle for AI-driven software engineering.',
        content: `### The Multimodal Quantum Leap in Generative AI

Google has officially released **Gemini 1.5 Pro**, introducing a revolutionary 2-million token context window that fundamentally changes how developers and enterprises build software. This massive context capacity allows the model to process up to 1 hour of video, 11 hours of audio, over 30,000 lines of code, or 700,000 words in a single prompt.

#### Redefining Developer Workflows

With native multimodal understanding, developers can now upload entire codebases or complex system documentation directly into the context window. Gemini 1.5 Pro can reason across large repositories, trace bugs across hundreds of files, suggest architectural improvements, and generate high-fidelity boilerplate code with zero lag.

#### Cross-Modal Reasoning and Audio Understanding

A key breakthrough in the Gemini 1.5 Pro model is its ability to perform high-fidelity audio understanding and multimodal reasoning. Developers can pass recorded team meetings, legacy video tutorials, or system design audio recordings, and the model will instantly extract structured schemas, API designs, and execution logs with absolute precision. This is set to redefine localized tech hubs, customer service channels, and automated coding pipelines worldwide.`
      },
      ne: {
        title: 'गुगल जेमिनाई १.५ प्रो सार्वजनिक: २ लाख टोकन कन्टेक्स्ट विन्डो र प्रोग्रामिङ क्षमतामा ऐतिहासिक फड्को',
        excerpt: 'गुगलले औपचारिक रूपमा जेमिनाई १.५ प्रो सार्वजनिक गरेको छ, जसमा संसारकै पहिलो २ लाख (२ मिलियन) टोकन क्षमताको कन्टेक्स्ट विन्डो रहेको छ। यसले भिडियो, अडियो र कोडिङ विश्लेषणमा नयाँ आयाम थपेको छ।',
        content: `### मल्टिमोडल जेनेरेटिभ एआईमा नयाँ युगको सुरुवात

गुगलले आधिकारिक रूपमा **जेमिनाई १.५ प्रो** सार्वजनिक गरेको छ, जसले २ लाख (२ मिलियन) टोकन क्षमताको कन्टेक्स्ट विन्डो मार्फत प्रविधि र सफ्टवेयर विकासको क्षेत्रलाई पूर्ण रूपमा रूपान्तरण गरेको छ। यस ऐतिहासिक क्षमताले गर्दा अब प्रयोगकर्ताले १ घण्टाको भिडियो, ११ घण्टाको अडियो, वा ३०,००० भन्दा बढी लाइन भएको सम्पूर्ण कोडबेस एकै पटक प्रम्प्टमा राखेर विश्लेषण गर्न सक्छन्।

#### सफ्टवेयर इन्जिनियरिङमा यसको प्रभाव

सफ्टवेयर डेभलपरहरूले अब आफ्नो सम्पूर्ण प्रोजेक्टको कोडबेस जेमिनाई १.५ प्रोमा अपलोड गरेर बगहरू पत्ता लगाउन, नयाँ फिचरहरू थप्न, वा सिस्टम आर्किटेक्चरलाई सुदृढ बनाउन सक्छन्। यसले कोडिङ र रिफ्याक्टरिङको गतिलाई दश गुणा बढाउने निश्चित छ।`
      }
    },
    featuredImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    category: 'Artificial Intelligence',
    tags: ['Google Gemini', 'AI', 'Technology News', 'Software Engineering'],
    publishedAt: '2026-06-28T09:15:00Z',
    isBreaking: true,
    isTrending: true,
    isFeatured: true,
    isEditorsPick: true,
    isSticky: true,
    status: 'published',
    author: 'Harendra Lamsal',
    readingTimeMin: 4,
    views: 4500
  },
  {
    id: 'news-2',
    slug: 'cybersecurity-alert-quantum-resistant-encryption-mandated',
    translations: {
      en: {
        title: 'NIST Finalizes Post-Quantum Cryptography Standards: What Developers Must Know Now',
        excerpt: 'The National Institute of Standards and Technology (NIST) has finalized its first set of quantum-resistant encryption algorithms. Standard protocols must migrate to avoid security threats.',
        content: `### The Quantum Threat is Real

Cryptographers have long warned about "Harvest Now, Decrypt Later" strategies employed by malicious actors. Quantum computing is advancing at a rapid rate, posing a threat to traditional RSA and ECC cryptography protocols.

#### The Finalized Algorithms

NIST has mandated the integration of Kyber (now ML-KEM) for general encryption, alongside Dilithium (ML-DSA) for digital signatures. Web developers must begin preparing their database architectures and security schemas to ensure future-proof compliance.

#### Action Plan for Software Architects

1. Audit all systems currently storing encrypted personal or financial records.
2. Upgrade Node.js and local server packages to secure versions supporting quantum-resistant TLS handshakes.
3. Establish multi-layered verification layers to guarantee full data protection.`
      },
      ne: {
        title: 'क्वाण्टम-प्रतिरोधी ईन्क्रिप्शन (Encryption) मापदण्डहरू अन्तिम चरणमा: सुरक्षित भविष्यका लागि नयाँ नियम',
        excerpt: 'राष्ट्रिय मापदण्ड तथा प्रविधि संस्थान (NIST) ले क्वाण्टम कम्प्युटरले समेत तोड्न नसक्ने नयाँ सुरक्षा एल्गोरिदमहरू स्वीकृत गरेको छ। यो प्रविधि अब सम्पूर्ण वेभसाइटहरूमा लागू हुनुपर्नेछ।',
        content: `### क्वाण्टम प्रविधिको सुरक्षा चुनौती

क्वाण्टम कम्प्युटिङको तीव्र विकाससँगै पुराना सुरक्षा प्रणालीहरू (RSA/ECC) सजिलै ह्याक हुन सक्ने जोखिम बढेको छ। यस जोखिमलाई कम गर्न NIST ले नयाँ मापदण्डहरू घोषणा गरेको छ।

#### नयाँ एल्गोरिदमहरू

सुरक्षाका लागि 'Kyber' र डिजिटल हस्ताक्षरका लागि 'Dilithium' एल्गोरिदमहरू अनिवार्य गरिएका छन्। यसले वित्तीय डाटाहरू र व्यक्तिगत सूचनाहरूलाई भविष्यमा समेत पूर्ण रूपमा सुरक्षित राख्न मद्दत गर्नेछ।`
      }
    },
    featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    category: 'Cyber Security',
    tags: ['Cyber Security', 'Encryption', 'NIST', 'Quantum Computing'],
    publishedAt: '2026-06-27T16:45:00Z',
    isBreaking: false,
    isTrending: true,
    isFeatured: false,
    isEditorsPick: true,
    isSticky: false,
    status: 'published',
    author: 'Harendra Lamsal',
    readingTimeMin: 5,
    views: 2310
  },
  {
    id: 'news-3',
    slug: 'kathmandu-startup-hub-launches-regional-tech-incubator',
    translations: {
      en: {
        title: 'Kathmandu Startup Hub Launches Regional Technology Incubator and Seed Fund',
        excerpt: 'A brand-new venture fund of $500,000 is launched in Kathmandu to support young Nepalese software engineers building local-first solutions.',
        content: `### Driving Innovation in Nepal

Kathmandu is quickly becoming a vibrant startup ecosystem in South Asia. Today, leading industry experts and investors announced the opening of a new $500k incubator dedicated to funding scalable local-first SaaS startups.

#### Local Talent, Global Impact

The initiative aims to provide office space, high-speed fiber internet, cloud compute credits, and mentoring on advanced web engineering, SEO growth strategies, and enterprise licensing. Applications are open to teams of students and freelancers across Nepal.`
      },
      ne: {
        title: 'काठमाडौंमा प्रादेशिक प्रविधि इन्क्युबेटर र बीउ कोष (Incubator & Seed Fund) सुरु',
        excerpt: 'नेपालका युवा सफ्टवेयर इन्जिनियरहरूलाई सहयोग गर्ने उद्देश्यले काठमाडौंमा $५,००,००० को नयाँ उद्यमशील कोष घोषणा गरिएको छ।',
        content: `### नेपालमा प्रविधिको विकास

काठमाडौं द्रुत गतिमा दक्षिण एसियाको एउटा प्रमुख प्रविधि केन्द्र बन्दैछ। नेपाली प्रतिभाहरूलाई उद्यमशीलतामा जोड्न र नयाँ प्रविधि कम्पनीहरूलाई अन्तर्राष्ट्रिय बजारमा लैजान यो बीउ कोष कोसेढुङ्गा सावित हुने अपेक्षा गरिएको छ।`
      }
    },
    featuredImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    category: 'Startup',
    tags: ['Nepal', 'Kathmandu', 'Startup', 'Incubator'],
    publishedAt: '2026-06-26T08:00:00Z',
    isBreaking: false,
    isTrending: false,
    isFeatured: true,
    isEditorsPick: false,
    isSticky: false,
    status: 'published',
    author: 'Harendra Lamsal',
    readingTimeMin: 3,
    views: 1420
  }
];

export const INITIAL_ANALYTICS: AnalyticsData = {
  visitorsCount: 14820,
  viewsCount: 38290,
  viewsHistory: [
    { date: '06-22', visitors: 1100, views: 2400 },
    { date: '06-23', visitors: 1300, views: 2900 },
    { date: '06-24', visitors: 1250, views: 2700 },
    { date: '06-25', visitors: 1600, views: 3400 },
    { date: '06-26', visitors: 1900, views: 4200 },
    { date: '06-27', visitors: 2200, views: 4900 },
    { date: '06-28', visitors: 2500, views: 5600 }
  ],
  popularPosts: [
    { title: 'Google Gemini 1.5 Pro Unveiled: Redefining Multimodal Context Windows', views: 4500, type: 'news' },
    { title: 'NIST Finalizes Post-Quantum Cryptography Standards', views: 2310, type: 'news' },
    { title: 'Mastering React 19 SSR for Advanced Performance and Flawless SEO', views: 1240, type: 'blog' },
    { title: 'Architecting Headless WordPress with GraphQL and TanStack', views: 890, type: 'blog' }
  ],
  searchKeywords: [
    { keyword: 'React 19 SEO optimization', count: 480 },
    { keyword: 'Harendra Lamsal portfolio', count: 320 },
    { keyword: 'Headless WordPress GraphQL Nepal', count: 180 },
    { keyword: 'Gemini 1.5 Pro 2M context', count: 150 },
    { keyword: 'Nepal cybersecurity standards', count: 120 }
  ],
  brokenLinks: [
    { url: '/old-blog/wordpress-performance-hacks-2021', source: '/blog', status: 404 },
    { url: '/downloads/resume_v1_pdf', source: '/about', status: 404 }
  ]
};
