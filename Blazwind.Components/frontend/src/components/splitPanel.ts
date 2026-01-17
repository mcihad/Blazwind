/**
 * Blazwind SplitPanel - TypeScript Module
 * Handles draggable divider for resizing panels
 */

interface SplitPanelState {
    container: HTMLElement;
    dotNetRef: any;
    isHorizontal: boolean;
    isResizing: boolean;
}

let activeState: SplitPanelState | null = null;

/**
 * Initialize split panel resize
 */
export function initialize(container: HTMLElement, dotNetRef: any, isHorizontal: boolean): void {
    const divider = container.querySelector('[class*="cursor-col-resize"], [class*="cursor-row-resize"]') as HTMLElement;
    if (!divider) {
        console.error('SplitPanel: divider not found');
        return;
    }

    const state: SplitPanelState = {
        container,
        dotNetRef,
        isHorizontal,
        isResizing: false
    };

    divider.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        state.isResizing = true;
        activeState = state;
        document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize';
        document.body.style.userSelect = 'none';
    });

    // Touch support
    divider.addEventListener('touchstart', (e) => {
        e.preventDefault();
        state.isResizing = true;
        activeState = state;
    }, { passive: false });
}

function handleMouseMove(e: MouseEvent): void {
    if (!activeState || !activeState.isResizing) return;

    const rect = activeState.container.getBoundingClientRect();
    let percentage: number;

    if (activeState.isHorizontal) {
        const x = e.clientX - rect.left;
        percentage = (x / rect.width) * 100;
    } else {
        const y = e.clientY - rect.top;
        percentage = (y / rect.height) * 100;
    }

    // Clamp percentage
    percentage = Math.max(5, Math.min(95, percentage));
    activeState.dotNetRef.invokeMethodAsync('UpdateSize', percentage);
}

function handleMouseUp(): void {
    if (activeState) {
        activeState.isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        activeState = null;
    }
}

function handleTouchMove(e: TouchEvent): void {
    if (!activeState || !activeState.isResizing || e.touches.length === 0) return;

    const touch = e.touches[0];
    const rect = activeState.container.getBoundingClientRect();
    let percentage: number;

    if (activeState.isHorizontal) {
        percentage = ((touch.clientX - rect.left) / rect.width) * 100;
    } else {
        percentage = ((touch.clientY - rect.top) / rect.height) * 100;
    }

    percentage = Math.max(5, Math.min(95, percentage));
    activeState.dotNetRef.invokeMethodAsync('UpdateSize', percentage);
}

// Global listeners
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('touchmove', handleTouchMove, { passive: true });
document.addEventListener('touchend', handleMouseUp);

export function dispose(): void {
    activeState = null;
}
