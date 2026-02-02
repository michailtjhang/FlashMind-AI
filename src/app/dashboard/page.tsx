import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flashcard } from "@/components/Flashcard";
import { generateFlashcards } from "@/app/actions/generate";
// Note: generateFlashcards import is temporary/placeholder until we implement the action. 
// Ideally we keep the form client-side or use a client component wrapper.
// Let's make this page a Client Component for simplicity with state.

import ClientDashboard from "./client-dashboard";

export default function DashboardPage() {
    return <ClientDashboard />;
}
