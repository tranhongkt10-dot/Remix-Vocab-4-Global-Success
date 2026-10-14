import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, XCircle, ArrowRight, BookOpen, Lightbulb, Star } from 'lucide-react';
import { PHONICS_LESSONS } from '../data/phonicsData';
import { PhonicsLesson } from '../types';
import { ttsService } from '../services/ttsService';

interface PhonicsSectionProps {
  onMarkPhonicsCompleted: (lessonId: string) => void;
  completedLessonIds: string[];
}

export const PhonicsSection: React.FC<PhonicsSectionProps> = ({
  onMarkPhonicsCompleted,
  completedLessonIds,
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>('s-es');
  const [quizState, setQuizState] = useState<{
    questionIndex: number;
    score: number;
    selectedOption: string | null;
    isAnswered: boolean;
    quizDone: boolean;
  }>({
    questionIndex: 0,
    score: 0,
    selectedOption: null,
    isAnswered: false,
    quizDone: false,
  });

  const activeLesson: PhonicsLesson =
    PHONICS_LESSONS.find((l) => l.id === selectedLessonId) || PHONICS_LESSONS[0];

  const currentQuiz = activeLesson.practiceQuiz[quizState.questionIndex];

  const handlePlayWord = (word: string) => {
    ttsService.playSoundEffect('click');
    ttsService.speak(word, 0.85);
  };

  const handleSelectOption = (option: string) => {
    if (quizState.isAnswered || !currentQuiz) return;
    const isCorrect = option === currentQuiz.correctAnswer;
    if (isCorrect) {
      ttsService.playSoundEffect('correct');
      setQuizState((prev) => ({
        ...prev,
        score: prev.score + 1,
        selectedOption: option,
        isAnswered: true,
      }));
    } else {
      ttsService.playSoundEffect('wrong');
      setQuizState((prev) => ({
        ...prev,
        selectedOption: option,
        isAnswered: true,
      }));
    }
  };

  const handleNextQuiz = () => {
    if (quizState.questionIndex < activeLesson.practiceQuiz.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        questionIndex: prev.questionIndex + 1,
        selectedOption: null,
        isAnswered: false,
      }));
    } else {
      setQuizState((prev) => ({
        ...prev,
        quizDone: true,
      }));
      ttsService.playSoundEffect('celebrate');
      onMarkPhonicsCompleted(activeLesson.id);
    }
  };

  const handleResetQuiz = () => {
    setQuizState({
      questionIndex: 0,
      score: 0,
      selectedOption: null,
      isAnswered: false,
      quizDone: false,
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Introduction */}
      <div className="bg-gradient-to-r from-indigo-500 via-sky-400 to-pink-400 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-100">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black mb-3">
            <Lightbulb className="w-3.5 h-3.5 text-amber-200" />
            <span>Chuyên đề Ngữ Âm & Trọng Âm Lớp 4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Bí Quyết Phát Âm Chuẩn Như Người Bản Xứ! 🎙️
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-indigo-50 leading-relaxed font-medium">
            Nắm chắc quy tắc đọc đuôi <span className="font-bold underline">-s/-es</span>, <span className="font-bold underline">-ed</span> và cách nhấn trọng âm từ, trọng âm câu qua các mẹo thần chú cực vui và dễ nhớ.
          </p>
        </div>
      </div>

      {/* 4 Lesson Tab Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {PHONICS_LESSONS.map((lesson) => {
          const isSelected = lesson.id === selectedLessonId;
          const isDone = completedLessonIds.includes(lesson.id);

          return (
            <button
              key={lesson.id}
              onClick={() => {
                setSelectedLessonId(lesson.id);
                handleResetQuiz();
              }}
              className={`p-4 rounded-3xl border-2 text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-indigo-400 shadow-md shadow-indigo-100 scale-102 ring-2 ring-indigo-200'
                  : 'bg-white border-sky-100 hover:border-sky-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xl">
                    {lesson.id === 's-es' ? '🐍' : lesson.id === 'ed' ? '⏰' : lesson.id === 'word-stress' ? '🎯' : '🎶'}
                  </span>
                  {isDone && (
                    <span className="flex items-center gap-1 text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Đã xong
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-sky-950 mt-2">
                  {lesson.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 mt-2">
                {lesson.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Lesson Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-sm space-y-8">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            Lý thuyết & Mẹo nhớ
          </span>
          <h2 className="text-2xl font-black text-sky-950 mt-2">
            {activeLesson.title}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {activeLesson.description}
          </p>
        </div>

        {/* Rules Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {activeLesson.rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-gradient-to-b from-sky-50/50 to-white rounded-3xl p-5 border-2 border-sky-100 hover:border-sky-300 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-white border border-sky-200 text-sky-800">
                  {rule.endingOrType}
                </span>
                <span className="text-lg font-mono font-black text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-lg border border-pink-100">
                  {rule.soundIpa}
                </span>
              </div>

              {/* Memory Trick Box */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 leading-relaxed">
                💡 <span className="font-extrabold">{rule.memoryTrick}</span>
              </div>

              {/* Examples with Audio */}
              <div className="space-y-2">
                <p className="text-[11px] font-black uppercase text-slate-400">Ví dụ tiêu biểu:</p>
                {rule.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-xl bg-white border border-sky-100 hover:bg-sky-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-black text-sky-950">{ex.word}</p>
                      <p className="text-[11px] font-mono text-pink-600">{ex.phonetic}</p>
                      <p className="text-[10px] text-slate-500 italic">{ex.meaningVi}</p>
                    </div>
                    <button
                      onClick={() => handlePlayWord(ex.word)}
                      className="p-2 rounded-xl bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Practice Quiz for this Phonics Lesson */}
        <div className="pt-6 border-t border-sky-100">
          <div className="max-w-xl mx-auto bg-gradient-to-b from-pink-50/50 to-white rounded-3xl p-6 sm:p-8 border-2 border-pink-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-pink-600 bg-pink-100 px-2.5 py-1 rounded-md">
                Bài tập thực hành
              </span>
              <span className="text-xs font-extrabold text-sky-800">
                Câu {quizState.questionIndex + 1} / {activeLesson.practiceQuiz.length}
              </span>
            </div>

            {quizState.quizDone ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                  🎉
                </div>
                <h3 className="text-xl font-black text-sky-950">
                  Xuất Sắc! Bé Đã Hoàn Thành Chuyên Đề Này!
                </h3>
                <p className="text-xs font-bold text-slate-600">
                  Đúng {quizState.score} / {activeLesson.practiceQuiz.length} câu. Nhận ngay 10 sao thưởng ⭐!
                </p>
                <button
                  onClick={handleResetQuiz}
                  className="px-6 py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs transition-all shadow-md shadow-indigo-200"
                >
                  Làm lại bài luyện tập
                </button>
              </div>
            ) : (
              currentQuiz && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-black text-sky-950">
                      {currentQuiz.question}
                    </h3>
                    {currentQuiz.audioWord && (
                      <button
                        onClick={() => handlePlayWord(currentQuiz.audioWord!)}
                        className="p-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-colors shadow-sm"
                        title="Nghe từ mẫu"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {currentQuiz.options.map((opt) => {
                      const isCorrect = opt === currentQuiz.correctAnswer;
                      const isSelected = quizState.selectedOption === opt;

                      let btnStyle = 'bg-white border-sky-200 text-sky-950 hover:bg-sky-50';
                      if (quizState.isAnswered) {
                        if (isCorrect) btnStyle = 'bg-emerald-500 text-white border-emerald-500';
                        else if (isSelected) btnStyle = 'bg-rose-500 text-white border-rose-500';
                        else btnStyle = 'opacity-40 bg-slate-100 border-slate-200 text-slate-400';
                      }

                      return (
                        <button
                          key={opt}
                          disabled={quizState.isAnswered}
                          onClick={() => handleSelectOption(opt)}
                          className={`w-full p-3.5 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizState.isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4" />}
                          {quizState.isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>

                  {quizState.isAnswered && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900">
                        <span className="font-extrabold text-sky-950">Giải thích: </span>
                        {currentQuiz.explanation}
                      </div>

                      <button
                        onClick={handleNextQuiz}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-black text-sm shadow-md shadow-pink-200 transition-all"
                      >
                        <span>Câu tiếp theo</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
