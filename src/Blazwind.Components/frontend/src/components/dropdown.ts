/**
 * Dropdown Helper - Auto-flip functionality
 */

export function getPosition(element: HTMLElement): number[] {
    if (!element) {
        return [0, window.innerHeight, 0, 0, window.innerWidth];
    }

    const rect = element.getBoundingClientRect();
    return [
        rect.bottom,           // element bottom position
        window.innerHeight,    // viewport height
        rect.top,              // element top position
        rect.left,             // element left position
        window.innerWidth,     // viewport width
        rect.right,            // element right position
        rect.width             // element width
    ];
}

/**
 * Calculate optimal dropdown position based on viewport constraints
 * Returns: { shouldOpenUp: boolean, shouldOpenLeft: boolean }
 */
export function calculatePosition(element: HTMLElement, menuWidth: number = 224, menuHeight: number = 200): { shouldOpenUp: boolean, shouldOpenLeft: boolean } {
    if (!element) {
        return { shouldOpenUp: false, shouldOpenLeft: false };
    }

    const rect = element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const bottomSpace = viewportHeight - rect.bottom;
    const topSpace = rect.top;
    const rightSpace = viewportWidth - rect.right;
    const leftSpace = rect.left;

    // Vertical: check if menu fits below, if not check if it fits above
    const shouldOpenUp = bottomSpace < menuHeight && topSpace > menuHeight;

    // Horizontal: check if menu fits to right, if not check if it fits to left
    const shouldOpenLeft = rightSpace < menuWidth && leftSpace > menuWidth;

    return { shouldOpenUp, shouldOpenLeft };
}
