/**
 * Command Palette - Keyboard shortcuts and focus management
 */

let isInitialized = false;
let keyboardCallback: (() => void) | null = null;

/**
 * Initialize keyboard shortcut listener for Ctrl+K / Cmd+K
 */
export function registerKeyboardShortcut(dotNetRef: any): void {
    if (isInitialized) return;

    const handleKeydown = (e: KeyboardEvent) => {
        // Ctrl+K or Cmd+K (Mac)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            dotNetRef.invokeMethodAsync('OnShortcutPressed');
        }

        // Escape to close
        if (e.key === 'Escape') {
            dotNetRef.invokeMethodAsync('OnEscapePressed');
        }
    };

    document.addEventListener('keydown', handleKeydown);
    keyboardCallback = () => document.removeEventListener('keydown', handleKeydown);
    isInitialized = true;
}

/**
 * Unregister keyboard shortcut listener
 */
export function unregisterKeyboardShortcut(): void {
    if (keyboardCallback) {
        keyboardCallback();
        keyboardCallback = null;
    }
    isInitialized = false;
}

/**
 * Focus the command palette input without selecting text
 */
export function focusInput(inputId: string): void {
    setTimeout(() => {
        const input = document.getElementById(inputId) as HTMLInputElement;
        if (input) {
            input.focus();
            // Move cursor to the end of the text, DO NOT select
            const len = input.value.length;
            input.setSelectionRange(len, len);
        }
    }, 50);
}

/**
 * Preserve cursor position when Blazor re-renders
 */
export function preserveCursor(inputId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input && document.activeElement === input) {
        const pos = input.selectionStart ?? input.value.length;
        requestAnimationFrame(() => {
            input.focus();
            input.setSelectionRange(pos, pos);
        });
    }
}

/**
 * Handle arrow key navigation in results list
 */
export function handleArrowNavigation(
    dotNetRef: any,
    containerId: string,
    direction: 'up' | 'down'
): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    const items = container.querySelectorAll('.bw-command-item');
    const activeItem = container.querySelector('.bw-command-item.active');

    if (!items.length) return;

    let currentIndex = -1;
    items.forEach((item, index) => {
        if (item === activeItem) currentIndex = index;
    });

    let newIndex: number;
    if (direction === 'down') {
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    } else {
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    }

    dotNetRef.invokeMethodAsync('SetActiveIndex', newIndex);
}
