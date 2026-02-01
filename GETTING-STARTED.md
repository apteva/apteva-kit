# Getting Started with Apteva-Kit

## 🚀 Quick Start - Run Everything at Once

### Option 1: One-Command Start (Recommended)

From the `apteva-kit` directory:

```bash
npm run example
```

This will:
1. Build the apteva-kit package
2. Install example dependencies (if needed)
3. Start the dev server on port 3060

---

### Option 2: Separate Commands

#### Build the package:
```bash
npm run build
```

#### Run the example app:
```bash
npm run example:dev
```

Or manually:
```bash
cd example
npm install  # Only needed first time
npm run dev
```

---

### Option 3: Development Mode with Auto-Rebuild

If you're actively developing the package and want changes to rebuild automatically:

**Terminal 1 - Watch mode (rebuilds on changes):**
```bash
npm run dev
```

**Terminal 2 - Run example:**
```bash
npm run example:dev
```

This way, when you edit components in `src/`, they'll automatically rebuild and update in the example app.

---

## 📦 Available Commands

From `/frontends/apteva/apteva-kit/`:

| Command | Description |
|---------|-------------|
| `npm run build` | Build the package to `dist/` |
| `npm run dev` | Build package in watch mode |
| `npm run example` | Build package + run example app |
| `npm run example:install` | Install example dependencies |
| `npm run example:dev` | Run example app only |
| `npm run build:example` | Build both package and example for production |
| `npm run type-check` | Check TypeScript types |

---

## 🎯 Typical Workflows

### Just Testing/Using the Components

```bash
cd /Users/marcoschwartz/Documents/code/frontends/apteva/apteva-kit
npm run example
```

Visit: http://localhost:3060

---

### Developing Components

**Terminal 1:**
```bash
cd /Users/marcoschwartz/Documents/code/frontends/apteva/apteva-kit
npm run dev
```

**Terminal 2:**
```bash
cd /Users/marcoschwartz/Documents/code/frontends/apteva/apteva-kit/example
npm run dev
```

Now edit files in `src/components/` and see changes live at http://localhost:3060

---

### Building for Production

```bash
cd /Users/marcoschwartz/Documents/code/frontends/apteva/apteva-kit
npm run build:example
```

This creates:
- `dist/` - Built package
- `example/.next/` - Built Next.js app

---

## 🔄 How It Works

### Package Build Process

1. **Source** (`src/`) → **tsup** → **Output** (`dist/`)
   - `dist/index.js` - CommonJS
   - `dist/index.mjs` - ES Modules
   - `dist/index.d.ts` - TypeScript types
   - `dist/index.css` - Styles

2. **Example app** imports from `../dist/` (local package)

3. Changes to `src/` require rebuild:
   - Manual: `npm run build`
   - Auto: `npm run dev` (watch mode)

---

## 📱 Example App Structure

The example app (`example/`) is a standalone Next.js 15 app that:

- Imports `@apteva/apteva-kit` from parent directory (`file:..`)
- Runs on port 3060
- Has 6 example pages demonstrating all components
- Works with mock data (no backend needed)

---

## 🐛 Troubleshooting

### "Module not found" errors

```bash
# Rebuild the package
cd /Users/marcoschwartz/Documents/code/frontends/apteva/apteva-kit
npm run build

# Reinstall example dependencies
cd example
rm -rf node_modules package-lock.json
npm install
```

### Port 3060 already in use

```bash
# Kill process on port 3060
lsof -ti:3060 | xargs kill -9

# Or change port in example/package.json:
# "dev": "next dev -p 3061"
```

### Components not updating

1. Make sure package is rebuilt: `npm run build`
2. Restart example app: `npm run example:dev`
3. Hard refresh browser (Cmd+Shift+R)

---

## 📚 Next Steps

1. **Run the example:** `npm run example`
2. **Explore examples:** http://localhost:3060
3. **Check components:** See `src/components/`
4. **Read docs:** See `README.md`
5. **Build your app:** Use the components!

---

## 💡 Tips

- Use `npm run dev` for active development (auto-rebuilds)
- Use `npm run example` for quick testing
- Example app uses mock data - no API setup needed
- All TypeScript types are available for autocompletion
- Styles are included via `@apteva/apteva-kit/dist/index.css`
