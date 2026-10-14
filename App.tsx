/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { UnitList } from './components/UnitList';
import { UnitDetail } from './components/UnitDetail';
import { GamesHub } from './components/GamesHub';
import { PhonicsSection } from './components/PhonicsSection';
import { VocabularySearch } from './components/VocabularySearch';
import { AiBuddyModal } from './components/AiBuddyModal';
import { ProgressModal } from './components/ProgressModal';
import { 
  getUserProgress, 
  saveUserProgress, 
  addStars, 
  toggleFavoriteWord, 
  markWordLearned, 
  markPhonicsDone, 
  updateUnitQuizScore 
} from './services/progressService';
import { VocabularyItem, UserProgress, QuizType } from './types';
import { ttsService } from './services/ttsService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'units' | 'games' | 'phonics' | 'search'>('home');
  const [selectedUnitNumber, setSelectedUnitNumber] = useState<number | null>(null);
  const [activeGameType, setActiveGameType] = useState<QuizType>('missing-letter');
  const [selectedAiWord, setSelectedAiWord] = useState<VocabularyItem | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [progress, setProgress] = useState<UserProgress>(getUserProgress());

  useEffect(() => {
    // Refresh user progress on mount
    setProgress(getUserProgress());
  }, []);

  const handleToggleSpeechRate = () => {
    const nextRate = speechRate === 1.0 ? 0.8 : 1.0;
    setSpeechRate(nextRate);
    ttsService.playSoundEffect('click');
    ttsService.speak(`Pronunciation speed ${nextRate === 1.0 ? 'normal' : 'slow'}`, nextRate);
  };

  const handleSelectUnit = (unit: number) => {
    ttsService.playSoundEffect('click');
    setSelectedUnitNumber(unit);
  };

  const handleBackToUnits = () => {
    ttsService.playSoundEffect('click');
    setSelectedUnitNumber(null);
  };

  const handleToggleFavorite = (wordId: string) => {
    ttsService.playSoundEffect('click');
    toggleFavoriteWord(wordId);
    setProgress(getUserProgress());
  };

  const handleMarkLearned = (wordId: string) => {
    ttsService.playSoundEffect('correct');
    markWordLearned(wordId);
    setProgress(getUserProgress());
  };

  const handleRewardStars = (count: number) => {
    addStars(count);
    setProgress(getUserProgress());
  };

  const handleUpdateUnitScore = (unit: number, scorePercent: number) => {
    updateUnitQuizScore(unit, scorePercent);
    setProgress(getUserProgress());
  };

  const handleMarkPhonicsCompleted = (lessonId: string) => {
    markPhonicsDone(lessonId);
    setProgress(getUserProgress());
  };

  const handleResetProgress = () => {
    const resetData: UserProgress = {
      totalStars: 10,
      learnedWordIds: [],
      favoriteWordIds: [],
      unitScores: {},
      phonicsCompleted: [],
      streakDays: 1,
      lastStudyDate: new Date().toISOString().split('T')[0],
    };
    saveUserProgress(resetData);
    setProgress(resetData);
    setIsProfileOpen(false);
  };

  const handleStartUnitQuiz = (unit: number) => {
    setSelectedUnitNumber(null);
    setCurrentTab('games');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/70 via-white to-pink-50/40 text-slate-800 font-sans antialiased selection:bg-pink-200 selection:text-pink-900">
      
      {/* Sticky Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setSelectedUnitNumber(null);
          setCurrentTab(tab);
          ttsService.playSoundEffect('click');
        }}
        progress={progress}
        speechRate={speechRate}
        onToggleSpeechRate={handleToggleSpeechRate}
        onOpenProfile={() => {
          ttsService.playSoundEffect('click');
          setIsProfileOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Tab 0: Home Screen */}
        {currentTab === 'home' && (
          <HomeScreen
            progress={progress}
            onNavigateTab={(tab, filter) => {
              setSelectedUnitNumber(null);
              if (filter === 'spelling') setActiveGameType('missing-letter');
              else if (filter === 'quiz') setActiveGameType('en-vi');
              setCurrentTab(tab);
              ttsService.playSoundEffect('click');
            }}
            onSelectUnit={(unit) => {
              setSelectedUnitNumber(unit);
              setCurrentTab('units');
              ttsService.playSoundEffect('click');
            }}
            onOpenProfile={() => {
              ttsService.playSoundEffect('click');
              setIsProfileOpen(true);
            }}
          />
        )}

        {/* Tab 1: Units View */}
        {currentTab === 'units' && (
          <div>
            {selectedUnitNumber === null ? (
              <UnitList
                onSelectUnit={handleSelectUnit}
                progress={progress}
              />
            ) : (
              <UnitDetail
                unitNumber={selectedUnitNumber}
                onBack={handleBackToUnits}
                progress={progress}
                onToggleFavorite={handleToggleFavorite}
                onMarkLearned={handleMarkLearned}
                onOpenAiBuddy={(item) => setSelectedAiWord(item)}
                onStartUnitQuiz={handleStartUnitQuiz}
              />
            )}
          </div>
        )}

        {/* Tab 2: Interactive Games Hub */}
        {currentTab === 'games' && (
          <GamesHub
            key={`${selectedUnitNumber || 0}_${activeGameType}`}
            initialUnit={selectedUnitNumber || 0}
            initialGameType={activeGameType}
            onRewardStars={handleRewardStars}
            onUpdateUnitScore={handleUpdateUnitScore}
          />
        )}

        {/* Tab 3: Phonics & Pronunciation Section */}
        {currentTab === 'phonics' && (
          <PhonicsSection
            onMarkPhonicsCompleted={handleMarkPhonicsCompleted}
            completedLessonIds={progress.phonicsCompleted}
          />
        )}

        {/* Tab 4: Global Vocabulary Search */}
        {currentTab === 'search' && (
          <VocabularySearch
            progress={progress}
            onToggleFavorite={handleToggleFavorite}
            onMarkLearned={handleMarkLearned}
            onOpenAiBuddy={(item) => setSelectedAiWord(item)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-sky-100 bg-white/70 py-8 text-center text-xs text-sky-800/70 space-y-2">
        <div className="flex items-center justify-center gap-2 font-bold text-sky-900">
          <span>🐰 Vocab 4 – Global Success</span>
          <span>•</span>
          <span>Ứng dụng học tiếng Anh tiểu học vui & hiệu quả</span>
        </div>
        <p className="max-w-2xl mx-auto px-4 text-[11px] text-slate-500">
          Nội dung tham khảo định hướng theo khung chương trình Tiếng Anh 4 (Global Success). Tích hợp phát âm chuẩn Web Speech và Trợ lý AI thông minh có cơ chế lưu đệm tiết kiệm tối đa tài nguyên.
        </p>
      </footer>

      {/* AI Buddy Explanation Dialog */}
      <AiBuddyModal
        item={selectedAiWord}
        onClose={() => setSelectedAiWord(null)}
      />

      {/* Student Profile & Progress Modal */}
      <ProgressModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        progress={progress}
        onResetProgress={handleResetProgress}
      />

    </div>
  );
}
