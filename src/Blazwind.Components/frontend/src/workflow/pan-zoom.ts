/**
 * Pan & Zoom controller for workflow canvas
 */
import type { WorkflowOptions } from './types';

export interface Transform {
    x: number;
    y: number;
    k: number;
}

export interface PanZoomController {
    transform: Transform;
    setTransform(transform: Transform): void;
    zoomIn(center?: { x: number; y: number }): void;
    zoomOut(center?: { x: number; y: number }): void;
    fitToScreen(bounds: { minX: number; maxX: number; minY: number; maxY: number }): void;
    reset(): void;
    destroy(): void;
}

/**
 * Create a pan-zoom controller for the given SVG group
 */
export function createPanZoom(
    container: HTMLElement,
    mainGroup: SVGGElement,
    options: WorkflowOptions,
    onTransformChange?: (transform: Transform) => void
): PanZoomController {
    let transform: Transform = { x: 0, y: 0, k: 1 };
    let isDragging = false;
    let lastMouse = { x: 0, y: 0 };

    const updateTransform = () => {
        mainGroup.setAttribute('transform', `translate(${transform.x}, ${transform.y}) scale(${transform.k})`);
        onTransformChange?.(transform);
    };

    // Wheel zoom
    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = -Math.sign(e.deltaY) * 0.1;
        const rect = container.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;

        const oldK = transform.k;
        const newK = Math.max(options.minZoom, Math.min(options.maxZoom, oldK * (1 + delta)));

        // Zoom towards cursor
        transform = {
            x: cx - (cx - transform.x) * (newK / oldK),
            y: cy - (cy - transform.y) * (newK / oldK),
            k: newK
        };

        updateTransform();
    };

    // Mouse pan
    const handleMouseDown = (e: MouseEvent) => {
        // Only pan on middle click or when clicking empty space
        if (e.button === 1 || (e.target === container || (e.target as Element).tagName === 'svg')) {
            isDragging = true;
            lastMouse = { x: e.clientX, y: e.clientY };
            container.style.cursor = 'grabbing';
            e.preventDefault();
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - lastMouse.x;
        const dy = e.clientY - lastMouse.y;
        lastMouse = { x: e.clientX, y: e.clientY };

        transform = {
            ...transform,
            x: transform.x + dx,
            y: transform.y + dy
        };

        updateTransform();
    };

    const handleMouseUp = () => {
        isDragging = false;
        container.style.cursor = 'grab';
    };

    // Touch support
    let lastTouchDistance = 0;
    let lastTouchCenter = { x: 0, y: 0 };

    const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
            lastTouchCenter = {
                x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
                y: (e.touches[0].clientY + e.touches[1].clientY) / 2
            };
        } else if (e.touches.length === 1) {
            isDragging = true;
            lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const scale = distance / lastTouchDistance;

            const center = {
                x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
                y: (e.touches[0].clientY + e.touches[1].clientY) / 2
            };

            const rect = container.getBoundingClientRect();
            const cx = center.x - rect.left;
            const cy = center.y - rect.top;

            const newK = Math.max(options.minZoom, Math.min(options.maxZoom, transform.k * scale));

            transform = {
                x: cx - (cx - transform.x) * (newK / transform.k) + (center.x - lastTouchCenter.x),
                y: cy - (cy - transform.y) * (newK / transform.k) + (center.y - lastTouchCenter.y),
                k: newK
            };

            lastTouchDistance = distance;
            lastTouchCenter = center;
            updateTransform();
        } else if (e.touches.length === 1 && isDragging) {
            const dx = e.touches[0].clientX - lastMouse.x;
            const dy = e.touches[0].clientY - lastMouse.y;
            lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };

            transform = {
                ...transform,
                x: transform.x + dx,
                y: transform.y + dy
            };
            updateTransform();
        }
    };

    const handleTouchEnd = () => {
        isDragging = false;
        lastTouchDistance = 0;
    };

    // Attach events
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    container.style.cursor = 'grab';

    return {
        get transform() { return transform; },

        setTransform(newTransform: Transform) {
            transform = newTransform;
            updateTransform();
        },

        zoomIn(center?: { x: number; y: number }) {
            const cx = center?.x ?? container.clientWidth / 2;
            const cy = center?.y ?? container.clientHeight / 2;
            const newK = Math.min(options.maxZoom, transform.k * 1.2);
            transform = {
                x: cx - (cx - transform.x) * (newK / transform.k),
                y: cy - (cy - transform.y) * (newK / transform.k),
                k: newK
            };
            updateTransform();
        },

        zoomOut(center?: { x: number; y: number }) {
            const cx = center?.x ?? container.clientWidth / 2;
            const cy = center?.y ?? container.clientHeight / 2;
            const newK = Math.max(options.minZoom, transform.k / 1.2);
            transform = {
                x: cx - (cx - transform.x) * (newK / transform.k),
                y: cy - (cy - transform.y) * (newK / transform.k),
                k: newK
            };
            updateTransform();
        },

        fitToScreen(bounds: { minX: number; maxX: number; minY: number; maxY: number }) {
            const padding = 60;
            const contentWidth = bounds.maxX - bounds.minX + padding * 2;
            const contentHeight = bounds.maxY - bounds.minY + padding * 2;

            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            const scaleX = containerWidth / contentWidth;
            const scaleY = containerHeight / contentHeight;
            const scale = Math.min(scaleX, scaleY, 1) * 0.9;

            const midX = (bounds.minX + bounds.maxX) / 2;
            const midY = (bounds.minY + bounds.maxY) / 2;

            transform = {
                x: containerWidth / 2 - midX * scale,
                y: containerHeight / 2 - midY * scale,
                k: scale
            };

            updateTransform();
        },

        reset() {
            transform = { x: 0, y: 0, k: 1 };
            updateTransform();
        },

        destroy() {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        }
    };
}
