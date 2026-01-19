import { create } from 'zustand';
import chapter1Data from '../data/chapter1.json';

const useBookStore = create((set, get) => ({
  // Data
  bookTitle: chapter1Data.bookTitle,
  currentChapter: chapter1Data,
  
  // Playback State
  currentIndex: 0,
  isPlaying: false,
  playbackSpeed: 1.0,
  isLooping: false,
  
  // Actions
  setSentenceIndex: (index) => {
    const { currentChapter } = get();
    if (index >= 0 && index < currentChapter.sentences.length) {
      set({ currentIndex: index, isPlaying: true }); // Auto-play on switch?
    }
  },
  
  nextSentence: () => {
    const { currentIndex, currentChapter } = get();
    if (currentIndex < currentChapter.sentences.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },
  
  prevSentence: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  
  toggleLoop: () => set((state) => ({ isLooping: !state.isLooping })),
}));

export default useBookStore;
