'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Flashcard } from "@/components/Flashcard";
import { generateFlashcards } from "@/app/actions/generate";
import { generateDistractors } from "@/app/actions/quiz";
import { Loader2, Sparkles, Brain, Trophy, X } from "lucide-react";

export default function ClientDashboard() {
    const [text, setText] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [flashcards, setFlashcards] = useState<Array<{ id: string, question: string, answer: string }>>([]);
    const [loading, setLoading] = useState(false);

    // Quiz State
    const [isQuizMode, setIsQuizMode] = useState(false);
    const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
    const [quizOptions, setQuizOptions] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [quizLoading, setQuizLoading] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);

    const startQuiz = async () => {
        if (flashcards.length === 0) return;
        setIsQuizMode(true);
        setCurrentQuizIdx(0);
        setScore(0);
        setQuizFinished(false);
        await prepareQuestion(0);
    };

    const prepareQuestion = async (idx: number) => {
        setQuizLoading(true);
        const card = flashcards[idx];
        const res = await generateDistractors(card.question, card.answer);
        if (res.success && res.distractors) {
            const options = [...res.distractors, card.answer].sort(() => Math.random() - 0.5);
            setQuizOptions(options);
        }
        setQuizLoading(false);
    };

    const handleAnswer = async (selected: string) => {
        if (selected === flashcards[currentQuizIdx].answer) {
            setScore(s => s + 1);
        }

        if (currentQuizIdx + 1 < flashcards.length) {
            const nextIdx = currentQuizIdx + 1;
            setCurrentQuizIdx(nextIdx);
            await prepareQuestion(nextIdx);
        } else {
            setQuizFinished(true);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!text.trim() && !image) return;

        setLoading(true);
        try {
            const result = await generateFlashcards(text, image || undefined);
            if (result.success && result.data) {
                setFlashcards(result.data as any);
                setImage(null); // Clear image after success
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

    const exportToCSV = () => {
        if (flashcards.length === 0) return;
        const csvContent = "data:text/csv;charset=utf-8,"
            + flashcards.map(c => `"${c.question.replace(/"/g, '""')}","${c.answer.replace(/"/g, '""')}"`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "flashcards_anki.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = () => {
        window.print(); // Simple and effective for now with proper print styles
    };

    const masteryAvg = flashcards.length > 0
        ? Math.round(flashcards.reduce((acc, c) => acc + (c as any).masteryLevel, 0) / flashcards.length)
        : 0;

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="text-center mb-8 space-y-2">
                <div className="flex items-center justify-center gap-4">
                    <h1 className="text-4xl font-extrabold tracking-tight">🎉 FlashMind AI</h1>
                    <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold border border-orange-200">
                        <Trophy className="w-4 h-4" /> 3 Day Streak
                    </div>
                </div>
                <p className="text-gray-500">Master your materials with AI-powered retention.</p>

                {flashcards.length > 0 && (
                    <div className="max-w-xs mx-auto pt-4 space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                            <span>Overall Mastery</span>
                            <span>{masteryAvg}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000"
                                style={{ width: `${masteryAvg}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-4 mb-12">
                <label className="text-sm font-medium text-gray-500">Paste text OR upload a photo of your notes:</label>

                <div className="flex flex-col gap-4">
                    <Textarea
                        placeholder="Paste article, notes, or topic here..."
                        className="min-h-[150px] text-lg p-4 resize-y"
                        value={text}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                    />

                    <div className="flex items-center gap-4 p-4 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-zinc-900/50">
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="image-upload"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                <Sparkles className="w-4 h-4" />
                                {image ? "Change Image" : "Upload Photo (OCR)"}
                            </label>
                        </div>
                        {image && (
                            <div className="relative w-20 h-20 rounded border overflow-hidden">
                                <img src={image} alt="Upload preview" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => setImage(null)}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl text-[8px]"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                </div>
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

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 print:m-0">
                <div className="flex items-center justify-between print:hidden">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Your Flashcards</h2>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100" onClick={startQuiz}>
                            <Brain className="w-4 h-4" /> Start Quiz
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2" onClick={exportToCSV}>
                            <Sparkles className="w-4 h-4 text-orange-500" /> Export Anki (.csv)
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2" onClick={exportToPDF}>
                            <Loader2 className="w-4 h-4 text-blue-500" /> Save as PDF
                        </Button>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 print:grid-cols-1">
                    {flashcards.map((card, idx) => (
                        <Flashcard key={idx} index={idx} id={(card as any).id} question={card.question} answer={card.answer} />
                    ))}
                </div>
            </div>

            {/* Quiz Overlay */}
            {isQuizMode && (
                <div className="fixed inset-0 bg-white/95 dark:bg-zinc-950/95 z-50 flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Brain className="text-purple-600" /> FlashMind Quiz
                            </h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsQuizMode(false)}>
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        {!quizFinished ? (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium text-gray-500">
                                        <span>Question {currentQuizIdx + 1} of {flashcards.length}</span>
                                        <span>Score: {score}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-600 transition-all duration-300"
                                            style={{ width: `${((currentQuizIdx) / flashcards.length) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <Card className="p-8 border-2 border-purple-100 bg-purple-50/30">
                                    <p className="text-2xl font-semibold text-center leading-relaxed">
                                        {flashcards[currentQuizIdx].question}
                                    </p>
                                </Card>

                                <div className="grid grid-cols-1 gap-4">
                                    {quizLoading ? (
                                        <div className="flex flex-col items-center py-10 gap-4">
                                            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                                            <p className="text-gray-500 animate-pulse font-medium">AI is generating options...</p>
                                        </div>
                                    ) : (
                                        quizOptions.map((opt, i) => (
                                            <Button
                                                key={i}
                                                variant="outline"
                                                className="h-16 text-lg justify-start px-6 hover:bg-purple-50 hover:border-purple-300 border-2 transition-all hover:translate-x-1"
                                                onClick={() => handleAnswer(opt)}
                                            >
                                                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold mr-4">
                                                    {String.fromCharCode(64 + i + 1)}
                                                </span>
                                                {opt}
                                            </Button>
                                        ))
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-8 animate-in zoom-in duration-500">
                                <div className="relative inline-block">
                                    <Trophy className="w-32 h-32 text-yellow-500 mx-auto" />
                                    <div className="absolute inset-0 animate-ping rounded-full bg-yellow-500/20" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-bold">Quiz Complete!</h3>
                                    <p className="text-2xl text-gray-600">You scored {score} out of {flashcards.length}</p>
                                </div>
                                <div className="flex gap-4 justify-center">
                                    <Button size="lg" className="bg-purple-600" onClick={startQuiz}>
                                        Try Again
                                    </Button>
                                    <Button size="lg" variant="outline" onClick={() => setIsQuizMode(false)}>
                                        Back to Cards
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
