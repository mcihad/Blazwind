import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    define: {
        'process.env': {}
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/echarts/index.ts'),
            name: 'BwChart',
            fileName: () => 'blazwind.chart',
            formats: ['iife']
        },
        outDir: '../wwwroot',
        emptyOutDir: false,
        rollupOptions: {
            output: {
                entryFileNames: 'blazwind.chart.js',
                assetFileNames: 'blazwind.chart.[ext]',
                // Ensure exports are on window.BwChart
                extend: true
            }
        },
        minify: true
    }
})
