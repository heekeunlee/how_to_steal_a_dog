import { useState, useEffect, useRef, useCallback } from 'react';

export const useTTS = ({ onEnd, onBoundary }) => {
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const synth = useRef(window.speechSynthesis);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = synth.current.getVoices();
            setVoices(availableVoices);
            // Prefer Google US English or standard English
            const usVoice = availableVoices.find(
                (v) => v.name.includes('Google US English') || v.lang === 'en-US'
            );
            setSelectedVoice(usVoice || availableVoices[0]);
        };

        loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const speak = useCallback((text, speed = 1.0) => {
        if (synth.current.speaking) {
            synth.current.cancel();
        }

        if (!text) return;

        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        utterance.rate = speed;

        utterance.onend = () => {
            if (onEnd) onEnd();
        };

        if (onBoundary) {
            utterance.onboundary = (event) => {
                onBoundary(event);
            };
        }

        synth.current.speak(utterance);
    }, [selectedVoice, onEnd, onBoundary]);

    const cancel = useCallback(() => {
        synth.current.cancel();
    }, []);

    return { speak, cancel, voices, selectedVoice, setSelectedVoice };
};
