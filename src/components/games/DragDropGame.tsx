import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DragDropItem, DragDropZone } from '@/types';
import { Trophy, RotateCcw, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DragDropGameProps {
  zones: DragDropZone[];
  items: DragDropItem[];
  onComplete: (score: number, timeSpent: number) => void;
}

export const DragDropGame: React.FC<DragDropGameProps> = ({ zones, items, onComplete }) => {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const unplacedItems = items.filter(item => !placements[item.id]);

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (zoneId: string) => {
    if (draggedItem) {
      setPlacements(prev => ({ ...prev, [draggedItem]: zoneId }));
      setDraggedItem(null);
    }
  };

  const handleRemoveFromZone = (itemId: string) => {
    if (showResults) return; // Don't allow removal after checking
    setPlacements(prev => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
  };

  const getItemsInZone = (zoneId: string) => {
    return items.filter(item => placements[item.id] === zoneId);
  };

  const handleCheck = useCallback(() => {
    setShowResults(true);
    
    const correctCount = items.filter(item => placements[item.id] === item.targetZone).length;
    const allPlaced = Object.keys(placements).length === items.length;
    
    if (allPlaced) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const score = Math.floor((correctCount / items.length) * 100);
      setIsComplete(true);
      onComplete(score, timeSpent);
    }
  }, [items, placements, startTime, onComplete]);

  const resetGame = () => {
    setPlacements({});
    setShowResults(false);
    setIsComplete(false);
    setStartTime(Date.now());
  };

  const isItemCorrect = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item && placements[itemId] === item.targetZone;
  };

  if (isComplete) {
    return (
      <Card className="p-8 text-center animate-scale-in bg-gradient-to-br from-primary-light to-accent/20 max-w-xl mx-auto">
        <Trophy className="h-16 w-16 text-accent mx-auto mb-4 animate-bounce-slow" />
        <h2 className="text-3xl font-bold text-primary mb-2">Відмінно! 🎉</h2>
        <p className="text-xl text-muted-foreground">
          Ви правильно розподілили всі елементи!
        </p>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Badge variant="info">
          Розміщено: {Object.keys(placements).length} з {items.length}
        </Badge>
        <Button variant="outline" size="sm" onClick={resetGame}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Спочатку
        </Button>
      </div>

      {/* Items to drag */}
      <Card className="p-4 mb-6 min-h-[100px]">
        <p className="text-sm text-muted-foreground mb-3">Перетягніть елементи до відповідних зон:</p>
        <div className="flex flex-wrap gap-3">
          {unplacedItems.map(item => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              className={cn(
                "px-4 py-3 bg-primary text-primary-foreground rounded-xl font-bold cursor-grab",
                "hover:shadow-lg hover:-translate-y-1 transition-all duration-200",
                "active:cursor-grabbing"
              )}
            >
              {item.content}
            </div>
          ))}
          {unplacedItems.length === 0 && (
            <p className="text-muted-foreground italic">Всі елементи розміщено!</p>
          )}
        </div>
      </Card>

      {/* Drop zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {zones.map(zone => (
          <Card
            key={zone.id}
            variant="interactive"
            className={cn(
              "p-4 min-h-[150px]",
              draggedItem && "border-primary border-dashed bg-primary/5"
            )}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(zone.id)}
          >
            <h3 className="text-lg font-bold text-primary mb-3">{zone.label}</h3>
            <div className="flex flex-wrap gap-2">
              {getItemsInZone(zone.id).map(item => (
                <div
                  key={item.id}
                  onClick={() => handleRemoveFromZone(item.id)}
                  className={cn(
                    "px-3 py-2 rounded-lg font-bold cursor-pointer transition-all",
                    "hover:shadow-md",
                    showResults 
                      ? isItemCorrect(item.id)
                        ? "bg-game-success text-primary-foreground"
                        : "bg-game-error text-primary-foreground animate-wiggle"
                      : "bg-accent text-accent-foreground"
                  )}
                >
                  {item.content}
                  {showResults && isItemCorrect(item.id) && (
                    <CheckCircle2 className="inline ml-2 h-4 w-4" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {Object.keys(placements).length === items.length && (
        <div className="flex justify-center animate-fade-in">
          <Button size="lg" variant="game" onClick={handleCheck}>
            Перевірити
          </Button>
        </div>
      )}
    </div>
  );
};