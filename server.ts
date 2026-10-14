import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// API Route: Vercel Serverless Function equivalent for local development
app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "prompt" in request body.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';
    return res.status(200).json({ text });
  } catch (error: any) {
    console.error('Error handling /api/gemini request:', error);
    return res.status(500).json({ error: error?.message || 'Gemini API call failed' });
  }
});

// API Route: Trợ lý AI Thỏ Bác Học Bunny (Gemini 2.5 Flash trên máy chủ)
app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { term, phonetic, meaningVi, unit, topic, question } = req.body;

    // Giới hạn câu hỏi tối đa 100 ký tự để chống lạm dụng
    const sanitizedQuestion = question ? String(question).trim().slice(0, 100) : '';
    const cleanTerm = term ? String(term).trim().slice(0, 50) : '';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback an toàn nếu chưa có API Key
      return res.json({
        explanationVi: `Từ "${cleanTerm}" (${phonetic || ''}) có nghĩa là "${meaningVi || ''}". Đây là từ vựng rất hay trong bài học Unit ${unit || 1}!`,
        memoryStory: `Mẹo nhớ của Thỏ Bunny: Hãy đọc to từ "${cleanTerm}" 3 lần và ghép vào câu nhé!`,
        funFactOrQuiz: `Bé hãy thử tìm một đồ vật xung quanh nhà mình liên quan đến từ "${cleanTerm}" xem sao nhé! ⭐`,
        source: 'local_fallback',
      });
    }

    const ai = new GoogleGenAI();
    
    // System instruction chuyên biệt cho học sinh lớp 4
    const prompt = `Bạn là "Thỏ Bác Học Bunny", một người bạn hoạt hình vui vẻ, thông thái, chuyên hướng dẫn học sinh lớp 4 (9 tuổi) học tiếng Anh theo chương trình Tiếng Anh 4 (Global Success).
Thông tin từ vựng bài học:
- Từ: "${cleanTerm}"
- Phiên âm IPA: "${phonetic || ''}"
- Nghĩa tiếng Việt trong sách: "${meaningVi || ''}"
- Thuộc chủ đề: "${topic || ''}" (Unit ${unit || 1})
${sanitizedQuestion ? `- Câu hỏi của bé: "${sanitizedQuestion}"` : '- Yêu cầu: Giải thích nghĩa từ và mẹo nhớ cho bé.'}

Yêu cầu định dạng đầu ra chuẩn JSON như sau:
{
  "explanationVi": "Trả lời hoặc giải thích cực kỳ ngắn gọn (1-2 câu), ngôn ngữ tiếng Việt trong sáng, ngọt ngào, phù hợp với học sinh 9 tuổi.",
  "memoryStory": "1 mẹo nhớ vui, thơ ngắn hoặc câu chuyện vui nhộn 1 câu giúp bé nhớ từ hoặc phát âm thật lâu.",
  "funFactOrQuiz": "1 câu đố nhỏ hoặc thử thách 1 câu kích thích bé hứng thú học."
}
Lưu ý: Chỉ trả về JSON thuần túy, tuyệt đối không dùng định dạng khác ngoài JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const responseText = response.text || '';
    const parsed = JSON.parse(responseText);

    return res.json({
      explanationVi: parsed.explanationVi || `Từ "${cleanTerm}" nghĩa là "${meaningVi}".`,
      memoryStory: parsed.memoryStory || `Hãy đọc to "${cleanTerm}" mỗi ngày để nhớ thật lâu nhé!`,
      funFactOrQuiz: parsed.funFactOrQuiz || `Bé đã phát âm chuẩn từ "${cleanTerm}" chưa nào?`,
      source: 'gemini_api',
    });
  } catch (error) {
    console.error('Server error handling AI assistant request:', error);
    // Trả về fallback thân thiện nếu mạng lỗi
    const { term, meaningVi, unit } = req.body;
    return res.json({
      explanationVi: `Từ "${term}" có nghĩa là "${meaningVi}". Bé hãy nghe phát âm mẫu và tự tin lặp lại nhé!`,
      memoryStory: `Mẹo nhỏ: Nhìn kỹ mặt chữ và tranh minh họa để ghi nhớ từ này nhanh hơn nha.`,
      funFactOrQuiz: `Bé có muốn đặt một câu tiếng Anh đơn giản với từ "${term}" cùng bạn bè không nào? ⭐`,
      source: 'local_fallback',
    });
  }
});

// Setup Vite middlewares in development or static serving in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vocab 4 Server listening on port ${PORT}`);
  });
}

startServer();
