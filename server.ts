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

async function startServer() {
  const app = express();
  app.use(express.json());

  // ==================== API ROUTE: HEALTH CHECK ====================
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
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

--- Article Requirements ---
1. MODE: ${mode}
   - If "news": Summarize the latest announcement, explain why it matters, discuss real-world impact, list pros and cons, compare with competitors, and predict future implications.
   - If "tutorial": Make it beginner friendly, step-by-step, include realistic and correct modern code examples, provide a troubleshooting section, and detailed FAQs.
   - If "comparison": Provide a comparison table structure, analyze pros, cons, pricing, performance, security, ease of use, best use cases, and make a definitive recommendation.
   - If "standard" / "strategic": Provide a high-impact guide/case study with problem statement, background, best practices, performance and security considerations, and conclusions.

2. LANGUAGE & LOCALIZATION: ${lang}
   - If "en" (English): Complete the "contentEn" field in professional English. Leave "contentNp" empty or brief.
   - If "ne" (Nepali): Complete the "contentNp" field in natural, professionally localized Nepali. Leave "contentEn" empty or brief.
   - If "bilingual" (Bilingual): Generate both "contentEn" in professional English AND "contentNp" as a complete, perfectly localized Nepali version.

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
   - Word Count Range: ${wordCount}
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
                description: 'The most relevant technology category (e.g., Artificial Intelligence, Programming, SEO, WordPress, Web Development).'
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

  // ==================== VITE MIDDLEWARE SETUP ====================
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
}

startServer().catch((err) => {
  console.error('[Fatal Server Error]:', err);
});
