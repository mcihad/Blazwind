import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
    plugins: [tailwindcss()],
    build: {
        outDir: resolve(__dirname, '../wwwroot'),
        emptyOutDir: true,
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            name: 'Blazwind',
            fileName: 'blazwind',
            formats: ['iife']
        },
        rollupOptions: {
            output: {
                assetFileNames: 'blazwind[extname]',
                entryFileNames: 'blazwind.js',
                extend: true
            }
        }
    }
});
