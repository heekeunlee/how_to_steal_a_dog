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
            <p className={`font-serif leading-[2.2] ${fontSize} text-stone-800 text-left`}>
                {parts.map((part, idx) => {
                    if (part.isNote) {
                        const isRevealed = activeNote === part.note;
                        // In Quiz Mode, text is hidden until revealed.
                        // In Normal Mode, text is visible, "Highlighter" style indicates interactive.

                        const displayText = isQuizMode && !isRevealed
                            ? "________" // Placeholder
                            : part.text;

                        const styleClass = isQuizMode && !isRevealed
                            ? "bg-stone-200 text-transparent rounded-md px-1 select-none animate-pulse cursor-pointer"
                            : `rounded-lg px-2 py-1 mx-0.5 cursor-pointer transition-all duration-200 decoration-clone box-decoration-clone ${isRevealed
                                ? 'bg-[var(--color-highlight-purple)] text-white shadow-sm ring-2 ring-purple-200'
                                : 'bg-[var(--color-highlight-orange)]/60 hover:bg-[var(--color-highlight-orange)] text-stone-900'
                            }`;

                        return (
                            <span
                                key={idx}
                                className={`relative inline-block ${styleClass}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveNote(isRevealed ? null : part.note);
                                }}
                            >
                                {displayText}

                                {/* Pop-up Note (Tooltip) */}
                                {isRevealed && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 animate-in zoom-in-50 duration-200 origin-bottom">
                                        <div className="bg-purple-600 text-white text-sm md:text-base px-4 py-3 rounded-2xl shadow-xl whitespace-nowrap min-w-[120px] text-center">
                                            {isQuizMode && <div className="font-bold text-purple-200 text-xs mb-1 uppercase tracking-wide">Answer</div>}
                                            <div className="font-medium leading-tight">{part.note.meaning}</div>

                                            {/* Arrow */}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-purple-600"></div>
                                        </div>
                                    </div>
                                )}
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
        <div className="w-full relative">
            {/* Quiz Mode Badge moved to App level or kept minimal here if needed, but removing big card wrapper */}

            {renderText()}

            {/* Hidden Translation */}
            <div
                onClick={() => setShowTranslation(!showTranslation)}
                className={`w-full mt-12 p-6 rounded-2xl transition-all cursor-pointer select-none border border-stone-100 ${showTranslation ? 'bg-white shadow-sm' : 'bg-transparent hover:bg-black/5'}`}
            >
                {showTranslation ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <p className="text-stone-600 font-sans font-medium text-lg leading-relaxed text-center">
                            {sentence.translation}
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-stone-400 font-sans uppercase tracking-wider">
                            <EyeOff size={14} /> Tap to hide
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3 py-2">
                        {/* Fake "blurred" lines to hint at content */}
                        <div className="h-4 w-3/4 bg-stone-200 rounded-full blur-[2px] opacity-40"></div>
                        <div className="h-4 w-1/2 bg-stone-200 rounded-full blur-[2px] opacity-40"></div>

                        <p className="text-stone-400 text-sm font-sans font-medium flex items-center gap-2 mt-2">
                            <Eye size={16} /> Tap to see translation
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SentenceCard;
