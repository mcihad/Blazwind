import { readFileSync } from 'fs';
import { resolve, join } from 'path';

// Use the correct path based on where the script is run
const themesDir = resolve('src/themes');
const themeFiles = ['blazwind.css', 'ocean.css', 'forest.css'];

console.log("Verifying theme definition parity...");

const themeVars = {};

themeFiles.forEach(file => {
    const filePath = join(themesDir, file);
    try {
        const content = readFileSync(filePath, 'utf-8');
        // Match definitions: --bw-var followed by colon (ignoring values, comments handled by logic)
        // Regex matches start of line (with optional whitespace) to avoid picking up usages in comments/var()
        const matches = [...content.matchAll(/^\s*(--bw-[\w-]+)(?=\s*:)/gm)];
        const vars = new Set(matches.map(m => m[1]));
        themeVars[file] = vars;
        console.log(`${file}: ${vars.size} variables defined.`);
    } catch (e) {
        console.error(`Error reading ${file}:`, e.message);
    }
});

const reference = 'blazwind.css';
const refVars = themeVars[reference];
let pass = true;

if (!refVars) {
    console.error("Reference theme not found!");
    process.exit(1);
}

themeFiles.filter(f => f !== reference).forEach(file => {
    const currentVars = themeVars[file];
    if (!currentVars) return;

    const missing = [...refVars].filter(v => !currentVars.has(v));
    const extra = [...currentVars].filter(v => !refVars.has(v));

    if (missing.length) {
        console.error(`❌ ${file} is missing ${missing.length} variables:`);
        // Show first 5 missing
        console.error(`   Ex: ${missing.slice(0, 5).join(', ')}...`);
        pass = false;
    }

    if (extra.length) {
        // Extra variables might be okay, but let's flag them given the user's strict request
        console.warn(`⚠️ ${file} has ${extra.length} extra variables:`);
        console.warn(`   Ex: ${extra.slice(0, 5).join(', ')}...`);
    }

    if (!missing.length && !extra.length) {
        console.log(`✅ ${file} matches ${reference} perfectly.`);
    }
});

if (!pass) process.exit(1);
