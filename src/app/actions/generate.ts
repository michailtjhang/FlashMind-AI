'use server';

import { flashModel } from "@/lib/gemini";
import { generateObject } from "ai";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// Removed local prisma instantiation

export async function generateFlashcards(text: string) {
    if (!text || text.length < 10) {
        return { success: false, error: "Text is too short" };
    }

    const { userId } = await auth();
    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const { object } = await generateObject({
            model: flashModel,
            schema: z.object({
                flashcards: z.array(z.object({
                    question: z.string().describe("The specific question based on the text"),
                    answer: z.string().describe("The concise answer to the question"),
                })).length(5),
            }),
            prompt: `Create 5 study flashcards (question and answer pairs) from the following text. Key points only. \n\nTEXT: ${text}`,
        });

        const flashcardsData = object.flashcards.map(card => ({
            userId: userId,
            question: card.question,
            answer: card.answer,
            topic: "General", // You could also ask AI to extract a topic
        }));

        // Save to Database
        await db.flashcard.createMany({
            data: flashcardsData
        });

        revalidatePath('/dashboard');

        return { success: true, data: flashcardsData };

    } catch (error) {
        console.error("AI Generation Error:", error);
        return { success: false, error: "Failed to generate flashcards" };
    }
}
