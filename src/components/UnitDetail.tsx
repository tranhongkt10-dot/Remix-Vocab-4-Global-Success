import React, { useState } from 'react';
import { 
  ArrowLeft, Volume2, Snail, Heart, CheckCircle2, 
  Sparkles, RotateCw, ChevronLeft, ChevronRight, Gamepad2, Layers, BookOpen 
} from 'lucide-react';
import { UNIT_METADATA, VOCABULARY_LIST } from '../data/vocabularyData';
import { VocabularyItem, UserProgress } from '../types';
import { ttsService } from '../services/ttsService';

interface UnitDetailProps {
  unitNumber: number;
  onBack: () => void;
  progress: UserProgress;
  onToggleFavorite: (id: string) => void;
  onMarkLearned: (id: string) => void;
  onOpenAiBuddy: (item: VocabularyItem) => void;
  onStartUnitQuiz: (unitNumber: number) => void;
}

export const UnitDetail: React.FC<UnitDetailProps> = ({
  unitNumber,
  onBack,
  progress,
  onToggleFavorite,
  onMarkLearned,
  onOpenAiBuddy,
  onStartUnitQuiz,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'flashcard'>('grid');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const meta = UNIT_METADATA.find((u) => u.unit === unitNumber) || UNIT_METADATA[0];
  const unitWords = VOCABULARY_LIST.filter((w) => w.unit === unitNumber);

  const currentFlashcard = unitWords[flashcardIndex];

  const handlePlayAudio = (text: string, rate: number = 0.9) => {
    ttsService.playSoundEffect('click');
    ttsService.speak(text, rate);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev + 1) % unitWords.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev - 1 + unitWords.length) % unitWords.length);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
            title="Quay lại danh sách Units"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{meta.icon}</span>
              <span className="text-xs font-black uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
                Unit {unitNumber}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-sky-950 mt-0.5">
              {meta.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Mode Switcher */}
          <div className="flex bg-sky-50 p-1 rounded-2xl border border-sky-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-sky-700/70 hover:text-sky-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Danh sách</span>
            </button>
            <button
              onClick={() => {
                setViewMode('flashcard');
                setIsFlipped(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                viewMode === 'flashcard'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-sky-700/70 hover:text-pink-600'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Flashcard 3D</span>
            </button>
          </div>

          {/* Start Quiz for this Unit */}
          <button
            onClick={() => onStartUnitQuiz(unitNumber)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-black text-xs sm:text-sm shadow-md shadow-pink-200 hover:scale-105 transition-all"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Luyện tập Quiz</span>
          </button>
        </div>
      </div>

      {/* FLASHCARD 3D MODE */}
      {viewMode === 'flashcard' && currentFlashcard && (
        <div className="max-w-xl mx-auto py-4 space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-sky-700 px-2">
            <span>Thẻ từ số {flashcardIndex + 1} / {unitWords.length}</span>
            <span className="text-pink-600">Nhấn vào thẻ để lật xem nghĩa ✨</span>
          </div>

          {/* Flashcard container */}
          <div
            onClick={() => {
              ttsService.playSoundEffect('click');
              setIsFlipped(!isFlipped);
            }}
            className="relative h-80 sm:h-96 w-full cursor-pointer perspective-1000 select-none group"
          >
            <div
              className={`w-full h-full rounded-3xl p-8 border-3 transition-all duration-500 flex flex-col justify-between items-center text-center shadow-xl ${
                isFlipped
                  ? 'bg-gradient-to-b from-pink-50 to-white border-pink-200 shadow-pink-100'
                  : 'bg-gradient-to-b from-sky-50 to-white border-sky-200 shadow-sky-100'
              }`}
            >
              {/* Header inside card */}
              <div className="w-full flex items-center justify-between text-xs font-bold text-sky-600">
                <span className="px-2.5 py-1 rounded-full bg-white border border-sky-100">
                  {currentFlashcard.partOfSpeech}
                </span>
                <span className="flex items-center gap-1 text-pink-500">
                  <RotateCw className="w-3.5 h-3.5" /> Lật thẻ
                </span>
              </div>

              {/* Main Content */}
              {!isFlipped ? (
                <div className="space-y-4 my-auto">
                  <span className="text-6xl animate-bounce">{currentFlashcard.iconEmoji}</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-sky-950 tracking-wide">
                    {currentFlashcard.term}
                  </h2>
                  <p className="text-lg font-mono text-pink-600 font-bold bg-pink-50 px-3 py-1 rounded-xl inline-block border border-pink-200">
                    {currentFlashcard.phonetic}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 my-auto">
                  <span className="text-5xl">{currentFlashcard.iconEmoji}</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-pink-700">
                    {currentFlashcard.meaningVi}
                  </h3>
                  <div className="p-3 bg-white/80 rounded-2xl border border-pink-100 max-w-sm mx-auto">
                    <p className="text-sm font-bold text-sky-900">{currentFlashcard.exampleEn}</p>
                    <p className="text-xs text-sky-700/80 mt-1 italic">{currentFlashcard.exampleVi}</p>
                  </div>
                </div>
              )}

              {/* Footer actions inside card */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full flex items-center justify-center gap-3 pt-3 border-t border-sky-100/60"
              >
                <button
                  onClick={() => handlePlayAudio(currentFlashcard.term, 1.0)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 text-white font-bold text-xs hover:bg-sky-600 shadow-sm"
                  title="Nghe chuẩn 1.0x"
                >
                  <Volume2 className="w-4 h-4" /> Đọc chuẩn
                </button>
                <button
                  onClick={() => handlePlayAudio(currentFlashcard.term, 0.75)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-100 text-pink-700 font-bold text-xs hover:bg-pink-200 border border-pink-200"
                  title="Nghe chậm rõ âm đuôi 0.75x"
                >
                  <Snail className="w-4 h-4" /> Đọc chậm
                </button>
                <button
                  onClick={() => onOpenAiBuddy(currentFlashcard)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs hover:bg-amber-200 border border-amber-200"
                  title="Hỏi Thỏ Bunny giải thích"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" /> Hỏi AI
                </button>
              </div>
            </div>
          </div>

          {/* Flashcard Navigation Controllers */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevCard}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-sky-200 text-sky-800 font-bold hover:bg-sky-50 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Từ trước</span>
            </button>
            <button
              onClick={handleNextCard}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-sky-500 text-white font-bold hover:bg-sky-600 transition-colors shadow-md shadow-sky-200"
            >
              <span>Từ tiếp theo</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* GRID / LIST MODE */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {unitWords.map((item) => {
            const isLearned = progress.learnedWordIds.includes(item.id);
            const isFavorite = progress.favoriteWordIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`relative bg-white rounded-3xl p-5 sm:p-6 border-2 transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
                  isLearned ? 'border-emerald-200 bg-emerald-50/20' : 'border-sky-100 hover:border-sky-200'
                }`}
              >
                <div>
                  {/* Top Bar of Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-3xl">
                        {item.iconEmoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl sm:text-2xl font-black text-sky-950 tracking-tight">
                            {item.term}
                          </h3>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-700">
                            {item.partOfSpeech}
                          </span>
                        </div>
                        <p className="text-sm font-mono text-pink-600 font-bold mt-0.5">
                          {item.phonetic}
                        </p>
                      </div>
                    </div>

                    {/* Favorite and Learned buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onToggleFavorite(item.id)}
                        className={`p-2 rounded-xl transition-colors ${
                          isFavorite ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                        }`}
                        title="Yêu thích từ này"
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
                      </button>
                      <button
                        onClick={() => onMarkLearned(item.id)}
                        className={`p-2 rounded-xl transition-colors ${
                          isLearned ? 'text-emerald-600 bg-emerald-100' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={isLearned ? 'Đã thành thạo' : 'Đánh dấu đã thuộc (+2⭐)'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Meaning in Vietnamese */}
                  <div className="mt-3.5 p-3 rounded-2xl bg-sky-50/60 border border-sky-100">
                    <p className="text-sm font-extrabold text-sky-900">
                      Nghĩa: <span className="text-pink-600">{item.meaningVi}</span>
                    </p>
                  </div>

                  {/* Examples */}
                  <div className="mt-3 text-xs space-y-1 text-sky-900">
                    <p className="font-semibold text-sky-800/90 flex items-start gap-1.5">
                      <span className="text-sky-500 font-bold">VD:</span>
                      <span>{item.exampleEn}</span>
                    </p>
                    <p className="italic text-slate-500 pl-6">
                      "{item.exampleVi}"
                    </p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-5 pt-3 border-t border-sky-50 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlayAudio(item.term, 1.0)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-sm shadow-sky-200"
                      title="Phát âm chuẩn 1.0x"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Đọc chuẩn</span>
                    </button>
                    <button
                      onClick={() => handlePlayAudio(item.term, 0.75)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold transition-colors"
                      title="Nghe chậm rõ âm đuôi 0.75x"
                    >
                      <Snail className="w-3.5 h-3.5" />
                      <span>Chậm</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenAiBuddy(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-extrabold transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                    <span>Hỏi Thỏ Bunny</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
