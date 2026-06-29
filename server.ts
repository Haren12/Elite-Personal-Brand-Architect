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
