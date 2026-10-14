import React, { useState, useMemo } from 'react';
import { Search, Volume2, Snail, Heart, CheckCircle2, Sparkles, Filter, X } from 'lucide-react';
import { VOCABULARY_LIST, UNIT_METADATA } from '../data/vocabularyData';
import { VocabularyItem, UserProgress } from '../types';
import { ttsService } from '../services/ttsService';

interface VocabularySearchProps {
  progress: UserProgress;
  onToggleFavorite: (id: string) => void;
  onMarkLearned: (id: string) => void;
  onOpenAiBuddy: (item: VocabularyItem) => void;
}

export const VocabularySearch: React.FC<VocabularySearchProps> = ({
  progress,
  onToggleFavorite,
  onMarkLearned,
  onOpenAiBuddy,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnit, setFilterUnit] = useState<number>(0);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [onlyUnlearned, setOnlyUnlearned] = useState(false);

  const filteredList = useMemo(() => {
    return VOCABULARY_LIST.filter((item) => {
      const matchSearch =
        searchTerm.trim() === '' ||
        item.term.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        item.meaningVi.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        item.phonetic.toLowerCase().includes(searchTerm.toLowerCase().trim());

      const matchUnit = filterUnit === 0 || item.unit === filterUnit;
      const matchFav = !onlyFavorites || progress.favoriteWordIds.includes(item.id);
      const matchUnlearned = !onlyUnlearned || !progress.learnedWordIds.includes(item.id);

      return matchSearch && matchUnit && matchFav && matchUnlearned;
    });
  }, [searchTerm, filterUnit, onlyFavorites, onlyUnlearned, progress]);

  const handlePlayAudio = (text: string, rate: number = 0.9) => {
    ttsService.playSoundEffect('click');
    ttsService.speak(text, rate);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header and Search Input */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
            Từ điển mini
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-sky-950 mt-1">
            Tra Cứu Từ Vựng Tiếng Anh Lớp 4 🔍
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tìm nhanh theo từ tiếng Anh, phiên âm IPA hoặc nghĩa tiếng Việt.
          </p>
        </div>

        {/* Input Field */}
        <div className="relative">
          <Search className="w-5 h-5 text-sky-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nhập từ cần tìm (ví dụ: friend, swim, bơi lội, sinh nhật...)"
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-sky-50/60 border border-sky-200 text-sm font-bold text-sky-950 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-sky-100 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-sky-700">
            <Filter className="w-3.5 h-3.5" />
            <span>Lọc theo:</span>
          </div>

          <select
            value={filterUnit}
            onChange={(e) => setFilterUnit(Number(e.target.value))}
            className="bg-sky-50 border border-sky-200 text-sky-800 rounded-xl px-2.5 py-1.5 outline-none font-bold"
          >
            <option value={0}>Tất cả Unit</option>
            {UNIT_METADATA.map((u) => (
              <option key={u.unit} value={u.unit}>
                Unit {u.unit}: {u.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              onlyFavorites
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-white border-sky-200 text-slate-600 hover:bg-sky-50'
            }`}
          >
            ❤️ Từ yêu thích ({progress.favoriteWordIds.length})
          </button>

          <button
            onClick={() => setOnlyUnlearned(!onlyUnlearned)}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              onlyUnlearned
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white border-sky-200 text-slate-600 hover:bg-sky-50'
            }`}
          >
            ⏳ Từ chưa thuộc
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-extrabold text-sky-800 px-2">
        <span>Tìm thấy {filteredList.length} từ vựng</span>
      </div>

      {/* Results Grid */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-sky-200 space-y-3">
          <span className="text-5xl">🐰💭</span>
          <p className="font-extrabold text-sky-950 text-base">
            Không tìm thấy từ nào phù hợp!
          </p>
          <p className="text-xs text-slate-500">
            Bé hãy thử kiểm tra lại chính tả hoặc chọn lại bộ lọc xem sao nhé.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map((item) => {
            const isLearned = progress.learnedWordIds.includes(item.id);
            const isFav = progress.favoriteWordIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-5 border-2 transition-all flex flex-col justify-between shadow-sm ${
                  isLearned ? 'border-emerald-200 bg-emerald-50/20' : 'border-sky-100 hover:border-sky-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-2xl">
                        {item.iconEmoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-sky-950">{item.term}</h3>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">
                            Unit {item.unit}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-pink-600 font-bold">{item.phonetic}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleFavorite(item.id)}
                        className={`p-1.5 rounded-lg ${
                          isFav ? 'text-rose-500' : 'text-slate-300 hover:text-rose-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                      </button>
                      <button
                        onClick={() => onMarkLearned(item.id)}
                        className={`p-1.5 rounded-lg ${
                          isLearned ? 'text-emerald-600' : 'text-slate-300 hover:text-emerald-600'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 text-xs font-bold text-sky-900">
                    Nghĩa: <span className="text-pink-600 font-black">{item.meaningVi}</span>
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500 italic">
                    "{item.exampleEn}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-sky-50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handlePlayAudio(item.term, 1.0)}
                      className="p-1.5 px-2.5 rounded-xl bg-sky-500 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Chuẩn
                    </button>
                    <button
                      onClick={() => handlePlayAudio(item.term, 0.75)}
                      className="p-1.5 px-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold flex items-center gap-1"
                    >
                      <Snail className="w-3.5 h-3.5" /> Chậm
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenAiBuddy(item)}
                    className="p-1.5 px-2.5 rounded-xl bg-pink-50 text-pink-700 border border-pink-200 text-xs font-bold flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-pink-500" /> Hỏi AI
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
