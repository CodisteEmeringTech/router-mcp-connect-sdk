import { defineConfig } from 'tsup';

const CONNECT_APP_URL =
  process.env.CONNECT_APP_URL || 'https://connect.yourdomain.com';

const sharedDefine = {
  '__CONNECT_APP_URL__': JSON.stringify(CONNECT_APP_URL),
};

export default defineConfig([
  // Core entry point (vanilla JS — zero dependencies)
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs', 'iife'],
    globalName: 'AggregatorConnect',
    dts: true,
    clean: true,
    minify: !process.env.DEV,
    treeshake: true,
    sourcemap: true,
    target: 'es2020',
    outDir: 'dist',
    define: sharedDefine,
  },
  // React entry point (optional — React 19+ as peer dep)
  {
    entry: { react: 'src/react/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    minify: !process.env.DEV,
    treeshake: true,
    sourcemap: true,
    target: 'es2020',
    outDir: 'dist',
    external: ['react', 'react-dom'],
    define: sharedDefine,
  },
]);
