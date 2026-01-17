// Drawer resize functionality
export function initializeDrawerResize(
    drawerId: string,
    position: string,
    minSize: number = 200,
    maxSize: number = 800
) {
    const drawer = document.getElementById(drawerId);
    if (!drawer) return null;

    const isHorizontal = position === 'Left' || position === 'Right';
    let isResizing = false;
    let startPos = 0;
    let startSize = 0;

    const resizeHandle = drawer.querySelector('[data-resize-handle]') as HTMLElement;
    if (!resizeHandle) return null;

    const onMouseDown = (e: MouseEvent) => {
        isResizing = true;
        startPos = isHorizontal ? e.clientX : e.clientY;
        startSize = isHorizontal ? drawer.offsetWidth : drawer.offsetHeight;
        document.body.style.cursor = isHorizontal
            ? (position === 'Left' ? 'e-resize' : 'w-resize')
            : (position === 'Top' ? 's-resize' : 'n-resize');
        document.body.style.userSelect = 'none';
        e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;

        const currentPos = isHorizontal ? e.clientX : e.clientY;
        let delta = currentPos - startPos;

        // Invert delta for right/bottom positioned drawers
        if (position === 'Right' || position === 'Bottom') {
            delta = -delta;
        }

        let newSize = startSize + delta;
        newSize = Math.max(minSize, Math.min(maxSize, newSize));

        if (isHorizontal) {
            drawer.style.width = `${newSize}px`;
        } else {
            drawer.style.height = `${newSize}px`;
        }
    };

    const onMouseUp = () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    };

    resizeHandle.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return {
        destroy: () => {
            resizeHandle.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    };
}

// Make it available globally
if (typeof window !== 'undefined') {
    (window as any).BlazwindDrawer = {
        initializeResize: initializeDrawerResize
    };
}
