import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Volume2, Sparkles, RefreshCw, Trophy, 
  ArrowRight, CheckCircle2, XCircle, Shuffle, Ear, FileText, Info
} from 'lucide-react';
import { VOCABULARY_LIST, UNIT_METADATA } from '../data/vocabularyData';
import { VocabularyItem, QuizType } from '../types';
import { ttsService } from '../services/ttsService';

interface GamesHubProps {
  initialUnit?: number;
  initialGameType?: QuizType;
  onRewardStars: (count: number) => void;
  onUpdateUnitScore: (unit: number, scorePercent: number) => void;
}

export const GamesHub: React.FC<GamesHubProps> = ({
  initialUnit,
  initialGameType,
  onRewardStars,
  onUpdateUnitScore,
}) => {
  const [selectedGame, setSelectedGame] = useState<QuizType>(initialGameType || 'missing-letter');
  const [targetUnit, setTargetUnit] = useState<number>(initialUnit || 0); // 0 = all units
  
  // Game State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameFinished, setGameFinished] = useState(false);

  // Unscramble Game specific state
  const [scrambledLetters, setScrambledLetters] = useState<{ id: string; letter: string }[]>([]);
  const [userLetters, setUserLetters] = useState<{ id: string; letter: string }[]>([]);

  // Kiểm tra SpeechSynthesis trình duyệt
  const isSpeechAvailable = ttsService.isSpeechSupported();

  // Filter pool of words
  const wordPool = useMemo(() => {
    let pool = targetUnit === 0 
      ? VOCABULARY_LIST 
      : VOCABULARY_LIST.filter((w) => w.unit === targetUnit);
    if (pool.length < 4) pool = VOCABULARY_LIST;
    return [...pool].sort(() => Math.random() - 0.5);
  }, [targetUnit]);

  const activeQuestionList = useMemo(() => {
    return wordPool.slice(0, 5); // 5 câu mỗi vòng thử thách
  }, [wordPool]);

  const currentWord: VocabularyItem | undefined = activeQuestionList[currentQuestionIndex];

  // Prepare question options for Quiz & Listen
  const currentOptions = useMemo(() => {
    if (!currentWord) return [];

    if (selectedGame === 'en-vi' || selectedGame === 'listen-choose') {
      const wrongPool = VOCABULARY_LIST
        .filter((w) => w.id !== currentWord.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((w) => w.meaningVi);
      const all = [currentWord.meaningVi, ...wrongPool];
      return all.sort(() => Math.random() - 0.5);
    }

    if (selectedGame === 'vi-en') {
      const wrongPool = VOCABULARY_LIST
        .filter((w) => w.id !== currentWord.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((w) => w.term);
      const all = [currentWord.term, ...wrongPool];
      return all.sort(() => Math.random() - 0.5);
    }

    return [];
  }, [currentWord, selectedGame]);

  // Missing letter logic
  const missingLetterData = useMemo(() => {
    if (!currentWord || selectedGame !== 'missing-letter') return null;
    const cleanTerm = currentWord.term.toLowerCase();
    const letters = cleanTerm.split('');
    const validIndices = letters
      .map((char, idx) => ({ char, idx }))
      .filter(({ char }) => /[a-z]/.test(char));
    
    if (validIndices.length === 0) return null;
    const picked = validIndices[Math.floor(Math.random() * validIndices.length)];
    const maskedWord = cleanTerm
      .split('')
      .map((c, i) => (i === picked.idx ? '_' : c))
      .join('');

    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const wrongLetters = alphabet
      .filter((l) => l !== picked.char)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const choices = [picked.char, ...wrongLetters].sort(() => Math.random() - 0.5);

    return {
      maskedWord,
      correctLetter: picked.char,
      choices,
    };
  }, [currentWord, selectedGame]);

  // Setup Unscramble when word changes
  const setupUnscramble = useCallback((word: VocabularyItem) => {
    const raw = word.term.replace(/\s+/g, '').toUpperCase().split('');
    const lettersWithId = raw.map((char, index) => ({
      id: `${char}_${index}_${Math.random()}`,
      letter: char,
    }));
    const scrambled = [...lettersWithId].sort(() => Math.random() - 0.5);
    setScrambledLetters(scrambled);
    setUserLetters([]);
  }, []);

  useEffect(() => {
    if (selectedGame === 'unscramble' && currentWord) {
      setupUnscramble(currentWord);
    }
    setIsAnswered(false);
    setSelectedAnswer(null);
  }, [currentWord, selectedGame, setupUnscramble]);

  const handlePlayAudio = (text: string) => {
    ttsService.playSoundEffect('click');
    ttsService.speak(text, 0.9);
  };

  const handleSelectAnswer = (ans: string) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedAnswer(ans);

    let isCorrect = false;
    if (selectedGame === 'en-vi' || selectedGame === 'listen-choose') {
      isCorrect = ans === currentWord?.meaningVi;
    } else if (selectedGame === 'vi-en') {
      isCorrect = ans === currentWord?.term;
    } else if (selectedGame === 'missing-letter') {
      isCorrect = ans === missingLetterData?.correctLetter;
    }

    if (isCorrect) {
      setScore((prev) => prev + 1);
      ttsService.playSoundEffect('correct');
    } else {
      ttsService.playSoundEffect('wrong');
    }
  };

  // Unscramble letter handlers
  const handlePickLetter = (item: { id: string; letter: string }) => {
    ttsService.playSoundEffect('click');
    setScrambledLetters((prev) => prev.filter((l) => l.id !== item.id));
    setUserLetters((prev) => [...prev, item]);
  };

  const handleRemoveLetter = (item: { id: string; letter: string }) => {
    ttsService.playSoundEffect('click');
    setUserLetters((prev) => prev.filter((l) => l.id !== item.id));
    setScrambledLetters((prev) => [...prev, item]);
  };

  const handleCheckUnscramble = () => {
    if (!currentWord) return;
    const target = currentWord.term.replace(/\s+/g, '').toUpperCase();
    const current = userLetters.map((l) => l.letter).join('');
    setIsAnswered(true);

    if (current === target) {
      setScore((prev) => prev + 1);
      ttsService.playSoundEffect('correct');
    } else {
      ttsService.playSoundEffect('wrong');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuestionList.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      setGameFinished(true);
      const percent = Math.round((score / activeQuestionList.length) * 100);
      ttsService.playSoundEffect('celebrate');
      onRewardStars(score * 3);
      if (targetUnit > 0) {
        onUpdateUnitScore(targetUnit, percent);
      }
    }
  };

  const handleRestartGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setGameFinished(false);
  };

  // Tính xem câu hiện tại đúng hay sai
  const isCurrentCorrect = useMemo(() => {
    if (!isAnswered || !currentWord) return false;
    if (selectedGame === 'missing-letter') return selectedAnswer === missingLetterData?.correctLetter;
    if (selectedGame === 'unscramble') {
      const target = currentWord.term.replace(/\s+/g, '').toUpperCase();
      const current = userLetters.map((l) => l.letter).join('');
      return current === target;
    }
    if (selectedGame === 'en-vi' || selectedGame === 'listen-choose') return selectedAnswer === currentWord.meaningVi;
    if (selectedGame === 'vi-en') return selectedAnswer === currentWord.term;
    return false;
  }, [isAnswered, currentWord, selectedGame, selectedAnswer, missingLetterData, userLetters]);

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. THANH ĐIỀU HƯỚNG CHỌN TRÒ CHƠI & UNIT */}
      <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 py-1 rounded-md">
              Khu Vực Luyện Tập Cục Bộ
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-sky-950 mt-1">
              Trung Tâm Trò Chơi & Bài Tập 🎮
            </h1>
          </div>

          {/* Chọn Unit */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-700">Chủ đề:</span>
            <select
              value={targetUnit}
              onChange={(e) => {
                setTargetUnit(Number(e.target.value));
                handleRestartGame();
              }}
              className="bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value={0}>Tất cả 20 Units</option>
              {UNIT_METADATA.map((u) => (
                <option key={u.unit} value={u.unit}>
                  Unit {u.unit}: {u.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Danh sách 5 chế độ bài tập tương tác */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-sky-100">
          
          {/* Game 1: Điền chữ thiếu */}
          <button
            onClick={() => {
              setSelectedGame('missing-letter');
              handleRestartGame();
            }}
            className={`flex items-center justify-center gap-1.5 p-2.5 rounded-2xl text-xs font-extrabold transition-all border ${
              selectedGame === 'missing-letter'
                ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-200'
                : 'bg-sky-50/60 border-sky-100 text-sky-800 hover:bg-sky-100'
            }`}
          >
            <span>🔤 Điền chữ thiếu</span>
          </button>

          {/* Game 2: Sắp xếp chữ cái */}
          <button
            onClick={() => {
              setSelectedGame('unscramble');
              handleRestartGame();
            }}
            className={`flex items-center justify-center gap-1.5 p-2.5 rounded-2xl text-xs font-extrabold transition-all border ${
              selectedGame === 'unscramble'
                ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-200'
                : 'bg-pink-50/60 border-pink-100 text-pink-800 hover:bg-pink-100'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Sắp xếp chữ cái</span>
          </button>

          {/* Game 3: Trắc nghiệm Anh - Việt */}
          <button
            onClick={() => {
              setSelectedGame('en-vi');
              handleRestartGame();
            }}
            className={`flex items-center justify-center gap-1.5 p-2.5 rounded-2xl text-xs font-extrabold transition-all border ${
              selectedGame === 'en-vi'
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200'
                : 'bg-emerald-50/60 border-emerald-100 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Anh ➔ Việt</span>
          </button>

          {/* Game 4: Trắc nghiệm Việt - Anh */}
          <button
            onClick={() => {
              setSelectedGame('vi-en');
              handleRestartGame();
            }}
            className={`flex items-center justify-center gap-1.5 p-2.5 rounded-2xl text-xs font-extrabold transition-all border ${
              selectedGame === 'vi-en'
                ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-200'
                : 'bg-amber-50/60 border-amber-100 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Việt ➔ Anh</span>
          </button>

          {/* Game 5: Nghe chọn từ */}
          <button
            onClick={() => {
              setSelectedGame('listen-choose');
              handleRestartGame();
            }}
            className={`col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 p-2.5 rounded-2xl text-xs font-extrabold transition-all border ${
              selectedGame === 'listen-choose'
                ? 'bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-200'
                : 'bg-indigo-50/60 border-indigo-100 text-indigo-800 hover:bg-indigo-100'
            }`}
          >
            <Ear className="w-3.5 h-3.5" />
            <span>Nghe & Chọn</span>
          </button>
        </div>

        {/* Thông báo trạng thái hỗ trợ âm thanh Web Speech & Lưu ý minh bạch */}
        {selectedGame === 'listen-choose' && (
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-start gap-2.5 text-xs text-indigo-900">
            <Info className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {isSpeechAvailable 
                  ? 'Trình duyệt của bạn hỗ trợ tính năng phát âm Web Speech API.' 
                  : 'Cảnh báo: Trình duyệt này có thể chưa bật tính năng đọc văn bản SpeechSynthesis.'}
              </p>
              <p className="text-[11px] text-indigo-700/80 mt-0.5">
                Lưu ý: Ứng dụng chỉ phát âm giọng mẫu để học sinh luyện nghe và bắt chước, không tự động chấm điểm phát âm bằng giọng nói.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. MÀN HÌNH TỔNG KẾT KẾT QUẢ KHI LÀM XONG 5 CÂU */}
      {gameFinished ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-sky-100 text-center max-w-lg mx-auto shadow-xl space-y-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-300 to-pink-300 flex items-center justify-center mx-auto text-5xl shadow-lg animate-bounce">
            🏆
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-sky-950">
              Hoàn Thành Vòng Thử Thách!
            </h2>
            <p className="text-sm font-bold text-sky-700">
              Kết quả: Đúng <span className="text-pink-600 text-xl font-black">{score}</span> / {activeQuestionList.length} câu ({Math.round((score / activeQuestionList.length) * 100)}%)
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-sm">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Thưởng cho bé +{score * 3} Sao Vàng ⭐</span>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleRestartGame}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-black text-sm shadow-md shadow-sky-200 transition-all hover:scale-102"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Làm lại vòng mới</span>
            </button>
          </div>
        </div>
      ) : (
        /* 3. KHU VỰC THI ĐẤU LÀM BÀI */
        currentWord && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-md max-w-2xl mx-auto space-y-6">
            
            {/* Header câu hỏi & Điểm số */}
            <div className="flex items-center justify-between text-xs font-extrabold text-sky-700">
              <span className="bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                Câu hỏi {currentQuestionIndex + 1} / {activeQuestionList.length}
              </span>
              <span className="flex items-center gap-1.5 text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200 font-black">
                <Trophy className="w-4 h-4 text-pink-500" /> Điểm số: {score} câu đúng
              </span>
            </div>

            {/* Khung đề bài */}
            <div className="bg-gradient-to-b from-sky-50 to-white rounded-3xl p-6 border border-sky-200 text-center space-y-3">
              <span className="text-5xl select-none inline-block">{currentWord.iconEmoji}</span>

              {/* DẠNG 1: ĐIỀN CHỮ CÁI CÒN THIẾU */}
              {selectedGame === 'missing-letter' && missingLetterData && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-sky-600">Điền chữ cái còn thiếu vào chỗ trống:</p>
                  <div className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-sky-950 bg-white py-3 px-6 rounded-2xl border-2 border-dashed border-sky-300 inline-block shadow-inner">
                    {missingLetterData.maskedWord.toUpperCase()}
                  </div>
                  <p className="text-xs font-bold text-slate-500">
                    Gợi ý nghĩa: <span className="text-pink-600 font-extrabold">{currentWord.meaningVi}</span>
                  </p>
                </div>
              )}

              {/* DẠNG 2: SẮP XẾP CHỮ CÁI */}
              {selectedGame === 'unscramble' && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-sky-600">Bấm các chữ cái để xếp thành từ đúng:</p>
                  
                  {/* Khay chữ cái đã chọn */}
                  <div className="min-h-14 p-2 rounded-2xl bg-white border-2 border-dashed border-pink-300 flex items-center justify-center gap-1.5 flex-wrap">
                    {userLetters.length === 0 ? (
                      <span className="text-xs text-slate-400 font-medium">Bấm vào các ô chữ cái bên dưới để xếp vào đây</span>
                    ) : (
                      userLetters.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => !isAnswered && handleRemoveLetter(item)}
                          className="w-10 h-10 rounded-xl bg-pink-500 text-white font-black text-lg shadow-sm hover:bg-pink-600 transition-colors"
                          title="Bấm để bỏ chữ này ra"
                        >
                          {item.letter}
                        </button>
                      ))
                    )}
                  </div>

                  <p className="text-xs font-bold text-slate-500">
                    Gợi ý nghĩa: <span className="text-pink-600 font-extrabold">{currentWord.meaningVi}</span>
                  </p>
                </div>
              )}

              {/* DẠNG 3: TRẮC NGHIỆM ANH - VIỆT */}
              {selectedGame === 'en-vi' && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-sky-600">Từ tiếng Anh sau có nghĩa là gì?</p>
                  <h3 className="text-3xl font-black text-sky-950 tracking-wide">
                    {currentWord.term}
                  </h3>
                  <p className="text-xs font-mono text-pink-600 font-bold bg-pink-50 px-2 py-0.5 rounded-md inline-block">
                    {currentWord.phonetic}
                  </p>
                </div>
              )}

              {/* DẠNG 4: TRẮC NGHIỆM VIỆT - ANH */}
              {selectedGame === 'vi-en' && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-amber-700">Chọn từ tiếng Anh phù hợp với nghĩa:</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-sky-950">
                    "{currentWord.meaningVi}"
                  </h3>
                  <p className="text-xs text-slate-500">Chủ đề: {currentWord.topic}</p>
                </div>
              )}

              {/* DẠNG 5: NGHE VÀ CHỌN */}
              {selectedGame === 'listen-choose' && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-indigo-700">Bấm loa nghe từ phát âm và chọn nghĩa đúng:</p>
                  <button
                    onClick={() => handlePlayAudio(currentWord.term)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black text-sm shadow-md shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                  >
                    <Volume2 className="w-5 h-5 animate-pulse" />
                    <span>Nghe giọng đọc mẫu 🔊</span>
                  </button>
                </div>
              )}
            </div>

            {/* BÀN PHÍM / CÁC LỰA CHỌN ĐÁP ÁN */}

            {/* Choices: Missing Letter */}
            {selectedGame === 'missing-letter' && missingLetterData && (
              <div className="grid grid-cols-4 gap-3">
                {missingLetterData.choices.map((letter) => {
                  const isCorrect = letter === missingLetterData.correctLetter;
                  const isSelected = selectedAnswer === letter;
                  
                  let btnStyle = 'bg-sky-50 border-sky-200 text-sky-800 hover:bg-sky-100';
                  if (isAnswered) {
                    if (isCorrect) btnStyle = 'bg-emerald-500 text-white border-emerald-500 shadow-md';
                    else if (isSelected) btnStyle = 'bg-rose-500 text-white border-rose-500';
                    else btnStyle = 'opacity-40 bg-slate-100 border-slate-200 text-slate-400';
                  }

                  return (
                    <button
                      key={letter}
                      disabled={isAnswered}
                      onClick={() => handleSelectAnswer(letter)}
                      className={`h-16 rounded-2xl border-2 font-mono font-black text-2xl transition-all ${btnStyle}`}
                    >
                      {letter.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Choices: Unscramble letters */}
            {selectedGame === 'unscramble' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 flex-wrap min-h-12">
                  {scrambledLetters.map((item) => (
                    <button
                      key={item.id}
                      disabled={isAnswered}
                      onClick={() => handlePickLetter(item)}
                      className="w-11 h-11 rounded-xl bg-sky-100 hover:bg-sky-200 border-2 border-sky-300 text-sky-900 font-black text-lg transition-all shadow-sm hover:scale-105"
                    >
                      {item.letter}
                    </button>
                  ))}
                </div>

                {!isAnswered && (
                  <button
                    disabled={userLetters.length === 0}
                    onClick={handleCheckUnscramble}
                    className="w-full py-3.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-black text-sm shadow-md shadow-pink-200 disabled:opacity-40 transition-all"
                  >
                    Kiểm tra đáp án ✨
                  </button>
                )}
              </div>
            )}

            {/* Choices: Multiple Choices (en-vi, vi-en, listen-choose) */}
            {(selectedGame === 'en-vi' || selectedGame === 'vi-en' || selectedGame === 'listen-choose') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentOptions.map((opt) => {
                  const isCorrect = (selectedGame === 'vi-en') 
                    ? opt === currentWord.term 
                    : opt === currentWord.meaningVi;
                  const isSelected = selectedAnswer === opt;

                  let optStyle = 'bg-white border-sky-200 text-sky-900 hover:bg-sky-50';
                  if (isAnswered) {
                    if (isCorrect) optStyle = 'bg-emerald-500 text-white border-emerald-500 shadow-md';
                    else if (isSelected) optStyle = 'bg-rose-500 text-white border-rose-500';
                    else optStyle = 'opacity-40 bg-slate-50 border-slate-200 text-slate-400';
                  }

                  return (
                    <button
                      key={opt}
                      disabled={isAnswered}
                      onClick={() => handleSelectAnswer(opt)}
                      className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                      {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 4. KHUNG HIỂN THỊ KẾT QUẢ VÀ GIẢI THÍCH ĐÁP ÁN CHI TIẾT */}
            {isAnswered && (
              <div className="space-y-4 pt-2">
                
                {/* Result header banner */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isCurrentCorrect 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <div className="flex items-center gap-2 font-black text-sm">
                    {isCurrentCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Chính xác rồi! Bé rất giỏi! 🎉</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-600" />
                        <span>Chưa chính xác! Xem giải thích bên dưới nhé. 💪</span>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handlePlayAudio(currentWord.term)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border text-xs font-bold shadow-sm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe lại</span>
                  </button>
                </div>

                {/* Detailed explanation box */}
                <div className="bg-sky-50/80 rounded-2xl p-4 border border-sky-200 text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sky-950 text-sm">{currentWord.term}</span>
                    <span className="font-mono text-pink-600 font-bold">{currentWord.phonetic}</span>
                    <span className="px-1.5 py-0.5 rounded bg-white text-sky-700 font-bold text-[10px]">
                      {currentWord.partOfSpeech}
                    </span>
                  </div>

                  <p className="text-sky-900 font-bold">
                    Nghĩa đúng: <span className="text-pink-600 font-extrabold text-sm">{currentWord.meaningVi}</span>
                  </p>

                  <div className="bg-white/80 p-2.5 rounded-xl border border-sky-100">
                    <p className="font-semibold text-sky-900">Ví dụ: {currentWord.exampleEn}</p>
                    <p className="text-slate-500 italic mt-0.5">Dịch: "{currentWord.exampleVi}"</p>
                  </div>
                </div>

                {/* Nút sang câu tiếp theo */}
                <button
                  onClick={handleNextQuestion}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-pink-500 text-white font-black text-sm shadow-md shadow-sky-200 hover:scale-102 transition-all"
                >
                  <span>
                    {currentQuestionIndex < activeQuestionList.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả tổng kết'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        )
      )}
    </div>
  );
};
