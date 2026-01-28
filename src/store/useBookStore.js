import { create } from 'zustand';
import chapter1Data from '../data/chapter1.json';

const useBookStore = create((set, get) => ({
  // Data
  bookTitle: chapter1Data.bookTitle,
  currentChapter: chapter1Data,

  // Playback State
  currentIndex: 0, // Actually this acts as "page start index" now
  itemsPerPage: 3,
  isPlaying: false,
  playbackSpeed: 1.0,
  isLooping: false,
  isQuizMode: false,
  stars: 0,
  hasStarted: false,

  // Actions
  startReading: () => set({ hasStarted: true }),
  addStar: () => set((state) => ({ stars: state.stars + 1 })),
  toggleQuizMode: () => set((state) => ({ isQuizMode: !state.isQuizMode })),

  // Set index safely ensuring it aligns with page start? 
  // For simplicity, we just set it. The view will slice from here.
  setSentenceIndex: (index) => {
    const { currentChapter } = get();
    if (index >= 0 && index < currentChapter.sentences.length) {
      set({ currentIndex: index, isPlaying: true });
    }
  },

  nextPage: () => {
    const { currentIndex, currentChapter, itemsPerPage } = get();
    // Only proceed if there are more sentences after the current page
    if (currentIndex + itemsPerPage < currentChapter.sentences.length) {
      set({ currentIndex: currentIndex + itemsPerPage, isPlaying: false }); // Stop playing when turning page
    }
  },

  prevPage: () => {
    const { currentIndex, itemsPerPage } = get();
    if (currentIndex - itemsPerPage >= 0) {
      set({ currentIndex: currentIndex - itemsPerPage, isPlaying: false });
    } else if (currentIndex > 0) {
      // If less than one page remaining at start, go to 0
      set({ currentIndex: 0, isPlaying: false });
    }
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  toggleLoop: () => set((state) => ({ isLooping: !state.isLooping })),
}));

export default useBookStore;
