import React, { useEffect, useRef } from 'react';
import useBookStore from './store/useBookStore';
import { useTTS } from './hooks/useTTS';
import SentenceCard from './components/Player/SentenceCard';
import ControlBar from './components/Player/ControlBar';
import { BookOpen } from 'lucide-react';

function App() {
  const {
    currentChapter,
    currentIndex,
    isPlaying,
    togglePlay,
    nextSentence,
    playbackSpeed,
    isLooping
  } = useBookStore();

  const currentSentence = currentChapter.sentences[currentIndex];

  // Logic to handle auto-progression
  const handleEnd = () => {
    if (isLooping) {
      // Loop current: The effect will re-trigger because specific dependency logic or manual re-call
      // Actually, if currentIndex doesn't change, effect won't re-run automatically if deps are stable.
      // We need to trigger speak again manually? 
      // OR: toggle isPlaying off/on? No.
      // Easiest: Just call speak again.
      speak(currentSentence.text, playbackSpeed);
    } else {
      // Auto-advance
      if (currentIndex < currentChapter.sentences.length - 1) {
        nextSentence();
      } else {
        if (isPlaying) togglePlay(); // Stop if at end
      }
    }
  };

  const { speak, cancel } = useTTS({ onEnd: handleEnd });

  // Sync TTS with Store State
  useEffect(() => {
    if (isPlaying) {
      speak(currentSentence.text, playbackSpeed);
    } else {
      cancel();
    }
    // Cleanup on unmount
    return () => cancel();
  }, [currentIndex, isPlaying, playbackSpeed, currentSentence.text]); // specific deps

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-32">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700">
            <BookOpen size={24} />
            <h1 className="font-bold text-lg tracking-tight">Ten Min Eng: {currentChapter.bookTitle}</h1>
          </div>
          <span className="text-sm font-medium text-slate-500">
            {currentIndex + 1} / {currentChapter.sentences.length}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center p-6 w-full max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-semibold text-slate-800 mb-1">{currentChapter.chapterTitle}</h2>
          <p className="text-slate-500 text-sm">Tap on underlined words for meaning</p>
        </div>

        <SentenceCard sentence={currentSentence} />
      </main>

      {/* Control Bar */}
      <ControlBar />
    </div>
  );
}

export default App;
