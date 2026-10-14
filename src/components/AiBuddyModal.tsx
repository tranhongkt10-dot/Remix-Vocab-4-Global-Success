import React, { useState, useEffect } from 'react';
import { X, Sparkles, Volume2, BookOpen, Lightbulb, Zap, Loader2, Send, HelpCircle, CheckCircle } from 'lucide-react';
import { VocabularyItem } from '../types';
import { explainWordWithAi, AiExplanationResult } from '../services/aiService';
import { ttsService } from '../services/ttsService';

interface AiBuddyModalProps {
  item: VocabularyItem | null;
  onClose: () => void;
}

export const AiBuddyModal: React.FC<AiBuddyModalProps> = ({ item, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AiExplanationResult | null>(null);
  const [questionInput, setQuestionInput] = useState('');
  const [activeQuestion, setActiveQuestion] = useState<string>('');

  const quickChips = [
    'Cách phát âm chuẩn từ này?',
    'Cho em 1 ví dụ câu thật dễ hiểu',
    'Mẹo nhớ nhanh từ này là gì?',
  ];

  const handleFetchAi = (question?: string) => {
    if (!item) return;
    setLoading(true);
    setActiveQuestion(question || '');

    explainWordWithAi(item, question)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!item) {
      setData(null);
      setQuestionInput('');
      setActiveQuestion('');
      return;
    }

    // Khi học sinh mở modal của từ vựng, tự động hiển thị giải thích mặc định (có kiểm tra cache trước)
    handleFetchAi();
  }, [item]);

  if (!item) return null;

  const handleSendCustomQuestion = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!questionInput.trim() || loading) return;
    handleFetchAi(questionInput.trim());
    setQuestionInput('');
  };

  const handleSpeak = (text: string) => {
    ttsService.playSoundEffect('click');
    ttsService.speak(text, 0.9);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border-3 border-pink-200 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto no-scrollbar">
        
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-2xl bg-sky-50 text-slate-400 hover:text-slate-600 hover:bg-sky-100 transition-colors"
          title="Đóng hộp thoại"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Bunny Avatar Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-300 via-pink-200 to-sky-200 flex items-center justify-center text-3xl shadow-md border-2 border-white flex-shrink-0 animate-bounce">
            🐰
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-sky-950">Thỏ Bác Học Bunny</h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                Gemini 2.5 Flash
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Giải thích từ vựng & mẹo ghi nhớ cho học sinh lớp 4
            </p>
          </div>
        </div>

        {/* Word Info Banner */}
        <div className="bg-sky-50 rounded-2xl p-3.5 border border-sky-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{item.iconEmoji}</span>
              <span className="text-xl font-black text-sky-950">{item.term}</span>
              <span className="text-xs font-mono font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
                {item.phonetic}
              </span>
            </div>
            <p className="text-xs font-extrabold text-sky-800 mt-1">
              Nghĩa: <span className="text-pink-600 font-black">{item.meaningVi}</span>
            </p>
          </div>

          <button
            onClick={() => handleSpeak(item.term)}
            className="p-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 shadow-sm"
            title="Nghe phát âm"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Trạng thái đang tải */}
        {loading && (
          <div className="py-8 text-center space-y-2.5 bg-sky-50/50 rounded-2xl border border-sky-100">
            <Loader2 className="w-7 h-7 text-pink-500 animate-spin mx-auto" />
            <p className="text-xs font-bold text-sky-800">
              Thỏ Bunny đang soạn câu trả lời dễ hiểu nhất cho bé, chờ một chút nhé... ✨
            </p>
          </div>
        )}

        {/* Nội dung phản hồi từ AI */}
        {!loading && data && (
          <div className="space-y-3.5">
            
            {/* Huy hiệu trạng thái nguồn (Cache / Gemini / Fallback) */}
            <div className="flex items-center justify-between text-[11px] font-bold">
              {data.source === 'cache' || data.fromCache ? (
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                  <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-400" />
                  Đã tải từ bộ nhớ đệm (0 token API)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sky-700 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  Phản hồi từ Gemini 2.5 Flash
                </span>
              )}

              {activeQuestion && (
                <span className="text-slate-500 italic truncate max-w-[200px]" title={activeQuestion}>
                  Hỏi: "{activeQuestion}"
                </span>
              )}
            </div>

            {/* Khối giải thích */}
            <div className="p-3.5 rounded-2xl bg-pink-50/60 border border-pink-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-pink-700">
                <BookOpen className="w-4 h-4" />
                <span>Giải thích của Thỏ Bunny:</span>
              </div>
              <p className="text-xs sm:text-sm text-sky-950 font-medium leading-relaxed pl-5">
                {data.explanationVi}
              </p>
            </div>

            {/* Mẹo nhớ vui */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-800">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Mẹo ghi nhớ siêu tốc:</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-950 font-bold leading-relaxed pl-5">
                {data.memoryStory}
              </p>
            </div>

            {/* Thử thách nhỏ */}
            <div className="p-3 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-sky-800">
                <CheckCircle className="w-4 h-4 text-sky-600" />
                <span>Thử thách vui:</span>
              </div>
              <p className="text-xs sm:text-sm text-sky-900 font-medium pl-5">
                {data.funFactOrQuiz}
              </p>
            </div>
          </div>
        )}

        {/* Khung đặt câu hỏi chủ động (Chỉ gọi API khi học sinh chủ động bấm gửi) */}
        <div className="pt-2 border-t border-sky-100 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-sky-800">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
              Bé muốn hỏi thêm Thỏ Bunny điều gì?
            </span>
            <span className="text-[10px] text-slate-400">
              {questionInput.length}/100 ký tự
            </span>
          </div>

          {/* Gợi ý câu hỏi 1 chạm */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleFetchAi(chip)}
                className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Form nhập câu hỏi */}
          <form onSubmit={handleSendCustomQuestion} className="flex gap-2">
            <input
              type="text"
              maxLength={100}
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder="Nhập câu hỏi (dưới 100 chữ)..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-sky-200 text-xs font-bold text-sky-950 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-pink-300 outline-none"
            />
            <button
              type="submit"
              disabled={!questionInput.trim() || loading}
              className="px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-black text-xs shadow-md shadow-pink-200 disabled:opacity-40 transition-all flex items-center gap-1"
            >
              <span>Gửi</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Nút hoàn tất */}
        <div>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-xs sm:text-sm shadow-md shadow-sky-200 transition-colors"
          >
            Đã hiểu rồi, cảm ơn Thỏ Bunny! 💕
          </button>
        </div>

      </div>
    </div>
  );
};
