import React from 'react';
import { 
  Sparkles, BookOpen, Flame, Star, Trophy, ArrowRight, 
  Gamepad2, Mic, Search, Volume2, CheckCircle2 
} from 'lucide-react';
import { UserProgress, VocabularyItem } from '../types';
import { VOCABULARY_LIST } from '../data/vocabularyData';
import { ttsService } from '../services/ttsService';

interface HomeScreenProps {
  progress: UserProgress;
  onNavigateTab: (tab: 'units' | 'games' | 'phonics' | 'search', filter?: string) => void;
  onSelectUnit: (unit: number) => void;
  onOpenProfile: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progress,
  onNavigateTab,
  onSelectUnit,
  onOpenProfile,
}) => {
  const totalWords = VOCABULARY_LIST.length;
  const learnedCount = progress.learnedWordIds.length;
  const progressPercent = totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0;

  // Lấy 3 từ tiêu biểu để bé học nhanh hôm nay
  const spotlightWords: VocabularyItem[] = VOCABULARY_LIST.slice(0, 3);

  const handlePlayWord = (word: string) => {
    ttsService.playSoundEffect('click');
    ttsService.speak(word, 0.9);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. HERO BANNER - TÊN ỨNG DỤNG VÀ LỜI CHÀO THÂN THIỆN */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300 p-6 sm:p-10 text-white shadow-xl shadow-sky-100/60">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Chương trình Tiếng Anh 4 – Global Success</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-sm tracking-tight">
            Vocab 4 – Global Success
          </h1>

          <p className="text-sm sm:text-base text-sky-950 font-semibold leading-relaxed">
            Ứng dụng hỗ trợ học sinh lớp 4 học từ vựng, phiên âm IPA, luyện tập chính tả và ngữ âm tiếng Anh dễ dàng, trực quan và hoàn toàn miễn phí! 🌈✨
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('units')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-sky-800 font-black text-xs sm:text-sm shadow-md hover:bg-sky-50 transition-all hover:scale-105"
            >
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Bắt đầu học 20 Units</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('games')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-black text-xs sm:text-sm shadow-md shadow-pink-300/40 transition-all hover:scale-105"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Chơi Mini-game</span>
            </button>
          </div>
        </div>

        {/* Decorative background icons */}
        <div className="absolute -right-4 -bottom-6 text-8xl sm:text-9xl select-none opacity-80 pointer-events-none transform -rotate-12">
          🐰
        </div>
        <div className="absolute right-32 top-4 text-5xl select-none opacity-80 pointer-events-none animate-pulse">
          ⭐
        </div>
      </div>

      {/* 2. TIẾN ĐỘ HỌC TẬP TỔNG THỂ */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-sky-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-sky-950">
                Tiến Độ Học Tập Của Bé
              </h2>
              <p className="text-xs text-slate-500">Dữ liệu được lưu trữ an toàn trên thiết bị này</p>
            </div>
          </div>

          <button
            onClick={onOpenProfile}
            className="text-xs font-black text-pink-600 hover:text-pink-700 bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-100"
          >
            Xem bảng vàng 🏆
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-extrabold text-sky-900">
            <span>Từ vựng đã thuộc: {learnedCount} / {totalWords} từ</span>
            <span>{progressPercent}% Hoàn thành</span>
          </div>
          <div className="w-full h-3.5 bg-sky-100 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-pink-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 pt-2 text-center">
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100">
            <div className="flex items-center justify-center gap-1 text-amber-700 font-black text-base sm:text-lg">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{progress.totalStars}</span>
            </div>
            <p className="text-[11px] font-bold text-amber-800">Sao Tích Lũy</p>
          </div>

          <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-100">
            <div className="flex items-center justify-center gap-1 text-orange-700 font-black text-base sm:text-lg">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{progress.streakDays}</span>
            </div>
            <p className="text-[11px] font-bold text-orange-800">Ngày Liên Tiếp</p>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <div className="flex items-center justify-center gap-1 text-indigo-700 font-black text-base sm:text-lg">
              <Mic className="w-4 h-4" />
              <span>{progress.phonicsCompleted.length}/4</span>
            </div>
            <p className="text-[11px] font-bold text-indigo-800">Bài Ngữ Âm</p>
          </div>
        </div>
      </div>

      {/* 3. CÁC THẺ CHỨC NĂNG CHÍNH */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-sky-950 flex items-center gap-2">
            <span>Khám Phá Các Chức Năng</span>
            <span className="text-base">🚀</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Bấm vào thẻ để vào bài học</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: 20 Units */}
          <div
            onClick={() => onNavigateTab('units')}
            className="group bg-white rounded-3xl p-6 border-2 border-sky-100 hover:border-sky-300 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                📚
              </div>
              <h3 className="font-extrabold text-lg text-sky-950 group-hover:text-sky-600 mt-3">
                Từ Vựng 20 Units
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Kho từ vựng có IPA, nghĩa tiếng Việt, câu ví dụ và chế độ Flashcard 3D lật thẻ.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-sky-50 flex items-center justify-between text-xs font-black text-sky-600">
              <span>Khám phá ngay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Luyện tập chính tả */}
          <div
            onClick={() => onNavigateTab('games', 'spelling')}
            className="group bg-white rounded-3xl p-6 border-2 border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🔤
              </div>
              <h3 className="font-extrabold text-lg text-sky-950 group-hover:text-pink-600 mt-3">
                Luyện Tập Chính Tả
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Điền chữ cái còn thiếu và sắp xếp các chữ cái xáo trộn thành từ vựng hoàn chỉnh.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-pink-50 flex items-center justify-between text-xs font-black text-pink-600">
              <span>Chơi thử thách</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Trắc nghiệm nghĩa từ */}
          <div
            onClick={() => onNavigateTab('games', 'quiz')}
            className="group bg-white rounded-3xl p-6 border-2 border-indigo-100 hover:border-indigo-300 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h3 className="font-extrabold text-lg text-sky-950 group-hover:text-indigo-600 mt-3">
                Trắc Nghiệm Nghĩa Từ
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Kiểm tra phản xạ 2 chiều Anh–Việt, Việt–Anh và nghe phát âm chọn đáp án đúng.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-50 flex items-center justify-between text-xs font-black text-indigo-600">
              <span>Làm bài quiz</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Bài học phát âm */}
          <div
            onClick={() => onNavigateTab('phonics')}
            className="group bg-white rounded-3xl p-6 border-2 border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🎙️
              </div>
              <h3 className="font-extrabold text-lg text-sky-950 group-hover:text-emerald-600 mt-3">
                Bài Học Phát Âm
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Học chuẩn phát âm đuôi -s/-es, đuôi -ed, trọng âm của từ và ngữ điệu câu.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-50 flex items-center justify-between text-xs font-black text-emerald-600">
              <span>Học ngữ âm</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* 4. TỪ VỰNG TIÊU BIỂU HÔM NAY (NGHE NHANH) */}
      <div className="bg-sky-50/70 border border-sky-200/80 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            <h3 className="font-black text-base text-sky-950">
              Gợi Ý Từ Vựng Tiêu Biểu Hôm Nay
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('search')}
            className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Tra cứu tất cả từ</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {spotlightWords.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.iconEmoji}</span>
                  <span className="font-black text-sky-950 text-base">{item.term}</span>
                </div>
                <p className="text-xs font-mono text-pink-600 font-bold">{item.phonetic}</p>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">{item.meaningVi}</p>
              </div>

              <button
                onClick={() => handlePlayWord(item.term)}
                className="p-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 shadow-sm transition-transform active:scale-95"
                title="Nghe phát âm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
