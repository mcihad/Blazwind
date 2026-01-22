import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        outDir: resolve(__dirname, '../wwwroot'),
        emptyOutDir: false, // Don't wipe out the main bundle
        lib: {
            entry: resolve(__dirname, 'src/maplibre/index.ts'),
            name: 'BwMapLibre',
            fileName: 'blazwind.maplibre',
            formats: ['iife'] // IIFE for global window.BwMapLibre
        },
        rollupOptions: {
            output: {
                assetFileNames: 'blazwind.maplibre[extname]',
                entryFileNames: 'blazwind.maplibre.js'
            }
        }
    }
});
