import { VocabularyItem } from '../types';

export interface AiExplanationResult {
  explanationVi: string;
  memoryStory: string;
  funFactOrQuiz: string;
  fromCache: boolean;
  source?: 'gemini_api' | 'local_fallback' | 'cache';
}

const CACHE_PREFIX = 'vocab4_ai_cache_';

/**
 * Generic helper to send a prompt to the Vercel Serverless Function at /api/gemini.
 * The client does not import GoogleGenerativeAI or hold any API keys.
 */
export async function askGemini(prompt: string): Promise<string> {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    let errorDetail = `Status ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson?.error) {
        errorDetail = errJson.error;
      }
    } catch {
      // ignore json parse error on error response
    }
    throw new Error(`Gemini API request failed: ${errorDetail}`);
  }

  const data: { text?: string } = await response.json();
  return data.text || '';
}

/**
 * Explains vocabulary words for 4th-grade students using Gemini 2.5 Flash via /api/gemini.
 */
export async function explainWordWithAi(
  item: VocabularyItem,
  customQuestion?: string
): Promise<AiExplanationResult> {
  const cleanQuestion = customQuestion ? customQuestion.trim().slice(0, 100) : '';
  const cleanTerm = item.term.trim().slice(0, 50);
  const cacheKey = `${CACHE_PREFIX}${cleanTerm.toLowerCase()}_${cleanQuestion ? encodeURIComponent(cleanQuestion) : 'default'}`;

  // 1. Check LocalStorage cache first to minimize network calls
  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      return {
        ...parsed,
        fromCache: true,
        source: 'cache',
      };
    }
  } catch {
    // Ignore localStorage errors
  }

  // 2. Build the tailored prompt for Gemini 2.5 Flash
  const prompt = `Bạn là "Thỏ Bác Học Bunny", trợ lý học tiếng Anh thân thiện cho học sinh lớp 4 (9 tuổi) theo chương trình Tiếng Anh 4 (Global Success).
Thông tin từ vựng bài học:
- Từ: "${cleanTerm}"
- Phiên âm IPA: "${item.phonetic || ''}"
- Nghĩa tiếng Việt trong sách: "${item.meaningVi || ''}"
- Thuộc chủ đề: "${item.topic || ''}" (Unit ${item.unit || 1})
${cleanQuestion ? `- Câu hỏi của bé: "${cleanQuestion}"` : '- Yêu cầu: Giải thích nghĩa từ và mẹo nhớ cho bé.'}

Yêu cầu định dạng đầu ra chuẩn JSON như sau:
{
  "explanationVi": "Trả lời ngắn gọn (1-2 câu), ngôn ngữ tiếng Việt trong sáng, ngọt ngào cho học sinh 9 tuổi.",
  "memoryStory": "1 mẹo nhớ vui hoặc câu chuyện siêu ngắn 1 câu giúp bé nhớ từ thật lâu.",
  "funFactOrQuiz": "1 câu đố nhỏ hoặc thử thách 1 câu kích thích bé hứng thú học."
}
Chỉ trả về JSON thuần túy, tuyệt đối không dùng định dạng khác ngoài JSON.`;

  // 3. Call serverless backend at /api/gemini via fetch
  try {
    const rawText = await askGemini(prompt);

    // Strip any markdown code fences if returned
    let cleanJson = rawText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.slice(7);
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.slice(3);
    }
    if (cleanJson.endsWith('```')) {
      cleanJson = cleanJson.slice(0, -3);
    }
    cleanJson = cleanJson.trim();

    const parsed = JSON.parse(cleanJson);

    const result: AiExplanationResult = {
      explanationVi: parsed.explanationVi || `Từ "${cleanTerm}" có nghĩa là "${item.meaningVi}".`,
      memoryStory: parsed.memoryStory || `Mẹo nhớ: Đọc to "${cleanTerm}" 3 lần và ghép vào câu nhé!`,
      funFactOrQuiz: parsed.funFactOrQuiz || `Bé hãy phát âm chuẩn từ "${cleanTerm}" cùng bạn bè nha!`,
      fromCache: false,
      source: 'gemini_api',
    };

    // Cache the result for subsequent visits
    try {
      localStorage.setItem(cacheKey, JSON.stringify(result));
    } catch {
      // Storage quota limit reached, fail silently
    }

    return result;
  } catch (error) {
    console.warn('Network or serverless API error, using friendly local fallback:', error);
    // Friendly fallback if offline or API quota is exceeded
    return {
      explanationVi: `Từ "${cleanTerm}" (${item.phonetic}) có nghĩa là "${item.meaningVi}". Đây là từ vựng quen thuộc trong Unit ${item.unit}!`,
      memoryStory: `Mẹo nhỏ: Nhìn vào hình minh họa ${item.iconEmoji} và đọc to 3 lần để ghi nhớ thật lâu nhé!`,
      funFactOrQuiz: `Bé hãy thử tự đặt một câu đơn giản với từ "${cleanTerm}" nhé! ⭐`,
      fromCache: false,
      source: 'local_fallback',
    };
  }
}
