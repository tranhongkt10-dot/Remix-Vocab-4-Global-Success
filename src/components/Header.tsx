import React from 'react';
import { Sparkles, Flame, Volume2, Trophy, BookOpen, Gamepad2, Mic, Search } from 'lucide-react';
import { UserProgress } from '../types';

interface HeaderProps {
  currentTab: 'home' | 'units' | 'games' | 'phonics' | 'search';
  onSelectTab: (tab: 'home' | 'units' | 'games' | 'phonics' | 'search') => void;
  progress: UserProgress;
  speechRate: number;
  onToggleSpeechRate: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  progress,
  speechRate,
  onToggleSpeechRate,
  onOpenProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-sky-300 to-pink-300 flex items-center justify-center shadow-md shadow-sky-100 group-hover:scale-105 transition-transform">
              <span className="text-2xl">🐰</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-sky-700">
                  Vocab <span className="text-pink-500">4</span>
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                  Global Success
                </span>
              </div>
              <p className="text-xs text-sky-600/80 font-medium">Tiếng Anh Lớp 4 Thật Dễ & Vui! 🌈</p>
            </div>
          </div>

          {/* Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1.5 bg-sky-50/80 p-1.5 rounded-2xl border border-sky-200/60">
            <button
              onClick={() => onSelectTab('home')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                currentTab === 'home'
                  ? 'bg-white text-sky-700 shadow-sm shadow-sky-100 scale-102'
                  : 'text-sky-800/70 hover:text-sky-800 hover:bg-white/50'
              }`}
            >
              <span>🏠 Trang chủ</span>
            </button>

            <button
              onClick={() => onSelectTab('units')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                currentTab === 'units'
                  ? 'bg-white text-sky-700 shadow-sm shadow-sky-100 scale-102'
                  : 'text-sky-800/70 hover:text-sky-800 hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-sky-500" />
              <span>20 Units</span>
            </button>

            <button
              onClick={() => onSelectTab('games')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                currentTab === 'games'
                  ? 'bg-white text-pink-600 shadow-sm shadow-pink-100 scale-102'
                  : 'text-sky-800/70 hover:text-pink-600 hover:bg-white/50'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-pink-500" />
              <span>Trò chơi</span>
            </button>

            <button
              onClick={() => onSelectTab('phonics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                currentTab === 'phonics'
                  ? 'bg-white text-indigo-600 shadow-sm shadow-indigo-100 scale-102'
                  : 'text-sky-800/70 hover:text-indigo-600 hover:bg-white/50'
              }`}
            >
              <Mic className="w-4 h-4 text-indigo-500" />
              <span>Ngữ âm & Trọng âm</span>
            </button>

            <button
              onClick={() => onSelectTab('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                currentTab === 'search'
                  ? 'bg-white text-sky-700 shadow-sm shadow-sky-100 scale-102'
                  : 'text-sky-800/70 hover:text-sky-700 hover:bg-white/50'
              }`}
            >
              <Search className="w-4 h-4 text-sky-500" />
              <span>Tra từ</span>
            </button>
          </nav>

          {/* Stats & Actions */}
          <div className="flex items-center gap-2.5">
            {/* Speed Toggle */}
            <button
              onClick={onToggleSpeechRate}
              title={`Tốc độ đọc giọng mẫu: ${speechRate === 1.0 ? 'Bình thường (1.0x)' : 'Chậm rõ âm (0.8x)'}`}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-sky-600" />
              <span>{speechRate === 1.0 ? '1.0x Chuẩn' : '0.8x Rõ đuôi'}</span>
            </button>

            {/* Streak Badge */}
            <div 
              title="Chuỗi ngày chăm chỉ học tập"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 font-extrabold text-sm"
            >
              <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
              <span>{progress.streakDays} ngày</span>
            </div>

            {/* Stars Badge */}
            <button
              onClick={onOpenProfile}
              title="Nhấn để xem Bảng thành tích học tập"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-extrabold text-sm hover:bg-amber-100 hover:scale-105 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{progress.totalStars} ⭐</span>
            </button>

            {/* Profile Button */}
            <button
              onClick={onOpenProfile}
              className="p-2 rounded-xl bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100 hover:scale-105 transition-all"
              title="Bảng vàng thành tích"
            >
              <Trophy className="w-5 h-5 text-pink-500" />
            </button>
          </div>

        </div>

        {/* Mobile Nav Pills */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-2 border-t border-sky-100 no-scrollbar">
          <button
            onClick={() => onSelectTab('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
              currentTab === 'home' ? 'bg-sky-500 text-white' : 'bg-sky-50 text-sky-700'
            }`}
          >
            🏠 Trang chủ
          </button>
          <button
            onClick={() => onSelectTab('units')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
              currentTab === 'units' ? 'bg-sky-500 text-white' : 'bg-sky-50 text-sky-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> 20 Units
          </button>
          <button
            onClick={() => onSelectTab('games')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
              currentTab === 'games' ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-700'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" /> Trò chơi
          </button>
          <button
            onClick={() => onSelectTab('phonics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
              currentTab === 'phonics' ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700'
            }`}
          >
            <Mic className="w-3.5 h-3.5" /> Ngữ âm & Trọng âm
          </button>
          <button
            onClick={() => onSelectTab('search')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
              currentTab === 'search' ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-700'
            }`}
          >
            <Search className="w-3.5 h-3.5" /> Tra cứu
          </button>
        </div>

      </div>
    </header>
  );
};
