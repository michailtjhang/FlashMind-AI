'use server';

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateCardMastery(cardId: string, level: 'easy' | 'medium' | 'hard') {
    const { userId } = await auth();
    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const now = new Date();
        let nextReview: Date;
        let masteryIncrement = 0;

        switch (level) {
            case 'easy':
                nextReview = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000); // +4 days
                masteryIncrement = 30;
                break;
            case 'medium':
                nextReview = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000); // +1 day
                masteryIncrement = 15;
                break;
            case 'hard':
                nextReview = new Date(now.getTime() + 1 * 60 * 60 * 1000); // +1 hour
                masteryIncrement = 5;
                break;
            default:
                nextReview = now;
        }

        await db.flashcard.update({
            where: { id: cardId, userId: userId },
            data: {
                nextReviewAt: nextReview,
                masteryLevel: {
                    increment: masteryIncrement
                }
            }
        });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error("Mastery Update Error:", error);
        return { success: false, error: "Failed to update mastery" };
    }
}
