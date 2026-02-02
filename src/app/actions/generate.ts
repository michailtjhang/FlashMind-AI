'use server';

import { flashModel } from "@/lib/gemini";
import { generateObject } from "ai";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// Removed local prisma instantiation

export async function generateFlashcards(text: string, image?: string) {
    if ((!text || text.length < 10) && !image) {
        return { success: false, error: "Text or image is required" };
    }

    const { userId } = await auth();
    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const messages: any[] = [
            {
                role: 'user',
                content: [
                    { type: 'text', text: `Create 5 study flashcards (question and answer pairs) from the following context. Key points only. \n\nTEXT: ${text}` },
                ]
            }
        ];

        if (image) {
            // image is data url, need to extract base64
            const base64 = image.split(',')[1];
            messages[0].content.push({
                type: 'image',
                image: base64,
            });
        }

        const { object } = await generateObject({
            model: flashModel,
            schema: z.object({
                flashcards: z.array(z.object({
                    question: z.string().describe("The specific question based on the text/image"),
                    answer: z.string().describe("The concise answer to the question"),
                })).length(5),
            }),
            messages,
        });

        const flashcardsData = object.flashcards.map(card => ({
            userId: userId,
            question: card.question,
            answer: card.answer,
            topic: "General", // You could also ask AI to extract a topic
        }));

        // Save to Database individually to get IDs back
        const createdCards = await Promise.all(
            flashcardsData.map(data => db.flashcard.create({ data }))
        );

        revalidatePath('/dashboard');

        return { success: true, data: createdCards };

    } catch (error) {
        console.error("AI Generation Error:", error);
        return { success: false, error: "Failed to generate flashcards" };
    }
}
