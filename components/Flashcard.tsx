
import React from 'react';
import { MenuItem } from '../types';

interface FlashcardProps {
    item: MenuItem;
    onFlip: () => void;
    isFlipped: boolean;
}

export const Flashcard: React.FC<FlashcardProps> = ({ item, onFlip, isFlipped }) => {
    const imageUrl = item.image_url || `https://picsum.photos/seed/${item.id}/400/500`;

    return (
        <div className="w-full h-full perspective-1000" onClick={onFlip}>
            <div 
                className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
            >
                {/* Front of card */}
                <div className="absolute w-full h-full backface-hidden rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white/10 backdrop-blur-lg flex flex-col justify-end p-6 text-white">
                     <img src={imageUrl} alt={item.name} className="absolute top-0 left-0 w-full h-full object-cover -z-10" />
                     <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <h2 className="text-3xl font-bold leading-tight">{item.name}</h2>
                    <p className="text-sm text-white/80 mt-2">Нажмите, чтобы увидеть детали</p>
                </div>

                {/* Back of card */}
                <div className="absolute w-full h-full backface-hidden rounded-3xl shadow-2xl border border-white/20 bg-slate-900/60 backdrop-blur-lg flex flex-col p-6 overflow-y-auto card-back-scroll rotate-y-180">
                    <h2 className="text-2xl font-bold text-cyan-300 mb-3">{item.name}</h2>
                    <p className="text-gray-300 mb-4 text-sm leading-relaxed">{item.description || 'Описание отсутствует.'}</p>
                    
                    {item.key_features?.ingredients && item.key_features.ingredients.length > 0 && (
                        <div className="mb-4">
                            <h3 className="font-semibold text-white mb-2">Состав:</h3>
                            <div className="flex flex-wrap gap-2">
                                {item.key_features.ingredients.map((ing, idx) => (
                                    <span key={idx} className="bg-cyan-500/20 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full">{ing}</span>
                                ))}
                            </div>
                        </div>
                    )}
                     
                    {item.key_features?.allergens && item.key_features.allergens.length > 0 && (
                        <div className="mb-4">
                            <h3 className="font-semibold text-white mb-2">Аллергены:</h3>
                            <div className="flex flex-wrap gap-2">
                                {item.key_features.allergens.map((allergen, idx) => (
                                    <span key={idx} className="bg-amber-500/20 text-amber-300 text-xs font-medium px-2.5 py-1 rounded-full">{allergen}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {item.price && (
                        <div className="mt-auto pt-4 border-t border-white/10">
                            <p className="text-3xl font-bold text-right text-emerald-400">{item.price} ₽</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
   