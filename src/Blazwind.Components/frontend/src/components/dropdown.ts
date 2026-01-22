/**
 * Dropdown Helper - Auto-flip functionality
 */

export function getPosition(element: HTMLElement): number[] {
    if (!element) {
        return [0, window.innerHeight, 0];
    }

    const rect = element.getBoundingClientRect();
    return [
        rect.bottom,           // element bottom position
        window.innerHeight,    // viewport height
        rect.top               // element top position
    ];
}
