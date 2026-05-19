import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  dts: true,
  clean: true,
  treeshake: true,
  target: 'es2020',
  splitting: false,
  sourcemap: false,
  external: ['react', 'react-dom'],
})
