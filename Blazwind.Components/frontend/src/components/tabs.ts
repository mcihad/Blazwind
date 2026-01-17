
/**
 * Tab scrolling logic
 */

export function init(container: HTMLElement, leftBtn: HTMLElement, rightBtn: HTMLElement) {
    if (!container || !leftBtn || !rightBtn) return;

    const updateButtons = () => {
        // Left button visibility
        if (container.scrollLeft > 0) {
            leftBtn.classList.remove('invisible', 'opacity-0');
            leftBtn.classList.add('visible', 'opacity-100');
        } else {
            leftBtn.classList.remove('visible', 'opacity-100');
            leftBtn.classList.add('invisible', 'opacity-0');
        }

        // Right button visibility
        // Use tolerance of 1px for float calculations
        if (Math.ceil(container.scrollLeft + container.clientWidth) < container.scrollWidth) {
            rightBtn.classList.remove('invisible', 'opacity-0');
            rightBtn.classList.add('visible', 'opacity-100');
        } else {
            rightBtn.classList.remove('visible', 'opacity-100');
            rightBtn.classList.add('invisible', 'opacity-0');
        }
    };

    // Scroll amount: half of visible width or fixed amount
    const getScrollAmount = () => container.clientWidth / 2;

    leftBtn.onclick = (e) => {
        e.stopPropagation();
        container.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    };

    rightBtn.onclick = (e) => {
        e.stopPropagation();
        container.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    };

    container.addEventListener('scroll', updateButtons);

    // Initial check (wait for layout)
    requestAnimationFrame(updateButtons);

    // Observer for resize (if tabs change or window resizes)
    const resizeObserver = new ResizeObserver(updateButtons);
    resizeObserver.observe(container);

    // Observer for DOM changes (adding/removing tabs)
    const mutationObserver = new MutationObserver(updateButtons);
    mutationObserver.observe(container, { childList: true, subtree: true, characterData: true });

    // Initial update
    updateButtons();

    // Store cleanup function
    (container as any)._blazwindTabsCleanup = () => {
        container.removeEventListener('scroll', updateButtons);
        resizeObserver.disconnect();
        mutationObserver.disconnect();
        leftBtn.onclick = null;
        rightBtn.onclick = null;
    };
}

export function dispose(container: HTMLElement) {
    if (container && (container as any)._blazwindTabsCleanup) {
        (container as any)._blazwindTabsCleanup();
        delete (container as any)._blazwindTabsCleanup;
    }
}
