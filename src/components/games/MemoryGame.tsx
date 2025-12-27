import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MatchingPair } from '@/types';
import { RotateCcw, Trophy } from 'lucide-react';

interface MemoryGameProps {
  pairs: MatchingPair[];
  onComplete: (score: number, timeSpent: number) => void;
}

interface CardData {
  id: string;
  content: string;
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ pairs, onComplete }) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);

  // Initialize cards
  useEffect(() => {
    const allCards: CardData[] = [];
    pairs.forEach((pair) => {
      allCards.push(
        { id: `${pair.id}-left`, content: pair.left, pairId: pair.id, isFlipped: false, isMatched: false },
        { id: `${pair.id}-right`, content: pair.right, pairId: pair.id, isFlipped: false, isMatched: false }
      );
    });
    // Shuffle
    const shuffled = allCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, [pairs]);

  const handleCardClick = useCallback((cardId: string) => {
    if (flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isMatched || flippedCards.includes(cardId)) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      const card1 = cards.find(c => c.id === first);
      const card2 = cards.find(c => c.id === second);

      if (card1 && card2 && card1.pairId === card2.pairId) {
        // Match found!
        setTimeout(() => {
          setMatchedPairs(prev => [...prev, card1.pairId]);
          setCards(prev => prev.map(c => 
            c.pairId === card1.pairId ? { ...c, isMatched: true } : c
          ));
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  // Check completion
  useEffect(() => {
    if (matchedPairs.length === pairs.length && pairs.length > 0 && !isComplete) {
      setIsComplete(true);
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const maxScore = 100;
      const minMoves = pairs.length;
      const score = Math.max(0, Math.floor(maxScore * (minMoves / moves)));
      onComplete(score, timeSpent);
    }
  }, [matchedPairs.length, pairs.length, moves, startTime, onComplete, isComplete]);

  const resetGame = () => {
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setIsComplete(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled.map(c => ({ ...c, isMatched: false })));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 text-lg font-bold">
          <span className="text-primary">Ходи: {moves}</span>
          <span className="text-accent">Пари: {matchedPairs.length}/{pairs.length}</span>
        </div>
        <Button variant="outline" size="sm" onClick={resetGame}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Спочатку
        </Button>
      </div>

      {isComplete ? (
        <Card className="p-8 text-center animate-scale-in bg-gradient-to-br from-primary-light to-accent/20">
          <Trophy className="h-16 w-16 text-accent mx-auto mb-4 animate-bounce-slow" />
          <h2 className="text-3xl font-bold text-primary mb-2">Чудово! 🎉</h2>
          <p className="text-lg text-muted-foreground">
            Ви знайшли всі пари за {moves} ходів!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={cn(
                "aspect-square cursor-pointer perspective-1000",
                card.isMatched && "pointer-events-none"
              )}
            >
              <div
                className={cn(
                  "relative w-full h-full transition-transform duration-500 transform-style-preserve-3d",
                  (flippedCards.includes(card.id) || card.isMatched) && "rotate-y-180"
                )}
              >
                {/* Back of card */}
                <Card
                  variant="interactive"
                  className={cn(
                    "absolute inset-0 flex items-center justify-center backface-hidden",
                    "bg-gradient-to-br from-primary to-primary/80 border-primary"
                  )}
                >
                  <span className="text-4xl">❓</span>
                </Card>
                {/* Front of card */}
                <Card
                  className={cn(
                    "absolute inset-0 flex items-center justify-center backface-hidden rotate-y-180",
                    card.isMatched 
                      ? "bg-game-success/20 border-game-success" 
                      : "bg-card border-accent"
                  )}
                >
                  <span className="text-xl md:text-2xl font-bold text-center p-2">
                    {card.content}
                  </span>
                </Card>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};
