#!/bin/bash

# Cleanup function
cleanup() {
  echo ""
  echo "🛑 Shutting down..."
  kill $(jobs -p) 2>/dev/null
  exit
}

trap cleanup SIGINT SIGTERM

echo "🔨 Initial build of apteva-kit package..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo ""
echo "✅ Package built successfully!"
echo ""
echo "📦 Installing example dependencies..."

cd example

if [ ! -d "node_modules" ]; then
  npm install
fi

cd ..

echo ""
echo "👀 Starting watchers..."
echo ""

# Start library watchers in background
./dev-watch.sh &
WATCHER_PID=$!

# Give watchers a moment to start
sleep 2

echo "🚀 Example app starting on port 3060..."
echo ""
echo "Visit: http://localhost:3060"
echo ""
echo "Press Ctrl+C to stop all processes"
echo ""

# Run example dev server
cd example && npm run dev
