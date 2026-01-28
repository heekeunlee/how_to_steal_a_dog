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
    <div className="fixed inset-0 bg-slate-900 flex flex-col font-sans overflow-hidden">

      {/* Background / Hero Section */}
      <div className="relative h-[45vh] w-full shrink-0">
        <div className="absolute inset-0">
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
        </div>

        {/* Top Navbar Area (Transparent) */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10 safe-top">
          {/* Back Button (Mock) */}
          <button className="text-white/90 p-2 hover:bg-white/10 rounded-full">
            <BookOpen size={24} />
          </button>

          {/* Star/Points Counter */}
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
            <Star size={16} className="text-amber-400 fill-amber-400" />
            <span className="text-white font-bold text-sm tabular-nums">{stars}</span>
          </div>
        </div>

        {/* Title Area (Centered in Hero) */}
        <div className="absolute bottom-16 left-0 right-0 text-center px-6 z-10">
          {/* Logo / Title Style */}
          <h1 className="text-white text-4xl font-serif font-bold tracking-tight mb-1 drop-shadow-md">
            DUNE
          </h1>
          <p className="text-white/80 text-sm font-medium tracking-wide">Frank Herbert</p>
        </div>
      </div>

      {/* Bottom Sheet / Content Area */}
      <div className="flex-1 bg-[var(--color-paper)] relative -mt-8 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-20 flex flex-col overflow-hidden isolate">

        {/* Sheet Handle / Decor */}
        <div className="w-full h-8 flex justify-center items-center shrink-0">
          <div className="w-12 h-1 bg-stone-300 rounded-full opacity-50"></div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-32 no-scrollbar scroll-smooth">
          <div className="max-w-md mx-auto">
            {/* Chapter Header */}
            <div className="text-center mb-8">
              <h2 className="text-stone-800 font-bold text-lg mb-1">
                하루에 단 10분만 투자하여 좋아하는<br />책으로 영어를 정복하세요
              </h2>
            </div>

            <SentenceCard sentence={currentSentence} />

            {/* Quiz Toggle */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={toggleQuizMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${isQuizMode
                  ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
              >
                <BrainCircuit size={16} />
                {isQuizMode ? 'Quiz Active' : 'Quiz Mode'}
              </button>
            </div>
          </div>
        </div>

        {/* Control Bar (Floating) */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
          <ControlBar />
        </div>
      </div>
    </div>
  );
}

export default App;
