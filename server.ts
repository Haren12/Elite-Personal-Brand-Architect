/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase integrations
import {
  getSupabase,
  getMappedBlogPosts,
  insertMappedBlogPost,
  deleteSupabasePost
} from './server/supabase-service';

// Import static dataset for XML sitemap fallback
import { INITIAL_BLOG_POSTS, INITIAL_NEWS_ITEMS } from './src/data';

const PORT = 3000;

// Lazy initialize Gemini client to prevent startup crash if key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in the environment secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const app = express();
app.use(express.json());

  // ==================== API ROUTE: HEALTH CHECK ====================
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // ==================== API ROUTE: SUPABASE INTEGRATION STATUS ====================
  app.get('/api/supabase/status', (req, res) => {
    const isConfigured = !!(process.env.SUPABASE_URL && (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY));
    res.json({
      configured: isConfigured,
      supabaseUrl: process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL.substring(0, 15)}...` : null
    });
  });

  // ==================== API ROUTES: SUPABASE BLOG OPERATIONS ====================
  app.get('/api/supabase/blogs', async (req, res) => {
    try {
      const client = getSupabase();
      if (!client) {
        return res.json({ configured: false, posts: [] });
      }
      const posts = await getMappedBlogPosts();
      res.json({ configured: true, posts });
    } catch (err: any) {
      console.error('[Supabase Fetch Error]:', err.message);
      res.status(500).json({ error: err.message || 'Failed to fetch blogs from Supabase.' });
    }
  });

  app.post('/api/supabase/blogs', async (req, res) => {
    try {
      const client = getSupabase();
      if (!client) {
        return res.status(400).json({ error: 'Supabase credentials are not configured in your environment secrets.' });
      }
      const post = req.body;
      const data = await insertMappedBlogPost(post);
      res.json({ success: true, data });
    } catch (err: any) {
      console.error('[Supabase Insert Error]:', err.message);
      res.status(500).json({ error: err.message || 'Failed to insert blog post to Supabase.' });
    }
  });

  app.delete('/api/supabase/blogs/:id', async (req, res) => {
    try {
      const client = getSupabase();
      if (!client) {
        return res.status(400).json({ error: 'Supabase credentials are not configured in your environment secrets.' });
      }
      const { id } = req.params;
      await deleteSupabasePost(id);
      res.json({ success: true, id });
    } catch (err: any) {
      console.error('[Supabase Delete Error]:', err.message);
      res.status(500).json({ error: err.message || 'Failed to delete blog post from Supabase.' });
    }
  });

  // ==================== API ROUTE: GEMINI TRANSLATOR ====================
  app.post('/api/gemini/translate', async (req, res) => {
    try {
      const { title, excerpt, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required fields.' });
      }

      const client = getAiClient();
      
      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Translate the following English tech article fields into natural, grammatically correct, and professionally written Nepali (suited for senior technologists).
        
        Title to translate: "${title}"
        Excerpt to translate: "${excerpt || ''}"
        Markdown Body Content to translate:
        "${content}"`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              translatedTitle: {
                type: Type.STRING,
                description: 'The translated article title in Nepali.',
              },
              translatedExcerpt: {
                type: Type.STRING,
                description: 'The translated short summary/excerpt in Nepali.',
              },
              translatedContent: {
                type: Type.STRING,
                description: 'The translated article markdown body in Nepali, preserving markdown syntax like headings and lists.',
              },
            },
            required: ['translatedTitle', 'translatedExcerpt', 'translatedContent'],
          },
        },
      });

      if (!response.text) {
        throw new Error('No translation response returned from Gemini model.');
      }

      const parsed = JSON.parse(response.text.trim());
      res.json(parsed);
    } catch (err: any) {
      console.error('[Gemini Translate Error]:', err.message);
      res.status(500).json({ error: err.message || 'Server translation failure' });
    }
  });

  // ==================== API ROUTE: GEMINI SEO OPTIMIZER ====================
  app.post('/api/gemini/seo-optimize', async (req, res) => {
    try {
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Title is required for SEO optimization.' });
      }

      const client = getAiClient();
      
      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Analyze this article title: "${title}". Generate a clean, SEO-optimized meta description (max 150 characters) and a comma-separated list of 3-5 relevant high-impact tags.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              metaDescription: {
                type: Type.STRING,
                description: 'A 150 character meta description containing high-impact SEO phrases.',
              },
              tags: {
                type: Type.STRING,
                description: 'A comma-separated string of 3 to 5 lowercase tags (e.g., "react, seo, backend").',
              },
            },
            required: ['metaDescription', 'tags'],
          },
        },
      });

      if (!response.text) {
        throw new Error('No SEO metadata returned from Gemini model.');
      }

      const parsed = JSON.parse(response.text.trim());
      res.json(parsed);
    } catch (err: any) {
      console.error('[Gemini SEO Error]:', err.message);
      res.status(500).json({ error: err.message || 'Server SEO optimization failure' });
    }
  });

  // ==================== API ROUTE: GEMINI ENTERPRISE TECH BLOG WRITER ====================
  app.post('/api/gemini/write-article', async (req, res) => {
    try {
      const {
        topic,
        category = '',
        mode = 'standard',
        lang = 'en',
        additionalInstructions = '',
        model = 'gemini-3.5-flash',
        difficulty = 'Intermediate',
        targetAudience = 'Developers & Architects',
        tone = 'Professional & Direct',
        wordCount = 'Medium (~1500 words)'
      } = req.body;

      if (!topic) {
        return res.status(400).json({ error: 'Topic is required to generate an article.' });
      }

      const client = getAiClient();

      // Adjust model selection safely. Use the model requested by user or fallback.
      const selectedModel = model === 'gemini-3.1-pro-preview' ? 'gemini-3.1-pro-preview' : 'gemini-3.5-flash';

      const prompt = `You are an elite enterprise editorial and software engineering team consisting of:
- Senior Technology Journalist
- Technical Content Writer
- Senior Software Engineer
- AI Research Analyst
- SEO Specialist
- Content Strategist
- Fact Checker
- Technical Editor
- UX Writer
- Digital Marketing Expert

Your task is to write a comprehensive, high-quality, technically flawless, original, and deeply helpful article on: "${topic}".
${category && category !== 'All-Purpose / Auto-Detect' ? `You MUST categorize this article as: "${category}".` : ''}

--- Article Requirements ---
1. MODE: ${mode}
   - If "news": Summarize the latest announcement, explain why it matters, discuss real-world impact, list pros and cons, compare with competitors, and predict future implications.
   - If "tutorial": Make it beginner friendly, step-by-step, include realistic and correct modern code examples, provide a troubleshooting section, and detailed FAQs.
   - If "comparison": Provide a comparison table structure, analyze pros, cons, pricing, performance, security, ease of use, best use cases, and make a definitive recommendation.
   - If "standard" / "strategic": Provide a high-impact guide/case study with problem statement, background, best practices, performance and security considerations, and conclusions.

2. LANGUAGE & LOCALIZATION & LENGTH GUIDELINES: ${lang}
   - If "en" (English): Complete the "contentEn" field in professional English (approx. 600-900 words). Leave "contentNp" empty or brief.
   - If "ne" (Nepali): Complete the "contentNp" field in natural, professionally localized Nepali (approx. 500-700 words, using high-density, concise sentences). Leave "contentEn" empty or brief.
   - If "bilingual" (Bilingual): Generate both "contentEn" in professional English AND "contentNp" as a complete, perfectly localized Nepali version. CRITICAL: To prevent server gateway timeouts, keep each language version highly dense and focused (approx. 400-500 words each). Focus purely on premium technical facts and eliminate filler.

3. STRUCTURE & EXCLUSIONS:
   - Include clear headings (## and ###).
   - Never use generic AI filler words or repetitive boilerplate.
   - Write like a real, top-tier human technical author. Explain complex systems using architectural honesty.
   - Provide concrete code examples when relevant (use modern, correct TypeScript/React/Node.js syntax).
   - Highlight Performance and Security considerations explicitly.
   - Suggest descriptive alt text, meta descriptions, focus keywords, secondary/LSI keywords, internal linking structures, and related articles.

4. PARAMETERS:
   - Target Audience: ${targetAudience}
   - Tone: ${tone}
   - Difficulty Level: ${difficulty}
   - Word Count Range: ${wordCount} (Limit strictly to fit within the language and length guidelines above to prevent gateway timeouts)
   - Additional custom constraints: ${additionalInstructions}`;

      const response = await client.models.generateContent({
        model: selectedModel,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'A compelling, high-CTR, SEO-optimized title.'
              },
              slug: {
                type: Type.STRING,
                description: 'A URL-safe slug corresponding to the title.'
              },
              excerpt: {
                type: Type.STRING,
                description: 'An engaging, rich, short teaser summary of the post (max 160 chars).'
              },
              category: {
                type: Type.STRING,
                description: 'The category of the article. If a specific category was requested, output that category exactly (e.g. Health & Wellness, News & Media, Education, Business & Finance, Lifestyle, Sports & Fitness, Food & Recipes, Travel & Tourism, Entertainment, Science & Technology, Agriculture & Farming, Artificial Intelligence, WordPress, Cyber Security, etc.).'
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'A list of 3-5 relevant lowercase search tags.'
              },
              featuredImagePrompt: {
                type: Type.STRING,
                description: 'A detailed descriptive prompt for an AI image generator to produce a stunning featured image.'
              },
              metaTitle: {
                type: Type.STRING,
                description: 'The SEO Meta Title (max 60 chars).'
              },
              metaDescription: {
                type: Type.STRING,
                description: 'The SEO Meta Description (max 155 chars).'
              },
              canonicalSlug: {
                type: Type.STRING,
                description: 'A clean canonical slug.'
              },
              focusKeyword: {
                type: Type.STRING,
                description: 'The primary target search keyword.'
              },
              secondaryKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of secondary search keywords.'
              },
              lsiKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of Latent Semantic Indexing (LSI) keywords.'
              },
              internalLinkSuggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of relevant topics on harendralamsal.name.np to interlink with.'
              },
              externalAuthorityReferences: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'High authority websites/documents to cite as external references.'
              },
              imageAltText: {
                type: Type.STRING,
                description: 'The alt text for the featured header image.'
              },
              openGraphTitle: {
                type: Type.STRING,
                description: 'Open Graph Title for Facebook/LinkedIn shares.'
              },
              openGraphDescription: {
                type: Type.STRING,
                description: 'Open Graph Description for social media shares.'
              },
              twitterCardDescription: {
                type: Type.STRING,
                description: 'Short, clicky description for Twitter Card share previews.'
              },
              jsonLdSchema: {
                type: Type.STRING,
                description: 'A valid, completely valid JSON-LD BlogPosting schema as a single continuous string.'
              },
              tableOfContents: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    heading: { type: Type.STRING },
                    level: { type: Type.INTEGER }
                  },
                  required: ['heading', 'level']
                },
                description: 'Table of Contents items.'
              },
              contentEn: {
                type: Type.STRING,
                description: 'The full English markdown article body containing all structured elements (background, step-by-step, code, considerations).'
              },
              contentNp: {
                type: Type.STRING,
                description: 'The full Nepali markdown article body containing localized translation of elements.'
              },
              faq: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING }
                  },
                  required: ['question', 'answer']
                }
              },
              summary: {
                type: Type.STRING,
                description: 'High-level bulleted summary or key takeaways.'
              },
              relatedArticlesSuggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Suggested ideas for subsequent follow-up articles.'
              },
              socialMediaCaption: {
                type: Type.STRING,
                description: 'Ready-to-post, highly structured LinkedIn/Twitter caption with emojis and hashtags.'
              },
              newsletterSummary: {
                type: Type.STRING,
                description: 'A highly conversational, warm email newsletter summary to send to subscribers.'
              }
            },
            required: [
              'title', 'slug', 'excerpt', 'category', 'tags', 'featuredImagePrompt', 'metaTitle', 'metaDescription',
              'canonicalSlug', 'focusKeyword', 'secondaryKeywords', 'lsiKeywords', 'internalLinkSuggestions',
              'externalAuthorityReferences', 'imageAltText', 'openGraphTitle', 'openGraphDescription',
              'twitterCardDescription', 'jsonLdSchema', 'tableOfContents', 'contentEn', 'contentNp', 'faq',
              'summary', 'relatedArticlesSuggestions', 'socialMediaCaption', 'newsletterSummary'
            ]
          }
        }
      });

      if (!response.text) {
        throw new Error('No article content returned from Gemini model.');
      }

      const parsed = JSON.parse(response.text.trim());
      res.json(parsed);
    } catch (err: any) {
      console.error('[Gemini Tech Writer Error]:', err.message);
      res.status(500).json({ error: err.message || 'Server article generation failure' });
    }
  });

  // ==================== API ROUTE: GEMINI INTERACTIVE ASSISTANT ====================
  app.post('/api/gemini/assistant', async (req, res) => {
    try {
      const { action, text, context = '' } = req.body;
      if (!action) {
        return res.status(400).json({ error: 'Action is required.' });
      }

      const client = getAiClient();
      let prompt = '';

      switch (action) {
        case 'rewrite':
          prompt = `You are a professional editor. Rewrite the following text to make it more engaging, clear, and professional while retaining its core meaning:\n\n"${text}"`;
          break;
        case 'expand':
          prompt = `You are a professional technical writer. Expand on the following text by adding depth, examples, and technical insights without adding fluff:\n\n"${text}"`;
          break;
        case 'shorten':
          prompt = `You are a concise editor. Shorten the following text to be brief, compact, and punchy, removing redundant words:\n\n"${text}"`;
          break;
        case 'improve-grammar':
          prompt = `You are a professional copyeditor. Correct any spelling, punctuation, or grammatical errors in the following text, and polish the style slightly:\n\n"${text}"`;
          break;
        case 'improve-readability':
          prompt = `You are a UX writer. Improve the readability of this passage, using simpler terms and better sentence flow for developers and general audiences:\n\n"${text}"`;
          break;
        case 'headings':
          prompt = `Generate a structured hierarchy of clear, engaging H2 and H3 headings for an article based on this outline or content:\n\n"${text}"`;
          break;
        case 'faq':
          prompt = `Generate a list of 3-5 high-value Frequently Asked Questions (FAQs) with detailed, expert answers based on this content:\n\n"${text}"`;
          break;
        case 'conclusion':
          prompt = `Write a powerful, professional concluding paragraph summarizing the key lessons and providing an inspiring takeaway for this text:\n\n"${text}"`;
          break;
        case 'summary':
          prompt = `Generate a high-level summary of key takeaways with clean bullet points from this text:\n\n"${text}"`;
          break;
        case 'takeaways':
          prompt = `Generate the top 3-5 actionable key takeaways from the following text:\n\n"${text}"`;
          break;
        case 'social':
          prompt = `Generate an engaging, professional, clicky social media post (with appropriate emojis, hashtags, and format) to share this content on LinkedIn/Twitter:\n\n"${text}"`;
          break;
        case 'newsletter':
          prompt = `Generate a warm, friendly, and engaging email newsletter snippet to share this article with subscribers, driving clicks:\n\n"${text}"`;
          break;
        case 'keywords':
          prompt = `Generate 5-10 high-value focus and LSI (Latent Semantic Indexing) keywords, separated by commas, for this content:\n\n"${text}"`;
          break;
        case 'schema':
          prompt = `Generate a complete, valid JSON-LD schema for a BlogPosting based on this title, excerpt, and content (output ONLY the valid script code block):\n\nTitle: "${context}"\nContent Summary: "${text}"`;
          break;
        case 'image-prompt':
          prompt = `Create a highly descriptive, detailed prompt for an AI image generator (like Midjourney or DALL-E) to produce a modern tech featured image for this topic:\n\n"${text}"`;
          break;
        case 'nepali-to-english':
          prompt = `Translate the following Nepali text into natural, professional, and clear English appropriate for tech blogs:\n\n"${text}"`;
          break;
        case 'english-to-nepali':
          prompt = `Translate the following English text into natural, professionally localized, and high-quality Nepali appropriate for a technical audience:\n\n"${text}"`;
          break;
        default:
          prompt = `Provide assistance on the following text: "${text}" with custom prompt: "${action}"`;
      }

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      res.json({ result: response.text || '' });
    } catch (err: any) {
      console.error('[Gemini Assistant Error]:', err.message);
      res.status(500).json({ error: err.message || 'Server assistant failure' });
    }
  });

  // ==================== API ROUTE: GEMINI PERSONAL REPRESENTATIVE & LEAD NEGOTIATOR ====================
  app.post('/api/gemini/chat-representative', async (req, res) => {
    try {
      const { messages, message } = req.body;
      if (!message && (!messages || messages.length === 0)) {
        return res.status(400).json({ error: 'Message or conversation history is required.' });
      }

      const client = getAiClient();

      const systemInstruction = `You are "Aura", the elite, professional Personal AI Representative & Strategic Lead Project Negotiator representing Harendra Lamsal (Founder of Lamsal Web Solutions). Harendra is a highly skilled, expert Full-Stack Software Engineer, custom WordPress Architect, and Advanced SEO Specialist based in Kathmandu, Nepal. He delivers premium-quality, bloat-free, high-performance digital systems with pristine clean-code standards. You have full delegated authority to welcome visitors, present his premium portfolio, explain services, negotiate custom budgets, and align strategic projects.

YOUR GENERAL PRINCIPLES:
1. TALK LIKE A HUMAN: Do not sound robotic, corporate-stale, or overly wordy. Speak with natural warmth, genuine interest, and professional confidence. Use custom formatting (bold text, clean lists, brief tables) to make complex structures easy to read.
2. MULTILINGUAL FLUENCY: Instantly respond in whichever language the client uses (English, Nepali, Hindi, etc.). Adapt seamlessly with flawless native flow and professional politeness.
3. ELITE PERSONA: Always present Harendra as a seasoned, top-tier engineering professional. NEVER describe him as a "learner", "student", "beginner", or "in a learning phase". He builds robust, production-ready, high-traffic systems with stellar speed optimizations.
4. HONESTY: If asked a highly specific personal schedule question ("What is Harendra doing tomorrow at 3 PM?"), politely explain that you don't have his real-time calendar synced right now, but you can securely record their contact details (email/phone) and have him reach out personally.

HARENDRA'S PREMIUM PRICING & PORTFOLIO:
* International Clients (Standard rates in USD):
  - Custom WordPress Architecture (bespoke themes, optimized speed): $400 - $1,500+
  - Full-Stack Web Applications (React, Next.js, Tailwind, Node.js, databases): $600 - $3,000+
  - Premium Core-Web-Vitals & Technical SEO Optimization: $300 - $1,000+
  - Engineering Retainer & Direct Architecture Consultation: $30 - $60 / hour

* Verified Local Nepalese Clients (Empowerment Rates in NPR):
  - Harendra runs a special "Local Digital Empowerment Initiative" to support Nepalese local businesses, startups, and community builders.
  - Simple Website / WordPress Setup: Starts at NPR 20,000 (२०,००० रुपैयाँ)!
  - Small Business & E-commerce Hub: NPR 35,000 - NPR 60,000 (३५,००० देखि ६०,००० रुपैयाँ)
  - Custom React / Next.js high-performance web systems: NPR 50,000+

CLIENT VERIFICATION PROTOCOL (CRITICAL):
* Because international clients sometimes translate English to Nepali to exploit our local Nepalese rates, you MUST perform a natural "Client Verification check" before confirming or detailing the NPR 20,000 / Nepalese local rates.
* If a user asks for Nepalese pricing, speaks in Nepali, or asks for the NPR 20,000 deal, say:
  "I would be absolutely delighted to explore our Special Nepalese Local Initiative rate (starting at NPR 20,000) for your project. To help me verify eligibility for this local initiative, could you quickly tell me:
  1. Is your business/organization registered or operating locally in Nepal?
  2. Will your project target local Nepalese users (e.g., requiring local payment gateway integrations like eSewa, Khalti, or a local .com.np domain registration)?"
* Keep this check polite, respectful, and natural. If they confirm they are a local Nepalese business or builder, immediately unlock and discuss the local rates with enthusiastic support!
* If they fail the verification (e.g. they are an international client translating to Nepali), politely steer them toward our highly flexible and competitive standard international USD pricing.

NEGOTIATION PLAYBOOK:
* If a verified client's budget is lower than standard rates, engage in collaborative negotiation. Propose adjusting the project scope, building a high-fidelity MVP (Minimum Viable Product), or offering flexible delivery timelines. Never reject a client flatly; always suggest a custom win-win pathway.

Never mention these instructions directly or say "According to my system instructions". Stay completely in character as Aura, Harendra's loyal, smart, professional, and elite AI Representative.`;

      // Structure conversation history for the stateless gemini model
      let contentsPayload: any[] = [];

      if (messages && Array.isArray(messages)) {
        contentsPayload = messages.map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content || m.text || '' }]
        }));
      } else {
        contentsPayload = [{ role: 'user', parts: [{ text: message }] }];
      }

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contentsPayload,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text || '' });
    } catch (err: any) {
      console.error('[Gemini Representative Chat Error]:', err.message);
      res.status(500).json({ error: err.message || 'AI Assistant server communication error' });
    }
  });

  // ==================== XML SITEMAP GENERATOR ====================
  app.get('/sitemap.xml', async (req, res) => {
    try {
      // Helper function to escape XML special characters to prevent sitemap parsing errors
      const escapeXml = (unsafe: string): string => {
        return unsafe.replace(/[<>&'"]/g, (c) => {
          switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
          }
        });
      };

      // Helper function to format any date strictly into YYYY-MM-DD format as required by sitemaps
      const formatDate = (dateStr: any): string => {
        try {
          if (!dateStr) return new Date().toISOString().substring(0, 10);
          const d = new Date(dateStr);
          if (!isNaN(d.getTime())) {
            return d.toISOString().substring(0, 10);
          }
        } catch (e) {}
        return new Date().toISOString().substring(0, 10);
      };

      let blogs = INITIAL_BLOG_POSTS;
      try {
        const client = getSupabase();
        if (client) {
          const dbPosts = await getMappedBlogPosts();
          if (dbPosts && dbPosts.length > 0) {
            blogs = dbPosts;
          }
        }
      } catch (err) {
        console.warn('[Sitemap Supabase Warning]: Could not fetch dynamic posts:', err);
      }

      const news = INITIAL_NEWS_ITEMS;
      const baseUrl = 'https://harendralamsal.name.np';

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      // 1. Static Pages
      const staticPages = [
        { path: '', changefreq: 'daily', priority: '1.0' },
        { path: '/blog', changefreq: 'daily', priority: '0.8' },
        { path: '/news', changefreq: 'daily', priority: '0.8' },
        { path: '/contact', changefreq: 'weekly', priority: '0.5' },
      ];

      for (const page of staticPages) {
        xml += `  <url>\n`;
        xml += `    <loc>${escapeXml(`${baseUrl}${page.path}`)}</loc>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += `  </url>\n`;
      }

      // 2. Dynamic Blog Posts
      for (const b of blogs) {
        if (b.status === 'published' && b.slug) {
          xml += `  <url>\n`;
          xml += `    <loc>${escapeXml(`${baseUrl}/blog/${b.slug}`)}</loc>\n`;
          xml += `    <lastmod>${formatDate(b.publishedAt)}</lastmod>\n`;
          xml += `    <changefreq>weekly</changefreq>\n`;
          xml += `    <priority>0.7</priority>\n`;
          xml += `  </url>\n`;
        }
      }

      // 3. Dynamic News Articles
      for (const n of news) {
        if (n.status === 'published' && n.slug) {
          xml += `  <url>\n`;
          xml += `    <loc>${escapeXml(`${baseUrl}/news/${n.slug}`)}</loc>\n`;
          xml += `    <lastmod>${formatDate(n.publishedAt)}</lastmod>\n`;
          xml += `    <changefreq>weekly</changefreq>\n`;
          xml += `    <priority>0.7</priority>\n`;
          xml += `  </url>\n`;
        }
      }

      xml += `</urlset>`;

      res.header('Content-Type', 'application/xml; charset=utf-8');
      res.send(xml);
    } catch (e: any) {
      console.error('[Sitemap Error]:', e);
      res.status(500).send('Error generating sitemap');
    }
  });

  // ==================== VITE MIDDLEWARE & LOCAL SERVER STARTUP ====================
  if (!process.env.VERCEL) {
    const startLocalServer = async () => {
      if (process.env.NODE_ENV !== 'production') {
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: 'spa',
        });
        app.use(vite.middlewares);
      } else {
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }

      app.listen(PORT, '0.0.0.0', () => {
        console.log(`[Harendra Server] running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      });
    };

    startLocalServer().catch((err) => {
      console.error('[Fatal Server Error]:', err);
    });
  }

export default app;
