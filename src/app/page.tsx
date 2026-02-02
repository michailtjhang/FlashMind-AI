import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Brain, Sparkles, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 text-center bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium dark:bg-blue-900/30 dark:text-blue-400">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Learning</span>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-gray-900 dark:text-white">
          Master any topic with <span className="text-blue-600">AI Flashcards</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Paste your notes, articles, or study guides. FlashMind AI instantly transforms them into interactive flashcards for effective active recall.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/dashboard">
            <Button size="lg" className="h-12 px-8 text-lg gap-2">
              Start Learning Now <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
              Learn More
            </Button>
          </Link>
        </div>
      </div>

      <div id="features" className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl text-left">
        <FeatureCard
          icon={<Zap className="w-6 h-6 text-yellow-500" />}
          title="Instant Generation"
          description="Turn pages of text into concise Q&A pairs in seconds using Gemini 1.5 Flash."
        />
        <FeatureCard
          icon={<Brain className="w-6 h-6 text-purple-500" />}
          title="Active Recall"
          description="Test your knowledge with flip-cards designed for memory retention."
        />
        <FeatureCard
          icon={<Sparkles className="w-6 h-6 text-blue-500" />}
          title="Progress Tracking"
          description="Save your decks and track your mastery over time (coming soon)."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4 dark:bg-zinc-800">
        {icon}
      </div>
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  )
}
