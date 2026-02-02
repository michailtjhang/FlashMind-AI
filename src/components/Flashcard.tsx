'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateCardMastery } from "@/app/actions/mastery";
import { Check, Clock, Zap } from "lucide-react";

interface FlashcardProps {
    id?: string;
    question: string;
    answer: string;
    index: number;
}

export function Flashcard({ id, question, answer, index }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    function handleFlip() {
        if (!isAnimating && !isUpdating) {
            setIsFlipped(!isFlipped);
            setIsAnimating(true);
        }
    }

    const handleMastery = async (e: React.MouseEvent, level: 'easy' | 'medium' | 'hard') => {
        e.stopPropagation();
        if (!id) return;

        setIsUpdating(true);
        try {
            const result = await updateCardMastery(id, level);
            if (result.success) {
                setIsFlipped(false);
            }
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div
            className="h-[300px] w-full perspective-1000"
            onClick={handleFlip}
        >
            <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                onAnimationComplete={() => setIsAnimating(false)}
                className="w-full h-full relative cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front of Card (Question) */}
                <Card className="absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center p-6 text-center shadow-lg border-2 border-primary/10 bg-white dark:bg-zinc-900 overflow-hidden">
                    <CardContent className="space-y-4">
                        <span className="text-sm font-medium text-blue-500 uppercase tracking-wider">Question {index + 1}</span>
                        <h3 className="text-xl font-semibold leading-relaxed">{question}</h3>
                    </CardContent>
                </Card>

                {/* Back of Card (Answer) */}
                <Card
                    className="absolute inset-0 w-full h-full backface-hidden flex flex-col p-6 text-center shadow-lg border-2 border-green-500/20 bg-green-50 dark:bg-zinc-900 overflow-hidden"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    <CardContent className="flex-1 flex flex-col items-center justify-center space-y-4">
                        <span className="text-sm font-medium text-green-600 uppercase tracking-wider">Answer</span>
                        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">{answer}</p>
                    </CardContent>

                    {id && (
                        <div className="flex gap-2 mt-auto">
                            <Button
                                disabled={isUpdating}
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs px-1 h-9 gap-1 hover:bg-red-50 hover:text-red-600 border-red-200"
                                onClick={(e) => handleMastery(e, 'hard')}
                            >
                                <Clock className="w-3 h-3" /> Hard
                            </Button>
                            <Button
                                disabled={isUpdating}
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs px-1 h-9 gap-1 hover:bg-yellow-50 hover:text-yellow-600 border-yellow-200"
                                onClick={(e) => handleMastery(e, 'medium')}
                            >
                                <Check className="w-3 h-3" /> Med
                            </Button>
                            <Button
                                disabled={isUpdating}
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs px-1 h-9 gap-1 hover:bg-green-100 hover:text-green-700 border-green-200"
                                onClick={(e) => handleMastery(e, 'easy')}
                            >
                                <Zap className="w-3 h-3" /> Easy
                            </Button>
                        </div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
}
