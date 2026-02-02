'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flashcard } from "@/components/Flashcard";
import { generateFlashcards } from "@/app/actions/generate"; // We will create this next
import { Loader2, Sparkles } from "lucide-react";

export default function ClientDashboard() {
    const [text, setText] = useState("");
    const [flashcards, setFlashcards] = useState<Array<{ question: string, answer: string }>>([]);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!text.trim()) return;

        setLoading(true);
        try {
            const result = await generateFlashcards(text);
            if (result.success && result.data) {
                setFlashcards(result.data);
            } else {
                console.error("Failed to generate", result.error);
                alert("Failed to generate flashcards. Please try again.");
            }
        } catch (e) {
            console.error(e);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-center">🎉 Flashcard Generator</h1>

            <div className="space-y-4 mb-12">
                <label className="text-sm font-medium text-gray-500">Paste your study material here:</label>
                <Textarea
                    placeholder="Paste article, notes, or topic here..."
                    className="min-h-[200px] text-lg p-4 resize-y"
                    value={text}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                />
                <Button
                    size="lg"
                    className="w-full h-14 text-lg gap-2 bg-blue-600 hover:bg-blue-700"
                    onClick={handleGenerate}
                    disabled={loading || !text.trim()}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" /> Generate Flashcards
                        </>
                    )}
                </Button>
            </div>

            {flashcards.length > 0 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Your Flashcards</h2>
                        <span className="text-sm text-gray-500">{flashcards.length} generated</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {flashcards.map((card, idx) => (
                            <Flashcard key={idx} index={idx} question={card.question} answer={card.answer} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
