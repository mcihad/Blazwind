/**
 * Blazwind InfiniteScroll - TypeScript Module
 */

interface InfiniteScrollState {
    sentinel: HTMLElement;
    dotNetRef: any;
    observer: IntersectionObserver;
    isLoading: boolean;
}

let scrollStates = new Map<HTMLElement, InfiniteScrollState>();

export function initialize(sentinel: HTMLElement, ref: any, threshold: number): void {
    if (!sentinel) {
        console.error('InfiniteScroll: sentinel element not found');
        return;
    }

    const options: IntersectionObserverInit = {
        root: null,
        rootMargin: `${threshold}px`,
        threshold: 0.1
    };

    const state: InfiniteScrollState = {
        sentinel,
        dotNetRef: ref,
        observer: null!,
        isLoading: false
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !state.isLoading && state.dotNetRef) {
                state.isLoading = true;
                state.dotNetRef.invokeMethodAsync('TriggerLoadMore').then(() => {
                    // Small delay to prevent rapid triggers
                    setTimeout(() => {
                        state.isLoading = false;
                    }, 100);
                }).catch(() => {
                    state.isLoading = false;
                });
            }
        });
    }, options);

    state.observer = observer;
    scrollStates.set(sentinel, state);

    observer.observe(sentinel);
}

export function dispose(): void {
    scrollStates.forEach(state => {
        if (state.observer) {
            state.observer.disconnect();
        }
    });
    scrollStates.clear();
}
