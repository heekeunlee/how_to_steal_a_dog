import React, { useEffect } from 'react';
import useBookStore from './store/useBookStore';
import { useTTS } from './hooks/useTTS';
import SentenceCard from './components/Player/SentenceCard';
import ControlBar from './components/Player/ControlBar';
import { BookOpen, Star, BrainCircuit, PlayCircle } from 'lucide-react';
import coverImage from './assets/cover.jpg';

function App() {
  const {
    currentChapter,
    currentIndex,
    isPlaying,
    togglePlay,
    nextSentence,
    playbackSpeed,
    isLooping,
    stars,
    addStar,
    isQuizMode,
    toggleQuizMode,
    hasStarted,
    startReading
  } = useBookStore();

  const currentSentence = currentChapter.sentences[currentIndex];

  const handleEnd = () => {
    addStar();
    if (isLooping) {
      speak(currentSentence.text, playbackSpeed);
    } else {
      if (currentIndex < currentChapter.sentences.length - 1) {
        nextSentence();
      } else {
        if (isPlaying) togglePlay();
      }
    }
  };

  const { speak, cancel } = useTTS({ onEnd: handleEnd });

  // Sync TTS
  useEffect(() => {
    if (hasStarted && isPlaying) {
      speak(currentSentence.text, playbackSpeed);
    } else {
      cancel();
    }
    return () => cancel();
  }, [currentIndex, isPlaying, playbackSpeed, currentSentence.text, hasStarted]);


  // WELCOME SCREEN
  if (!hasStarted) {
    return (
      <div
        className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 cursor-pointer"
        onClick={startReading}
      >
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-transform hover:scale-105 duration-300">
          {/* Cover Image */}
          <div className="relative aspect-[2/3] w-full bg-slate-200">
            <img
              src={coverImage}
              alt="Book Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
              <h1 className="text-white text-3xl font-bold font-serif mb-2 tracking-tight">How to Steal a Dog</h1>
              <p className="text-white/90 text-sm font-medium">Barbara O'Connor</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="p-6 bg-white text-center">
            <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-lg animate-pulse">
              <PlayCircle size={24} />
              <span>Touch to Start</span>
            </div>
            <p className="text-slate-400 text-xs mt-2">Chapter 1 • 11 Sentences</p>
          </div>
        </div>
      </div>
    );
  }

  // MAIN PLAYER SCREEN
  const progressPercent = ((currentIndex + 1) / currentChapter.sentences.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-40 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30 transition-shadow">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-indigo-800">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <BookOpen size={20} className="text-indigo-600" />
              </div>
              <h1 className="font-bold text-base tracking-tight leading-none">
                How to Steal a Dog
                <span className="block text-xs text-slate-400 font-normal mt-1">Chapter 1</span>
              </h1>
            </div>

            {/* Star Counter */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full shadow-sm">
              <Star size={16} className="text-amber-500 fill-amber-500" />
              <span className="text-amber-700 font-bold text-sm tabular-nums">{stars}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-6 w-full max-w-2xl mx-auto">

        {/* Mode Toggles */}
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={toggleQuizMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${isQuizMode
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-2 ring-indigo-600 ring-offset-2'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
          >
            <BrainCircuit size={16} />
            {isQuizMode ? 'Quiz Active' : 'Quiz Mode'}
          </button>
        </div>

        <SentenceCard sentence={currentSentence} />

        <div className="mt-8 text-center" style={{ opacity: isQuizMode ? 1 : 0, transition: 'opacity 0.3s' }}>
          <p className="text-indigo-800 text-sm font-medium bg-indigo-50 inline-block px-4 py-2 rounded-lg">
            💡 Tip: Click the blanks to reveal the answer!
          </p>
        </div>

      </main>

      <ControlBar />
    </div>
  );
}

export default App;
