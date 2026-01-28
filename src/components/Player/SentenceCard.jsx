import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, HelpCircle } from 'lucide-react';
import useBookStore from '../../store/useBookStore';

export const SentenceText = ({ sentence, fontSize = 'text-2xl', isBeingRead = false, charIndex = -1 }) => {
    const [activeNote, setActiveNote] = useState(null);
    const { isQuizMode } = useBookStore();

    // Reset local state when sentence changes
    useEffect(() => {
        setActiveNote(null);
    }, [sentence]);

    // Parse parts and calculate ranges once
    const partsWithRanges = React.useMemo(() => {
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

        // Assign character ranges
        let crawler = 0;
        return parts.map(part => {
            const start = crawler;
            const end = crawler + part.text.length;
            crawler = end;
            return { ...part, start, end };
        });
    }, [sentence]);

    // Auto-reveal note logic
    useEffect(() => {
        if (isBeingRead && charIndex >= 0) {
            const activePart = partsWithRanges.find(p => charIndex >= p.start && charIndex < p.end);
            if (activePart && activePart.isNote) {
                setActiveNote(activePart.note);
            } else {
                // Optional: close note when moving off it? Or keep open?
                // "Show Korean annotations in the middle" -> implies transient or persistent.
                // Let's hide it if we moved off it, to keep it clean 'cursor' style.
                setActiveNote(null);
            }
        } else {
            setActiveNote(null);
        }
    }, [charIndex, isBeingRead, partsWithRanges]);


    return (
        <p className={`font-serif leading-[2.2] ${fontSize} text-stone-800 text-left transition-opacity duration-300 ${isBeingRead ? 'opacity-100' : 'opacity-80'}`}>
            {partsWithRanges.map((part, idx) => {
                // Check if this part is currently being spoken
                const isCurrent = isBeingRead && charIndex >= part.start && charIndex < part.end;

                if (part.isNote) {
                    const isRevealed = activeNote === part.note;
                    const displayText = isQuizMode && !isRevealed ? "________" : part.text;
                    const styleClass = isQuizMode && !isRevealed
                        ? "bg-stone-200 text-transparent rounded-md px-1 select-none animate-pulse cursor-pointer"
                        : `rounded-lg px-2 py-1 mx-0.5 cursor-pointer transition-all duration-200 decoration-clone box-decoration-clone ${isRevealed
                            ? 'bg-[var(--color-highlight-purple)] text-white shadow-md ring-2 ring-purple-200 transform scale-105'
                            : (isCurrent ? 'bg-amber-200 ring-2 ring-amber-400' : 'bg-[var(--color-highlight-orange)]/60 hover:bg-[var(--color-highlight-orange)] text-stone-900')
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
                            {isRevealed && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 animate-in zoom-in-50 duration-200 origin-bottom">
                                    <div className="bg-purple-600 text-white text-sm md:text-base px-4 py-3 rounded-2xl shadow-xl whitespace-nowrap min-w-[120px] text-center">
                                        {isQuizMode && <div className="font-bold text-purple-200 text-xs mb-1 uppercase tracking-wide">Answer</div>}
                                        <div className="font-medium leading-tight">{part.note.meaning}</div>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-purple-600"></div>
                                    </div>
                                </div>
                            )}
                        </span>
                    );
                } else {
                    // Plain text: Highlight if current?
                    // "Cursor moves" -> Highlight current word part?
                    return (
                        <span key={idx} className={`${isCurrent ? 'bg-yellow-200/50 rounded-sm' : ''}`}>
                            {part.text}
                        </span>
                    );
                }
            })}
        </p>
    );
};

export const SentenceTranslation = ({ sentence }) => {
    const [showTranslation, setShowTranslation] = useState(false);

    useEffect(() => {
        setShowTranslation(false);
    }, [sentence]);

    return (
        <div
            onClick={() => setShowTranslation(!showTranslation)}
            className={`w-full p-4 rounded-xl transition-all cursor-pointer select-none border border-stone-100 ${showTranslation ? 'bg-white shadow-sm' : 'bg-transparent hover:bg-black/5'}`}
        >
            {showTranslation ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <p className="text-stone-600 font-sans font-medium text-lg leading-relaxed text-center">
                        {sentence.translation}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-2 text-xs text-stone-400 font-sans uppercase tracking-wider">
                        <EyeOff size={14} /> Tap to hide
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2 py-1">
                    <div className="h-3 w-3/4 bg-stone-200 rounded-full blur-[2px] opacity-40"></div>
                    <div className="h-3 w-1/2 bg-stone-200 rounded-full blur-[2px] opacity-40"></div>
                    <p className="text-stone-400 text-xs font-sans font-medium flex items-center gap-2 mt-1">
                        <Eye size={14} /> Tap to see
                    </p>
                </div>
            )}
        </div>
    );
};
