# Apteva-Kit Example App

Example Next.js 15 application demonstrating all Apteva-Kit components.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server on port 3060
npm run dev

# Build for production
npm run build

# Start production server on port 3060
npm start
```

Then open [http://localhost:3060](http://localhost:3060) in your browser.

## Examples Included

### 1. **Chat Component** (`/examples/chat`)
Full conversation interface with:
- Message history
- Real-time streaming responses
- Widget rendering inline
- Action handling

### 2. **Command Component** (`/examples/command`)
Single command execution with:
- Auto-execute mode
- Loading states with progress
- Success/error handling
- Custom result rendering

### 3. **Prompt Component** (`/examples/prompt`)
Inline AI input featuring:
- Suggestion chips
- Auto-completion
- Multiple submit modes (enter, button, blur)
- Result callbacks

### 4. **Stream Component** (`/examples/stream`)
Streaming text display with:
- Auto-start capability
- Typing cursor effect
- Multiple style variants (prose, code, plain)
- Customizable speed

### 5. **Widgets Component** (`/examples/widgets`)
Interactive widget rendering:
- Card widgets with images and actions
- List widgets with metadata
- Multiple layout options (stack, grid)
- Action handling

### 6. **Trip Planner** (`/examples/trip-planner`)
Full application demo showing:
- Chat + Map integration
- Bidirectional data flow
- Itinerary management
- Real-world use case

## Project Structure

```
example/
├── app/
│   ├── layout.tsx          # Root layout with apteva-kit styles
│   ├── globals.css         # Global styles
│   ├── page.tsx            # Home page with example links
│   └── examples/
│       ├── chat/
│       ├── command/
│       ├── prompt/
│       ├── stream/
│       ├── widgets/
│       └── trip-planner/
├── package.json            # Dependencies (includes @apteva/apteva-kit)
└── next.config.js          # Next.js config with transpilePackages
```

## How Components Work

All components use **mock data** and don't require a backend:

```tsx
import { Chat, Command, Prompt, Stream, Widgets } from '@apteva/apteva-kit';
import '@apteva/apteva-kit/dist/index.css';

// Chat Component
<Chat
  agentId="agent_123"
  onAction={(action) => {
    console.log('Action:', action);
  }}
/>

// Command Component
<Command
  agentId="agent_analyst"
  command="Analyze data"
  autoExecute
  onComplete={(result) => {
    console.log('Result:', result);
  }}
/>

// Prompt Component
<Prompt
  agentId="agent_writer"
  placeholder="Write something..."
  onResult={(text) => {
    console.log('Result:', text);
  }}
/>
```

## Port Configuration

The app runs on **port 3060** by default (configured in package.json):

```json
{
  "scripts": {
    "dev": "next dev -p 3060",
    "start": "next start -p 3060"
  }
}
```

## Features

- ✅ All components working with mock data
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Next.js 15 App Router
- ✅ Hot module reload
- ✅ Full responsive design

## Learn More

- [Apteva-Kit Documentation](../README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
