import React, { useState } from 'react';
import { Info } from 'lucide-react';

const SentenceCard = ({ sentence, fontSize = 'text-2xl' }) => {
    const [activeNote, setActiveNote] = useState(null);

    // Helper to highlight parts of the text
    // This is a simple implementation. For complex overlapping highlights, would need better parsing.
    // We'll check if any note target is in the text.

    // Strategy: Split text by note targets to insert interactive elements.
    // For simplicity, we will just render the plain text for now, but overlay interactive hints?
    // OR: We just show the notes below text.
    // Let's try to highlight. regex replace.

    // Actually, let's keep it simple first: Show text, and show notes below as pills.
    // IF user requested "Highlight feature", we can refine.
    // "Interactive Text: 모르는 단어나 숙어(밑줄 표시)를 위로 탭하면 뜻이 팝업됩니다."

    // Let's try to find the note.text inside sentence.text and wrap it.
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
                {parts.map((part, idx) => (
                    part.isNote ? (
                        <span
                            key={idx}
                            className="relative inline-block border-b-2 border-amber-400 cursor-pointer group"
                            onClick={() => setActiveNote(activeNote === part.note ? null : part.note)}
                        >
                            {part.text}
                            {/* Tooltip */}
                            <span className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-800 text-white text-sm rounded-lg shadow-lg whitespace-nowrap transition-opacity z-10 ${activeNote === part.note ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                {part.note.meaning}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                            </span>
                        </span>
                    ) : (
                        <span key={idx}>{part.text}</span>
                    )
                ))}
            </p>
        );
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-slate-100 min-h-[300px] flex flex-col justify-center items-center text-center space-y-6">
            {renderText()}

            {/* Translation (Optional, hidden by default or shown?) - Let's show on toggle or always for now? 
          User said "짚어주면서 강독". Maybe show translation below in gray.
      */}
            <p className="text-slate-500 font-medium text-lg mt-4 border-t border-slate-100 pt-4 w-full">
                {sentence.translation}
            </p>
        </div>
    );
};

export default SentenceCard;
