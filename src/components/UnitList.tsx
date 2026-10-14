import React, { useState } from 'react';
import { ArrowRight, Star, CheckCircle2, Sparkles, BookOpen, Layers } from 'lucide-react';
import { UNIT_METADATA, VOCABULARY_LIST } from '../data/vocabularyData';
import { UserProgress } from '../types';

interface UnitListProps {
  onSelectUnit: (unitNumber: number) => void;
  progress: UserProgress;
}

export const UnitList: React.FC<UnitListProps> = ({ onSelectUnit, progress }) => {
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);

  const semesterUnits = UNIT_METADATA.filter((u) => u.semester === selectedSemester);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300 p-6 sm:p-8 text-white shadow-xl shadow-sky-100/50">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Chào mừng bé đến với Vocab 4 – Global Success</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight drop-shadow-sm">
            Học Từ Vựng & Phát Âm Chuẩn Dễ Như Chơi!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-sky-950/80 font-medium leading-relaxed">
            Khám phá 20 bài học thú vị, nghe giọng bản xứ cực chuẩn, lật thẻ flashcard 3D và vượt qua các thử thách mini-game cùng Thỏ Bunny nhé! 🐰✨
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/90 text-sky-800 text-xs font-bold shadow-sm">
              <BookOpen className="w-4 h-4 text-sky-500" />
              <span>{VOCABULARY_LIST.length}+ Từ vựng trọng tâm</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/90 text-pink-700 text-xs font-bold shadow-sm">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{progress.learnedWordIds.length} Từ đã thành thạo</span>
            </div>
          </div>
        </div>

        {/* Decorative Floating Emojis */}
        <div className="absolute -right-4 -bottom-6 text-8xl sm:text-9xl select-none opacity-80 pointer-events-none transform -rotate-12">
          🌈
        </div>
        <div className="absolute right-28 top-3 text-5xl select-none opacity-90 pointer-events-none animate-pulse">
          ⭐
        </div>
      </div>

      {/* Transparency Note */}
      <div className="bg-sky-50 border border-sky-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-sky-800">
        <span className="text-lg">💡</span>
        <div>
          <span className="font-bold text-sky-900">Ghi chú đối chiếu chương trình: </span>
          Bộ từ vựng được biên soạn bám sát theo 20 chủ đề trọng tâm của bộ sách Tiếng Anh 4 (Global Success). Thầy cô, phụ huynh và các em có thể dễ dàng tra cứu, nghe phát âm và ôn luyện tương tác theo từng Unit.
        </div>
      </div>

      {/* Semester Tabs Switcher */}
      <div className="flex items-center justify-between border-b border-sky-200/60 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-sky-600" />
          <h2 className="text-xl sm:text-2xl font-black text-sky-900">
            Bản Đồ 20 Đơn Vị Bài Học
          </h2>
        </div>

        <div className="flex items-center p-1 bg-white rounded-2xl border border-sky-200 shadow-sm">
          <button
            onClick={() => setSelectedSemester(1)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              selectedSemester === 1
                ? 'bg-sky-500 text-white shadow-md shadow-sky-200'
                : 'text-sky-700 hover:text-sky-900'
            }`}
          >
            Học Kỳ 1 (Unit 1 - 10)
          </button>
          <button
            onClick={() => setSelectedSemester(2)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              selectedSemester === 2
                ? 'bg-pink-500 text-white shadow-md shadow-pink-200'
                : 'text-sky-700 hover:text-sky-900'
            }`}
          >
            Học Kỳ 2 (Unit 11 - 20)
          </button>
        </div>
      </div>

      {/* Grid of Unit Island Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {semesterUnits.map((u) => {
          const unitWords = VOCABULARY_LIST.filter((w) => w.unit === u.unit);
          const learnedCount = unitWords.filter((w) => progress.learnedWordIds.includes(w.id)).length;
          const progressPercent = unitWords.length > 0 ? Math.round((learnedCount / unitWords.length) * 100) : 0;
          const quizScore = progress.unitScores[u.unit];

          return (
            <div
              key={u.unit}
              onClick={() => onSelectUnit(u.unit)}
              className="group relative bg-white rounded-3xl p-6 border-2 border-sky-100 hover:border-sky-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header of Card */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform">
                      {u.icon}
                    </div>
                    <div>
                      <span className="text-[11px] font-black tracking-wider uppercase text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                        Unit {u.unit}
                      </span>
                      <h3 className="font-extrabold text-lg text-sky-950 group-hover:text-sky-600 transition-colors mt-0.5 line-clamp-1">
                        {u.title}
                      </h3>
                    </div>
                  </div>

                  {quizScore !== undefined && quizScore >= 80 && (
                    <div className="p-1 rounded-full bg-emerald-100 text-emerald-600" title={`Đã đạt điểm cao: ${quizScore}%`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Word Stats */}
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-sky-700/80">
                  <span className="bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                    {unitWords.length} từ vựng
                  </span>
                  {quizScore !== undefined && (
                    <span className="bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-amber-700 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      Điểm quiz: {quizScore}%
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] font-bold text-sky-800 mb-1">
                    <span>Tiến độ học</span>
                    <span>{learnedCount}/{unitWords.length} từ ({progressPercent}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-sky-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-pink-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-3 border-t border-sky-50 flex items-center justify-between text-xs font-black text-sky-600 group-hover:text-pink-600 transition-colors">
                <span>Vào học Unit {u.unit}</span>
                <div className="w-8 h-8 rounded-xl bg-sky-50 group-hover:bg-pink-100 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
