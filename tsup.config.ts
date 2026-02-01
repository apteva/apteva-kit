import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true, // Enable code splitting for better tree-shaking
  sourcemap: true,
  clean: false, // Don't clean - CSS is built separately
  external: ['react', 'react-dom'],
  injectStyle: false, // Don't inject - we'll build CSS separately
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
