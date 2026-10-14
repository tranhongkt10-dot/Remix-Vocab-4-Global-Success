import React from 'react';
import { X, Trophy, Star, Flame, BookOpen, CheckCircle2, RotateCcw } from 'lucide-react';
import { UserProgress } from '../types';
import { VOCABULARY_LIST } from '../data/vocabularyData';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onResetProgress: () => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  progress,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  const totalWords = VOCABULARY_LIST.length;
  const learnedCount = progress.learnedWordIds.length;
  const learnedPercent = Math.round((learnedCount / totalWords) * 100);

  // Badge calculations
  const badges = [
    { title: 'Tân Binh Lớp 4', desc: 'Bắt đầu hành trình', icon: '🌱', unlocked: true },
    { title: 'Ngôi Sao Chăm Chỉ', desc: 'Đạt trên 30 sao ⭐', icon: '⭐', unlocked: progress.totalStars >= 30 },
    { title: 'Siêu Sao Từ Vựng', desc: 'Học trên 10 từ vựng', icon: '📚', unlocked: learnedCount >= 10 },
    { title: 'Bậc Thầy Ngữ Âm', desc: 'Hoàn thành 2 bài ngữ âm', icon: '🎙️', unlocked: progress.phonicsCompleted.length >= 2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border-3 border-sky-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-2xl bg-sky-50 text-slate-400 hover:text-slate-600 hover:bg-sky-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl">
            🏆
          </div>
          <div>
            <h2 className="text-xl font-black text-sky-950">Bảng Vàng Thành Tích</h2>
            <p className="text-xs text-slate-500 font-medium">
              Ghi nhận nỗ lực học tiếng Anh tuyệt vời của bé!
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400 mx-auto" />
            <div className="text-xl font-black text-amber-800 mt-1">{progress.totalStars}</div>
            <div className="text-[11px] font-bold text-amber-700">Sao Tích Lũy</div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
            <Flame className="w-5 h-5 text-orange-500 mx-auto" />
            <div className="text-xl font-black text-orange-800 mt-1">{progress.streakDays}</div>
            <div className="text-[11px] font-bold text-orange-700">Ngày Liên Tiếp</div>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200">
            <BookOpen className="w-5 h-5 text-pink-500 mx-auto" />
            <div className="text-xl font-black text-pink-800 mt-1">{learnedCount}</div>
            <div className="text-[11px] font-bold text-pink-700">Từ Đã Thuộc</div>
          </div>
        </div>

        {/* Vocabulary Mastery Progress */}
        <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 space-y-2">
          <div className="flex justify-between text-xs font-black text-sky-900">
            <span>Mức độ phủ sóng từ vựng:</span>
            <span>{learnedPercent}% ({learnedCount}/{totalWords} từ)</span>
          </div>
          <div className="w-full h-3 bg-sky-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${learnedPercent}%` }}
            />
          </div>
        </div>

        {/* Badges Collection */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            Huy Hiệu Đã Mở Khóa:
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {badges.map((b, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                  b.unlocked
                    ? 'bg-white border-amber-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
                }`}
              >
                <div className="text-2xl">{b.icon}</div>
                <div>
                  <h4 className="text-xs font-black text-sky-950">{b.title}</h4>
                  <p className="text-[10px] text-slate-500">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-sky-100 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              if (window.confirm('Bé hoặc phụ huynh có chắc muốn đặt lại toàn bộ điểm và từ đã học không?')) {
                onResetProgress();
              }
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-rose-500 transition-colors font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại tiến độ</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-black"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
