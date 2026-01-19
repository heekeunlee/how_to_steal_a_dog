import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, RefreshCw } from 'lucide-react';
import useBookStore from '../../store/useBookStore';

const ControlBar = () => {
    const {
        isPlaying, togglePlay, nextSentence, prevSentence,
        playbackSpeed, setPlaybackSpeed, isLooping, toggleLoop
    } = useBookStore();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="max-w-2xl mx-auto flex flex-col gap-4">

                {/* Progress / Speed / Loop Controls */}
                <div className="flex justify-between items-center text-slate-500">
                    <button
                        onClick={toggleLoop}
                        className={`p-2 rounded-full hover:bg-slate-100 transition-colors ${isLooping ? 'text-blue-500 bg-blue-50' : ''}`}
                    >
                        <Repeat size={20} />
                    </button>

                    <div className="flex bg-slate-100 rounded-lg p-1">
                        {[0.8, 1.0, 1.2].map(speed => (
                            <button
                                key={speed}
                                onClick={() => setPlaybackSpeed(speed)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${playbackSpeed === speed ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {speed}x
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Transport Controls */}
                <div className="flex justify-center items-center gap-8">
                    <button
                        onClick={prevSentence}
                        className="p-4 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                    >
                        <SkipBack size={32} fill="currentColor" />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="p-6 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
                    >
                        {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" title="Play" />}
                    </button>

                    <button
                        onClick={nextSentence}
                        className="p-4 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                    >
                        <SkipForward size={32} fill="currentColor" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ControlBar;
