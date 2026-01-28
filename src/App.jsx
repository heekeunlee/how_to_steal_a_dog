import React, { useEffect, useState, useCallback } from 'react';
import useBookStore from './store/useBookStore';
import { useTTS } from './hooks/useTTS';
import { SentenceText, SentenceTranslation } from './components/Player/SentenceCard';
import ControlBar from './components/Player/ControlBar';
import { BookOpen, Star, BrainCircuit, PlayCircle } from 'lucide-react';
import coverImage from './assets/cover.jpg';

function App() {
  const {
    currentChapter,
    currentIndex,
    isPlaying,
    itemsPerPage,
    togglePlay,
    playbackSpeed,
    isLooping,
    stars,
    addStar,
    isQuizMode,
    toggleQuizMode,
    hasStarted,
    startReading
  } = useBookStore();

  // Local state to track which sentence on the current page is being read
  // 0, 1, 2 ... relative to the page
  const [speakingOffset, setSpeakingOffset] = useState(0);

  // Track character index for current sentence (cursor)
  const [charIndex, setCharIndex] = useState(-1);

  // Get current page sentences
  const visibleSentences = currentChapter.sentences.slice(currentIndex, currentIndex + itemsPerPage);

  // Reset speaking offset when page changes
  useEffect(() => {
    setSpeakingOffset(0);
    setCharIndex(-1);
  }, [currentIndex]);


  const handleEnd = useCallback(() => {
    addStar();
    setCharIndex(-1);

    // If we have more sentences on this page to read
    setSpeakingOffset(prev => {
      // Access latest vsibileSentences here? No, useCallback dependencies will handle it.
      // Actually since visibleSentences changes on Page change, we need to be careful.
      // But visibleSentences is constant for the duration of the page read unless we switch pages.
      if (prev < visibleSentences.length - 1) {
        return prev + 1;
      } else {
        // Finished the page
        if (isLooping) {
          return 0; // Restart page
        } else {
          // Stop playing at end of page.
          // We can't togglePlay inside setter easily if it depends on external state,
          // so we can use an effect or just call togglePlay here if we add it to dep.
          return 0; // Will stop effectively via effect logic or we must explicit stop?
        }
      }
    });

    // Check if we need to stop playing (last sentence)
    if (speakingOffset >= visibleSentences.length - 1 && !isLooping) {
      if (isPlaying) togglePlay();
    }
  }, [visibleSentences.length, isLooping, isPlaying, speakingOffset, addStar, togglePlay]);

  const handleBoundary = useCallback((event) => {
    // event.charIndex is the character index in the string being spoken
    setCharIndex(event.charIndex);
  }, []);

  const { speak, cancel } = useTTS({ onEnd: handleEnd, onBoundary: handleBoundary });

  // Sync TTS
  useEffect(() => {
    if (hasStarted && isPlaying) {
      const sentenceToRead = visibleSentences[speakingOffset];
      if (sentenceToRead) {
        speak(sentenceToRead.text, playbackSpeed);
      }
    } else {
      cancel();
      setCharIndex(-1);
    }
    return () => {
      cancel();
    };
  }, [speakingOffset, isPlaying, playbackSpeed, hasStarted, visibleSentences, speak]);


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
            <p className="text-slate-400 text-xs mt-2">Chapter 1 • {currentChapter.sentences.length} Sentences</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col font-sans overflow-hidden">

      {/* Background / Hero Section */}
      <div className="relative h-[25vh] w-full shrink-0">
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
        <div className="absolute bottom-12 left-0 right-0 text-center px-6 z-10">
          {/* Logo / Title Style */}
          <h1 className="text-white text-2xl font-serif font-bold tracking-tight mb-1 drop-shadow-md leading-tight">
            How to Steal a Dog
          </h1>
          <p className="text-white/80 text-xs font-medium tracking-wide">Barbara O'Connor</p>
        </div>
      </div>

      {/* Bottom Sheet / Content Area */}
      <div className="flex-1 bg-[var(--color-paper)] relative -mt-8 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-20 flex flex-col overflow-hidden isolate">

        {/* Sheet Handle / Decor */}
        <div className="w-full h-8 flex justify-center items-center shrink-0">
          <div className="w-12 h-1 bg-stone-300 rounded-full opacity-50"></div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-40 no-scrollbar scroll-smooth">
          <div className="max-w-md mx-auto space-y-10">

            {/* Chapter Header */}
            <div className="text-center mb-4">
              <h2 className="text-stone-400 text-xs font-bold uppercase tracking-widest">
                {currentChapter.chapterTitle}
              </h2>
            </div>

            {/* English Sentences Group */}
            <div className="space-y-6">
              {visibleSentences.map((sentence, idx) => {
                const isBeingRead = isPlaying && speakingOffset === idx;
                // Pass current charIndex ONLY to the active sentence
                const activeCharIndex = isBeingRead ? charIndex : -1;

                return (
                  <SentenceText
                    key={`text-${sentence.id}`}
                    sentence={sentence}
                    fontSize="text-xl"
                    isBeingRead={isBeingRead}
                    charIndex={activeCharIndex}
                  />
                )
              })}
            </div>

            {/* Horizontal Line Separator */}
            <div className="border-t border-stone-200 mt-8 pt-8 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-paper)] px-2 text-stone-300 text-xs font-serif italic">
                Translations
              </div>
            </div>

            {/* Korean Translations Group */}
            <div className="space-y-4">
              {visibleSentences.map((sentence) => (
                <SentenceTranslation
                  key={`trans-${sentence.id}`}
                  sentence={sentence}
                />
              ))}
            </div>

            {/* Quiz Toggle */}
            <div className="flex justify-center pt-8">
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
