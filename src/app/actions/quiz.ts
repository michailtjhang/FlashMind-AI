'use server';

import { flashModel } from "@/lib/gemini";
import { generateObject } from "ai";
import { z } from "zod";

export async function generateDistractors(question: string, correctAnswer: string) {
    try {
        const { object } = await generateObject({
            model: flashModel,
            schema: z.object({
                distractors: z.array(z.string()).length(3),
            }),
            prompt: `Given the following question and its correct answer, generate 3 plausible but incorrect multiple-choice distractors.
            
            QUESTION: ${question}
            CORRECT ANSWER: ${correctAnswer}
            
            Return only the 3 distractors in the specified JSON format.`,
        });

        return { success: true, distractors: object.distractors };
    } catch (error) {
        console.error("Quiz Generation Error:", error);
        return { success: false, error: "Failed to generate distractors" };
    }
}
