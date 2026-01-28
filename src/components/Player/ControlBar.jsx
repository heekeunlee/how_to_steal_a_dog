import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, RefreshCw } from 'lucide-react';
import useBookStore from '../../store/useBookStore';

const ControlBar = () => {
    const {
        isPlaying, togglePlay, nextPage, prevPage,
        playbackSpeed, setPlaybackSpeed, isLooping, toggleLoop
    } = useBookStore();

    return (
        <div className="w-full h-full flex items-center justify-between px-6 bg-white/90 backdrop-blur-md border-t border-stone-200">
            {/* Speed Control */}
            <div className="flex bg-stone-100 rounded-full p-1">
                {[0.8, 1.0, 1.2].map(speed => (
                    <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${playbackSpeed === speed ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
                    >
                        {speed}
                    </button>
                ))}
            </div>

            {/* Main Transport */}
            <div className="flex items-center gap-6">
                <button onClick={prevPage} className="text-stone-400 hover:text-stone-800 transition-colors">
                    <SkipBack size={24} fill="currentColor" />
                </button>

                <button
                    onClick={togglePlay}
                    className="p-4 rounded-full bg-stone-900 text-white shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                    {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                </button>

                <button onClick={nextPage} className="text-stone-400 hover:text-stone-800 transition-colors">
                    <SkipForward size={24} fill="currentColor" />
                </button>
            </div>

            {/* Loop Toggle */}
            <button
                onClick={toggleLoop}
                className={`p-2 rounded-full transition-colors ${isLooping ? 'text-indigo-600 bg-indigo-50' : 'text-stone-400 hover:bg-stone-100'}`}
            >
                <Repeat size={20} />
            </button>
        </div>
    );
};

export default ControlBar;
