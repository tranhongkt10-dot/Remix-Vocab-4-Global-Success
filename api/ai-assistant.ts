import { GoogleGenAI } from '@google/genai';

// Vercel Serverless Function Handler cho route /api/ai-assistant
export default async function handler(req: any, res: any) {
  // Chỉ chấp nhận phương thức POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST' });
  }

  try {
    const { term, phonetic, meaningVi, unit, topic, question } = req.body || {};

    // Giới hạn đầu vào tối đa 100 ký tự để chống spam và tiết kiệm tài nguyên
    const sanitizedQuestion = question ? String(question).trim().slice(0, 100) : '';
    const cleanTerm = term ? String(term).trim().slice(0, 50) : '';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback nếu người dùng chưa cài đặt GEMINI_API_KEY trên Vercel
      return res.status(200).json({
        explanationVi: `Từ "${cleanTerm}" (${phonetic || ''}) có nghĩa là "${meaningVi || ''}". Đây là từ vựng quen thuộc trong Unit ${unit || 1}!`,
        memoryStory: `Mẹo nhớ: Hãy đọc to từ "${cleanTerm}" 3 lần và ghép vào một câu ngắn nhé!`,
        funFactOrQuiz: `Bé hãy phát âm chuẩn từ "${cleanTerm}" cùng bạn bè nhé! ⭐`,
        source: 'local_fallback',
      });
    }

    const ai = new GoogleGenAI();
    const prompt = `Bạn là "Thỏ Bác Học Bunny", trợ lý học tiếng Anh thân thiện cho học sinh lớp 4 (9 tuổi) theo chương trình Tiếng Anh 4 (Global Success).
Thông tin từ vựng bài học:
- Từ: "${cleanTerm}"
- Phiên âm IPA: "${phonetic || ''}"
- Nghĩa tiếng Việt trong sách: "${meaningVi || ''}"
- Thuộc chủ đề: "${topic || ''}" (Unit ${unit || 1})
${sanitizedQuestion ? `- Câu hỏi của bé: "${sanitizedQuestion}"` : '- Yêu cầu: Giải thích nghĩa từ và mẹo nhớ cho bé.'}

Yêu cầu định dạng đầu ra chuẩn JSON như sau:
{
  "explanationVi": "Trả lời ngắn gọn (1-2 câu), ngôn ngữ tiếng Việt trong sáng, ngọt ngào cho học sinh 9 tuổi.",
  "memoryStory": "1 mẹo nhớ vui hoặc câu chuyện siêu ngắn 1 câu giúp bé nhớ từ thật lâu.",
  "funFactOrQuiz": "1 câu đố nhỏ hoặc thử thách 1 câu kích thích bé hứng thú học."
}
Chỉ trả về JSON thuần túy, tuyệt đối không dùng định dạng khác ngoài JSON.`;

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

    return res.status(200).json({
      explanationVi: parsed.explanationVi || `Từ "${cleanTerm}" nghĩa là "${meaningVi}".`,
      memoryStory: parsed.memoryStory || `Hãy đọc to "${cleanTerm}" mỗi ngày để nhớ thật lâu nhé!`,
      funFactOrQuiz: parsed.funFactOrQuiz || `Bé đã phát âm chuẩn từ "${cleanTerm}" chưa nào?`,
      source: 'gemini_api',
    });
  } catch (error) {
    console.error('Lỗi xử lý AI trên Vercel Serverless:', error);
    const { term, meaningVi } = req.body || {};
    return res.status(200).json({
      explanationVi: `Từ "${term || ''}" có nghĩa là "${meaningVi || ''}". Bé hãy nghe phát âm mẫu và tự tin lặp lại nhé!`,
      memoryStory: `Mẹo nhỏ: Nhìn kỹ mặt chữ và tranh minh họa để ghi nhớ từ này nhanh hơn nha.`,
      funFactOrQuiz: `Bé có muốn đặt một câu tiếng Anh đơn giản với từ "${term || ''}" không nào? ⭐`,
      source: 'local_fallback',
    });
  }
}
