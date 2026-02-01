#!/bin/bash

# Cleanup function
cleanup() {
  echo ""
  echo "🛑 Stopping watchers..."
  kill $(jobs -p) 2>/dev/null
  exit
}

trap cleanup SIGINT SIGTERM

echo "👀 Starting library watchers..."
echo ""

# Start tsup watcher
tsup --watch &
TSUP_PID=$!

# Start CSS watcher
npx @tailwindcss/cli -i src/styles/globals.css -o dist/styles.css --watch &
CSS_PID=$!

echo "📦 TypeScript watcher running (PID: $TSUP_PID)"
echo "🎨 CSS watcher running (PID: $CSS_PID)"
echo ""
echo "Press Ctrl+C to stop watchers"
echo ""

# Wait for all background processes
wait
