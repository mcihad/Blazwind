/**
 * Gantt Chart - Drag and Resize functionality with JS Interop
 */

interface GanttInstance {
    container: HTMLElement;
    netRef: any;
    daysPerColumn: number;
    columnWidth: number;
    rowHeight: number;
}

const instances: Map<string, GanttInstance> = new Map();

export function init(
    container: HTMLElement,
    netRef: any,
    daysPerColumn: number,
    columnWidth: number,
    rowHeight: number
): string {
    const id = `gantt-${crypto.randomUUID()}`;

    const instance: GanttInstance = {
        container,
        netRef,
        daysPerColumn,
        columnWidth,
        rowHeight
    };

    instances.set(id, instance);
    setupDragHandlers(id);

    return id;
}

export function updateOptions(id: string, daysPerColumn: number, columnWidth: number): void {
    const instance = instances.get(id);
    if (instance) {
        instance.daysPerColumn = daysPerColumn;
        instance.columnWidth = columnWidth;
    }
}

function setupDragHandlers(id: string): void {
    const instance = instances.get(id);
    if (!instance) return;

    const container = instance.container;

    // Variables for drag state
    let isDragging = false;
    let isResizing = false;
    let isResizeLeft = false;
    let currentBar: HTMLElement | null = null;
    let startX = 0;
    let initialLeft = 0;
    let initialWidth = 0;
    let taskId = '';

    // Mouse move handler
    const onMouseMove = (e: MouseEvent) => {
        if (!currentBar) return;

        const deltaX = e.clientX - startX;

        if (isResizing) {
            if (isResizeLeft) {
                // Resize from left - change start date
                const newLeft = initialLeft + deltaX;
                const newWidth = initialWidth - deltaX;
                if (newWidth >= 16) {
                    currentBar.style.left = `${newLeft}px`;
                    currentBar.style.width = `${newWidth}px`;
                }
            } else {
                // Resize from right - change end date
                const newWidth = initialWidth + deltaX;
                if (newWidth >= 16) {
                    currentBar.style.width = `${newWidth}px`;
                }
            }
        } else if (isDragging) {
            // Move the bar
            currentBar.style.left = `${initialLeft + deltaX}px`;
        }
    };

    // Mouse up handler
    const onMouseUp = async () => {
        if (!currentBar || (!isDragging && !isResizing)) {
            cleanup();
            return;
        }

        const finalLeft = parseFloat(currentBar.style.left);
        const finalWidth = parseFloat(currentBar.style.width);

        // Calculate day changes
        const leftDelta = finalLeft - initialLeft;
        const widthDelta = finalWidth - initialWidth;

        const daysMoved = Math.round(leftDelta / instance.columnWidth * instance.daysPerColumn);
        const daysResizedStart = isResizing && isResizeLeft
            ? Math.round(leftDelta / instance.columnWidth * instance.daysPerColumn)
            : 0;
        const daysResizedEnd = isResizing && !isResizeLeft
            ? Math.round(widthDelta / instance.columnWidth * instance.daysPerColumn)
            : 0;

        // Notify Blazor
        if (isDragging && daysMoved !== 0) {
            await instance.netRef.invokeMethodAsync('HandleTaskDragFromJs', taskId, daysMoved);
        } else if (isResizing && (daysResizedStart !== 0 || daysResizedEnd !== 0)) {
            await instance.netRef.invokeMethodAsync('HandleTaskResizeFromJs', taskId, daysResizedStart, daysResizedEnd);
        }

        cleanup();
    };

    const cleanup = () => {
        if (currentBar) {
            currentBar.classList.remove('bw-gantt-dragging');
        }
        isDragging = false;
        isResizing = false;
        currentBar = null;
        taskId = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    // Attach handlers to container (event delegation)
    container.addEventListener('mousedown', (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        // Check for resize handle
        const resizeHandle = target.closest('.bw-gantt-resize-handle') as HTMLElement;
        if (resizeHandle) {
            e.preventDefault();
            e.stopPropagation();
            isResizing = true;
            isResizeLeft = resizeHandle.classList.contains('bw-gantt-resize-left');
            currentBar = target.closest('.bw-gantt-bar') as HTMLElement;
            if (currentBar) {
                taskId = currentBar.dataset.taskId || '';
                startX = e.clientX;
                initialLeft = parseFloat(currentBar.style.left) || 0;
                initialWidth = parseFloat(currentBar.style.width) || 100;
                currentBar.classList.add('bw-gantt-dragging');

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            }
            return;
        }

        // Check for task bar (drag)
        const taskBar = target.closest('.bw-gantt-bar') as HTMLElement;
        if (taskBar && !target.closest('.bw-gantt-resize-handle')) {
            e.preventDefault();
            isDragging = true;
            currentBar = taskBar;
            taskId = taskBar.dataset.taskId || '';
            startX = e.clientX;
            initialLeft = parseFloat(currentBar.style.left) || 0;
            initialWidth = parseFloat(currentBar.style.width) || 100;
            currentBar.classList.add('bw-gantt-dragging');

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
    });
}

export function dispose(id: string): void {
    instances.delete(id);
}
