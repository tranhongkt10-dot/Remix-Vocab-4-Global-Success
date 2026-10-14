import { GoogleGenAI } from '@google/genai';

/**
 * Vercel Serverless Function handler for /api/gemini
 *
 * Requirements:
 * - Compatible with Vercel Serverless Functions (Node.js runtime)
 * - Accepts POST requests
 * - Reads `prompt` from the request body
 * - Calls Google Gemini using process.env.GEMINI_API_KEY with model 'gemini-2.5-flash'
 * - Returns { text: string } as JSON
 * - Server-side only; does not expose the API key to the client
 */
export default async function handler(req: any, res: any) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    if (typeof res.status === 'function') {
      return res.status(405).json({ error: 'Method Not Allowed. Only POST requests are accepted.' });
    }
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Method Not Allowed. Only POST requests are accepted.' }));
  }

  try {
    // Parse request body if needed
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const prompt = body?.prompt;
    if (!prompt || typeof prompt !== 'string') {
      if (typeof res.status === 'function') {
        return res.status(400).json({ error: 'Missing or invalid "prompt" in request body.' });
      }
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Missing or invalid "prompt" in request body.' }));
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not defined in environment variables.');
      if (typeof res.status === 'function') {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      }
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not configured on the server.' }));
    }

    // Initialize Google GenAI with server-side API key
    const ai = new GoogleGenAI({ apiKey });

    // Generate content using gemini-2.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';

    if (typeof res.status === 'function') {
      return res.status(200).json({ text });
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ text }));
  } catch (error: any) {
    console.error('Error invoking Gemini in Vercel Serverless Function:', error);
    const errorMessage = error?.message || 'Internal Server Error while communicating with Gemini.';

    if (typeof res.status === 'function') {
      return res.status(500).json({ error: errorMessage });
    }
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: errorMessage }));
  }
}
