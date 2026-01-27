import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { readdirSync } from 'fs';

// Get all theme files from themes directory
const themesDir = resolve(__dirname, 'src/themes');
const themeFiles = readdirSync(themesDir)
    .filter(file => file.endsWith('.css') && !file.startsWith('_') && file !== 'index.css');

// Create entry points for each theme
const themeEntries: Record<string, string> = {};
themeFiles.forEach(file => {
    const name = file.replace('.css', '');
    themeEntries[name] = resolve(themesDir, file);
});

export default defineConfig({
    plugins: [tailwindcss()],
    build: {
        outDir: resolve(__dirname, '../wwwroot/css/themes'),
        emptyOutDir: true,
        cssCodeSplit: true,
        rollupOptions: {
            input: themeEntries,
            output: {
                assetFileNames: '[name][extname]',
                entryFileNames: '[name].js',
            }
        }
    }
});
