export class ContextMenu {
    public static getPositionAdjusted(x: number, y: number, menuWidth: number = 200, menuHeight: number = 200): { x: number, y: number } {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let adjustedX = x;
        let adjustedY = y;

        // Check right edge
        if (x + menuWidth > viewportWidth) {
            adjustedX = Math.max(0, x - menuWidth);
        }

        // Check bottom edge
        if (y + menuHeight > viewportHeight) {
            adjustedY = Math.max(0, y - menuHeight);
        }

        // Ensure not negative in top/left
        if (adjustedX < 0) adjustedX = 0;
        if (adjustedY < 0) adjustedY = 0;

        return { x: adjustedX, y: adjustedY };
    }

    public static adjustSubmenuPosition(triggerElement: HTMLElement, submenuElement: HTMLElement) {
        if (!triggerElement || !submenuElement) return;

        const triggerRect = triggerElement.getBoundingClientRect();
        const submenuRect = submenuElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Reset styles first to get accurate measurement (though getBoundingClientRect works on rendered)
        // Default: Open to right of trigger's parent (contextmenu) width?
        // Actually contextmenu items stacked vertically.
        // Trigger is the item <li> or <button>.
        // Submenu should appear at (trigger.right, trigger.top).

        let left = triggerRect.width;
        let top = 0; // Relative to trigger top

        // Calculate absolute position to check collision
        const absoluteRight = triggerRect.right + submenuRect.width;
        const absoluteBottom = triggerRect.top + submenuRect.height; // Using top as anchor

        // Check right edge collision
        if (absoluteRight > viewportWidth) {
            // Flip to left: -submenuWidth
            left = -submenuRect.width;
        }

        // Check bottom edge collision
        if (absoluteBottom > viewportHeight) {
            // Align bottom: triggerHeight - submenuHeight
            // This makes the bottom of submenu align with bottom of trigger
            top = triggerRect.height - submenuRect.height;
        }

        submenuElement.style.left = `${left}px`;
        submenuElement.style.top = `${top}px`;

        // Make visible after positioning to prevent jumping
        submenuElement.style.opacity = '1';
    }

    public static calculateMenuPosition(element: HTMLElement, x: number, y: number): { x: number, y: number } {
        if (!element) return { x, y };

        const rect = element.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let adjustedX = x;
        let adjustedY = y;

        // Check right edge
        if (x + width > viewportWidth) {
            adjustedX = Math.max(0, x - width);
        }

        // Check bottom edge
        if (y + height > viewportHeight) {
            adjustedY = Math.max(0, y - height);
        }

        return { x: adjustedX, y: adjustedY };
    }

    public static adjustMenuPosition(element: HTMLElement, x: number, y: number) {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let adjustedX = x;
        let adjustedY = y;

        // Check right edge
        if (x + width > viewportWidth) {
            adjustedX = Math.max(0, x - width);
        }

        // Check bottom edge
        if (y + height > viewportHeight) {
            adjustedY = Math.max(0, y - height);
        }

        element.style.left = `${adjustedX}px`;
        element.style.top = `${adjustedY}px`;

        element.style.opacity = '1';
    }
}
