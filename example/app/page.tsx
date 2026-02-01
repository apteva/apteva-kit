import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black flex items-center justify-center p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-neutral-900 dark:text-white mb-4">
            Apteva-Kit
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400">
            AI-powered React components for building conversational interfaces
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ExampleCard
            href="/examples/chat"
            title="Chat Component"
            description="Full conversation interface with message history and widgets"
            icon="💬"
          />

          <ExampleCard
            href="/examples/command"
            title="Command Component"
            description="Execute single commands with loading states and results"
            icon="⚡"
          />

          <ExampleCard
            href="/examples/hybrid"
            title="Hybrid Mode"
            description="Switch between Chat and Command modes seamlessly"
            icon="🔀"
          />

          <ExampleCard
            href="/examples/prompt"
            title="Prompt Component"
            description="Inline AI input with suggestions and auto-completion"
            icon="✨"
          />

          <ExampleCard
            href="/examples/stream"
            title="Stream Component"
            description="Display streaming AI text with typing effect"
            icon="📝"
          />

          <ExampleCard
            href="/examples/widgets"
            title="Widgets Component"
            description="Render interactive AI-generated widgets"
            icon="🎨"
          />

          <ExampleCard
            href="/examples/trip-planner"
            title="Trip Planner"
            description="Full application demo with chat + map integration"
            icon="✈️"
          />

          <ExampleCard
            href="/examples/coding-app"
            title="Coding Assistant"
            description="IDE-like interface with AI chat, code editor, deployments"
            icon="💻"
          />

          <ExampleCard
            href="/examples/agent-builder"
            title="Agent Builder"
            description="Chat interface for creating and managing AI agents with rich widgets"
            icon="🤖"
          />

          <ExampleCard
            href="/examples/variants"
            title="Chat Variants"
            description="Different visual themes: default, minimal, and terminal styles"
            icon="🎭"
          />
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-500">
            <span>Built with</span>
            <span className="font-semibold">React 19</span>
            <span>•</span>
            <span className="font-semibold">TypeScript</span>
            <span>•</span>
            <span className="font-semibold">Tailwind v4</span>
            <span>•</span>
            <span className="font-semibold">Next.js 15</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExampleCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="group p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
        {title}
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm">{description}</p>
      <div className="mt-4 text-neutral-900 dark:text-neutral-300 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
        View Example →
      </div>
    </Link>
  );
}
