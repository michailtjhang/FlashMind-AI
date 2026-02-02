'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";

interface FlashcardProps {
    question: string;
    answer: string;
    index: number;
}

export function Flashcard({ question, answer, index }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    function handleFlip() {
        if (!isAnimating) {
            setIsFlipped(!isFlipped);
            setIsAnimating(true);
        }
    }

    return (
        <div
            className="h-[300px] w-full cursor-pointer perspective-1000"
            onClick={handleFlip}
        >
            <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                onAnimationComplete={() => setIsAnimating(false)}
                className="w-full h-full relative preserve-3d"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front of Card (Question) */}
                <Card className="absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center p-6 text-center shadow-lg border-2 border-primary/10 bg-white dark:bg-zinc-900">
                    <CardContent className="space-y-4">
                        <span className="text-sm font-medium text-blue-500 uppercase tracking-wider">Question {index + 1}</span>
                        <h3 className="text-xl font-semibold leading-relaxed">{question}</h3>
                    </CardContent>
                </Card>

                {/* Back of Card (Answer) */}
                <Card
                    className="absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center p-6 text-center shadow-lg border-2 border-green-500/20 bg-green-50 dark:bg-zinc-900"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    <CardContent className="space-y-4">
                        <span className="text-sm font-medium text-green-600 uppercase tracking-wider">Answer</span>
                        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">{answer}</p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
