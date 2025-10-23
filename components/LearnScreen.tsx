
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { MenuItem } from '../types';
import { api } from '../services/api';
import { Flashcard } from './Flashcard';

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
    </div>
);

const CompletionScreen: React.FC<{ onRestart: () => void }> = ({ onRestart }) => (
    <div className="p-4 text-center h-screen flex flex-col items-center justify-center">
        <div className="relative p-8 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-lg shadow-2xl text-center">
            <span className="text-6xl">🎉</span>
            <p className="mt-4 text-2xl font-bold text-white">Вы всё изучили!</p>
            <p className="text-gray-300 mt-1">Отличная работа!</p>
            <button 
                onClick={onRestart}
                className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30"
            >
                Начать заново
            </button>
        </div>
    </div>
);

export const LearnScreen: React.FC = () => {
    const [deck, setDeck] = useState<MenuItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [swipeClass, setSwipeClass] = useState('');
    const touchStartPos = useRef<number | null>(null);

    const shuffleDeck = useCallback(<T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }, []);

    const fetchAndSetDeck = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const items = await api.getMenuItems();
            setDeck(shuffleDeck(items));
        } catch (err) {
            setError('Не удалось загрузить меню. Попробуйте обновить страницу.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [shuffleDeck]);

    useEffect(() => {
        fetchAndSetDeck();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentItem = useMemo(() => deck[currentIndex], [deck, currentIndex]);

    const handleSwipe = useCallback((action: 'know' | 'repeat') => {
        if (!currentItem || swipeClass) return;

        setIsFlipped(false);
        
        setSwipeClass(action === 'know' ? 'animate-slide-out-right' : 'animate-slide-out-left');
        
        setTimeout(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1));
            setSwipeClass('');
        }, 400); // Match animation duration
    }, [currentItem, swipeClass]);

    const handleRestart = () => {
        setDeck(shuffleDeck(deck));
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartPos.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartPos.current === null) return;
        
        const touchEndPos = e.changedTouches[0].clientX;
        const deltaX = touchEndPos - touchStartPos.current;
        const swipeThreshold = 50; // Minimum distance for a swipe

        if (Math.abs(deltaX) > swipeThreshold) {
            if (deltaX > 0) { // Swiped right
                handleSwipe('know');
            } else { // Swiped left
                handleSwipe('repeat');
            }
        }
        
        touchStartPos.current = null;
    };
    
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen text-center p-4">
                <p className="text-rose-400">{error}</p>
            </div>
        );
    }

    if (!currentItem) {
        return <CompletionScreen onRestart={handleRestart} />;
    }

    return (
        <div className="pb-20 flex flex-col h-screen overflow-hidden items-center justify-center">
            <h1 className="text-3xl font-bold text-white mb-4 text-center opacity-80">Режим "Учить"</h1>
            <div className="flex-grow flex flex-col items-center justify-center relative w-full px-4">
                <div 
                    className={`w-full max-w-sm h-[500px] mb-6 transition-all duration-300 ${swipeClass}`}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {currentItem && <Flashcard item={currentItem} onFlip={() => setIsFlipped(!isFlipped)} isFlipped={isFlipped} />}
                </div>
                
                <div className="flex justify-around w-full max-w-sm">
                    <button 
                        onClick={() => handleSwipe('repeat')}
                        className="bg-rose-500/90 hover:bg-rose-500 text-white font-bold py-4 px-6 rounded-full shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 transition-transform transform hover:scale-110"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        Повторить
                    </button>
                    <button 
                        onClick={() => handleSwipe('know')}
                        className="bg-emerald-500/90 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-transform transform hover:scale-110"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        Знаю
                    </button>
                </div>
            </div>
            <div className="text-center text-gray-400 mt-4">
                Карточка {Math.min(currentIndex + 1, deck.length)} из {deck.length}
            </div>
        </div>
    );
};
   