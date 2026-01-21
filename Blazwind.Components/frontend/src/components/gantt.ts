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

        requestAnimationFrame(() => {
            if (!currentBar) return;

            if (isResizing) {
                if (isResizeLeft) {
                    // Resize from left - change start date
                    const newLeft = initialLeft + deltaX;
                    const newWidth = initialWidth - deltaX;
                    if (newWidth >= 16) {
                        currentBar.style.left = `${newLeft}px`;
                        currentBar.style.width = `${newWidth}px`;
                        updateDependencies(container, taskId, newLeft, newLeft + newWidth, parseFloat(currentBar.style.top));
                    }
                } else {
                    // Resize from right - change end date
                    const newWidth = initialWidth + deltaX;
                    if (newWidth >= 16) {
                        currentBar.style.width = `${newWidth}px`;
                        updateDependencies(container, taskId, initialLeft, initialLeft + newWidth, parseFloat(currentBar.style.top));
                    }
                }
            } else if (isDragging) {
                // Move the bar
                const newLeft = initialLeft + deltaX;
                currentBar.style.left = `${newLeft}px`;
                updateDependencies(container, taskId, newLeft, newLeft + initialWidth, parseFloat(currentBar.style.top));
            }
        });
    };

    // Helper to update SVG paths
    const updateDependencies = (container: HTMLElement, taskId: string, left: number, right: number, top: number) => {
        const svg = container.querySelector('svg');
        if (!svg) return;

        const gap = 30; // Curve smoothness
        const barHeight = 20; // Hardcoded mostly
        const taskCenterY = top + barHeight / 2; // Approximate center relative to task top

        // Update lines originating FROM this task
        const linesFrom = svg.querySelectorAll(`path[data-from="${taskId}"]`);
        linesFrom.forEach(line => {
            const path = line.getAttribute('d');
            if (!path) return;

            // Parse path: split by space or comma, filter empty
            const parts = path.split(/[ ,]+/).filter(p => p.trim() !== '');
            // Expected format: M x1 y1 C cx1 cy1 cx2 cy2 x2 y2
            // Length should be 10: [M, x1, y1, C, cx1, cy1, cx2, cy2, x2, y2]

            if (parts.length < 10) return;

            // Target is fixed (x2, y2) -> last two numbers
            const x2 = parseFloat(parts[parts.length - 2]);
            const y2 = parseFloat(parts[parts.length - 1]);

            const x1 = right;
            const y1 = taskCenterY;

            const newPath = `M ${x1} ${y1} C ${x1 + gap} ${y1}, ${x2 - gap} ${y2}, ${x2} ${y2}`;
            line.setAttribute('d', newPath);
        });

        // Update lines pointing TO this task
        const linesTo = svg.querySelectorAll(`path[data-to="${taskId}"]`);
        linesTo.forEach(line => {
            const path = line.getAttribute('d');
            if (!path) return;

            const parts = path.split(/[ ,]+/).filter(p => p.trim() !== '');
            if (parts.length < 10) return;

            // Source is fixed (x1, y1) -> M x1 y1 ...
            const x1 = parseFloat(parts[1]);
            const y1 = parseFloat(parts[2]);

            const x2 = left;
            const y2 = taskCenterY; // Center of current task

            const newPath = `M ${x1} ${y1} C ${x1 + gap} ${y1}, ${x2 - gap} ${y2}, ${x2} ${y2}`;
            line.setAttribute('d', newPath);
        });
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
        // Notify Blazor
        if (isDragging) {
            if (daysMoved !== 0) {
                await instance.netRef.invokeMethodAsync('HandleTaskDragFromJs', taskId, daysMoved);
            } else {
                // It was a click (no movement), invoke click handler
                await instance.netRef.invokeMethodAsync('HandleTaskClickFromJs', taskId);
            }
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

    // Setup task list resize
    setupTaskListResize(id);

    // Setup zoom
    setupZoom(id);
}

function setupZoom(id: string): void {
    const instance = instances.get(id);
    if (!instance) return;

    const container = instance.container;
    const timeline = container.querySelector('.relative') as HTMLElement; // The scrollable timeline part

    if (timeline) {
        timeline.addEventListener('wheel', async (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault();
                const delta = e.deltaY;
                // Debounce/Throttle could be good here but direct call is more responsive for small steps
                await instance.netRef.invokeMethodAsync('HandleZoomFromJs', delta);
            }
        }, { passive: false });
    }
}

/**
 * Setup task list panel resize handler
 */
function setupTaskListResize(id: string): void {
    const instance = instances.get(id);
    if (!instance) return;

    const container = instance.container;
    const taskList = container.querySelector('.bw-gantt-task-list') as HTMLElement;
    const resizeHandle = container.querySelector('.bw-gantt-task-list .bw-gantt-resize-handle') as HTMLElement;

    if (!taskList || !resizeHandle) return;

    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    resizeHandle.addEventListener('mousedown', (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        isResizing = true;
        startX = e.clientX;
        startWidth = taskList.offsetWidth;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        const onMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            const delta = e.clientX - startX;
            const newWidth = Math.max(150, Math.min(startWidth + delta, 500));
            taskList.style.width = `${newWidth}px`;
        };

        const onMouseUp = async () => {
            if (!isResizing) return;
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';

            const finalWidth = taskList.offsetWidth;
            await instance.netRef.invokeMethodAsync('HandleTaskListResize', finalWidth);

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

export function dispose(id: string): void {
    instances.delete(id);
}

