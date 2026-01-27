/**
 * Blazwind Theme System
 * TypeScript module for runtime theme switching
 */

/**
 * Sets the active theme by loading the theme CSS file.
 * @param themeName - Theme name (e.g., "blazwind", "ocean", "forest")
 */
export function setTheme(themeName: string): void {
    console.log('[Blazwind.Theme] setTheme called with:', themeName);

    const themeId = 'bw-theme-css';

    // Remove existing theme stylesheet
    const existing = document.getElementById(themeId);
    if (existing) {
        existing.remove();
    }

    // Create new link element for theme CSS
    const link = document.createElement('link');
    link.id = themeId;
    link.rel = 'stylesheet';
    link.href = `_content/Blazwind.Components/css/themes/${themeName}.css`;

    // Insert in head
    document.head.appendChild(link);
    console.log('[Blazwind.Theme] Theme CSS loaded:', link.href);

    // Remove old theme classes and add new one to html element
    const html = document.documentElement;
    const themeClasses = Array.from(html.classList).filter(c => c.startsWith('bw-theme-'));
    themeClasses.forEach(c => html.classList.remove(c));
    html.classList.add(`bw-theme-${themeName}`);
    console.log('[Blazwind.Theme] HTML classes:', html.className);

    // Store preference
    localStorage.setItem('bw-theme', themeName);
    console.log('[Blazwind.Theme] Theme saved to localStorage');
}

/**
 * Sets dark mode by adding/removing the 'dark' class.
 * @param isDark - Whether to enable dark mode
 */
export function setDarkMode(isDark: boolean): void {
    console.log('[Blazwind.Theme] setDarkMode called with:', isDark);

    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    console.log('[Blazwind.Theme] HTML classes after dark mode:', document.documentElement.className);

    // Store preference
    localStorage.setItem('bw-dark-mode', String(isDark));
    console.log('[Blazwind.Theme] Dark mode saved to localStorage');
}

/**
 * Gets the stored theme from localStorage.
 * @returns The stored theme name, or 'blazwind' as default
 */
export function getStoredTheme(): string {
    const theme = localStorage.getItem('bw-theme') || 'blazwind';
    console.log('[Blazwind.Theme] getStoredTheme:', theme);
    return theme;
}

/**
 * Gets the stored dark mode preference.
 * Falls back to system preference if not set.
 * @returns Whether dark mode is enabled
 */
export function getStoredDarkMode(): boolean {
    const stored = localStorage.getItem('bw-dark-mode');
    if (stored !== null) {
        console.log('[Blazwind.Theme] getStoredDarkMode from localStorage:', stored);
        return stored === 'true';
    }
    // Fall back to system preference
    const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('[Blazwind.Theme] getStoredDarkMode from system:', systemPref);
    return systemPref;
}

/**
 * Initializes the theme system on page load.
 * Applies stored preferences immediately.
 */
export function initialize(): void {
    console.log('[Blazwind.Theme] initialize() called');
    setTheme(getStoredTheme());
    setDarkMode(getStoredDarkMode());
    console.log('[Blazwind.Theme] initialization complete');
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        console.log('[Blazwind.Theme] DOM loading, adding event listener');
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM already loaded, initialize immediately
        console.log('[Blazwind.Theme] DOM ready, initializing immediately');
        initialize();
    }
}
