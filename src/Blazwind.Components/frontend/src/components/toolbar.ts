/**
 * Blazwind Toolbar - TypeScript Module
 * Handles dropdown direction calculation based on viewport position
 */

/**
 * Calculate optimal dropdown direction based on element position in viewport
 * @returns [openUpward: 0|1, alignRight: 0|1]
 */
export function getDropdownDirection(element: HTMLElement): number[] {
    if (!element) return [0, 0];

    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const dropdownHeight = 200; // Estimated max dropdown height
    const dropdownWidth = 200;  // Estimated max dropdown width

    // Check if there's enough space below
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? 1 : 0;

    // Check if there's enough space on the right
    const spaceRight = viewportWidth - rect.left;
    const spaceLeft = rect.right;
    const alignRight = spaceRight < dropdownWidth && spaceLeft > spaceRight ? 1 : 0;

    return [openUpward, alignRight];
}
