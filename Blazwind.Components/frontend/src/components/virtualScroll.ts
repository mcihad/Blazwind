/**
 * Blazwind VirtualScroll - TypeScript Module
 */

interface VirtualScrollState {
    container: HTMLElement;
    dotNetRef: any;
    lastScrollTop: number;
}

let scrollStates = new Map<HTMLElement, VirtualScrollState>();

export function initialize(container: HTMLElement, dotNetRef: any): void {
    const state: VirtualScrollState = {
        container,
        dotNetRef,
        lastScrollTop: 0
    };

    scrollStates.set(container, state);

    const handleScroll = () => {
        const scrollTop = Math.round(container.scrollTop);
        if (Math.abs(scrollTop - state.lastScrollTop) > 10) {
            state.lastScrollTop = scrollTop;
            state.dotNetRef.invokeMethodAsync('OnScroll', scrollTop);
        }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
}

export function dispose(): void {
    scrollStates.clear();
}
