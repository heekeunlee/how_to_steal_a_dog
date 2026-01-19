import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, HelpCircle } from 'lucide-react';
import useBookStore from '../../store/useBookStore';

const SentenceCard = ({ sentence, fontSize = 'text-2xl' }) => {
    const [activeNote, setActiveNote] = useState(null);
    const [showTranslation, setShowTranslation] = useState(false);
    const { isQuizMode } = useBookStore();

    // Reset local state when sentence changes
    useEffect(() => {
        setActiveNote(null);
        setShowTranslation(false);
    }, [sentence]);

    const renderText = () => {
        let parts = [{ text: sentence.text, isNote: false }];

        sentence.notes.forEach(note => {
            const newParts = [];
            parts.forEach(part => {
                if (part.isNote) {
                    newParts.push(part);
                    return;
                }

                const index = part.text.indexOf(note.text);
                if (index === -1) {
                    newParts.push(part);
                } else {
                    // Split
                    const before = part.text.substring(0, index);
                    const match = part.text.substring(index, index + note.text.length);
                    const after = part.text.substring(index + note.text.length);

                    if (before) newParts.push({ text: before, isNote: false });
                    newParts.push({ text: match, isNote: true, note: note });
                    if (after) newParts.push({ text: after, isNote: false });
                }
            });
            parts = newParts;
        });

        return (
            <p className={`font-serif leading-relaxed ${fontSize} text-slate-800`}>
                {parts.map((part, idx) => {
                    if (part.isNote) {
                        const isRevealed = activeNote === part.note;
                        // In Quiz Mode, text is hidden until revealed.
                        // In Normal Mode, text is visible, underline indicates interactive.

                        const displayText = isQuizMode && !isRevealed
                            ? "_".repeat(Math.max(5, part.text.length))
                            : part.text;

                        const styleClass = isQuizMode && !isRevealed
                            ? "bg-amber-100 text-amber-800 rounded px-1 border-b-2 border-amber-400 font-bold tracking-widest cursor-pointer hover:bg-amber-200"
                            : "relative inline-block border-b-2 border-amber-400 cursor-pointer hover:bg-amber-50 rounded px-0.5";

                        return (
                            <span
                                key={idx}
                                className={`${styleClass} transition-colors mx-1`}
                                onClick={() => setActiveNote(isRevealed ? null : part.note)}
                            >
                                {displayText}

                                {/* Tooltip / Answer Reveal */}
                                <span className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-xl whitespace-nowrap transition-all z-20 ${isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                    <div className="flex flex-col items-center gap-1">
                                        {isQuizMode && <span className="font-bold text-amber-300 text-lg mb-1">{part.note.text}</span>}
                                        <span>{part.note.meaning}</span>
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                                </span>
                            </span>
                        );
                    } else {
                        return <span key={idx}>{part.text}</span>;
                    }
                })}
            </p>
        );
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 min-h-[360px] flex flex-col justify-center items-center text-center space-y-8 relative overflow-hidden">

            {/* Quiz Mode Badge */}
            {isQuizMode && (
                <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <HelpCircle size={14} />
                    Quiz Mode
                </div>
            )}

            {renderText()}

            {/* Hidden Translation */}
            <div
                onClick={() => setShowTranslation(!showTranslation)}
                className={`w-full p-4 rounded-xl transition-all cursor-pointer group select-none ${showTranslation ? 'bg-slate-50' : 'bg-slate-50 hover:bg-slate-100'}`}
            >
                {showTranslation ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <p className="text-slate-600 font-medium text-lg leading-relaxed">
                            {sentence.translation}
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-400">
                            <EyeOff size={14} /> Tap to hide
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 py-2">
                        <div className="h-6 w-3/4 bg-slate-200 rounded-full blur-[2px] opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                            <Eye size={16} /> Tap to see translation
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SentenceCard;
