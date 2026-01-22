/**
 * DataGrid Column Resize Module
 * Enables users to resize columns by dragging column borders
 */

interface ResizeOptions {
    containerId: string;
    minWidth: number;
    maxWidth: number;
    autoFit?: boolean;
}

interface InstanceData {
    dotNetRef: any;
    options: ResizeOptions;
}

// Store instance data for each grid container
const instanceMap = new Map<string, InstanceData>();

// Active resize state
let isResizing = false;
let currentTh: HTMLElement | null = null;
let currentColumnId: string | null = null;
let startX: number = 0;
let startWidth: number = 0;
let activeInstance: InstanceData | null = null;

export function initColumnResize(ref: any, resizeOptions: ResizeOptions): void {
    // Store instance data
    instanceMap.set(resizeOptions.containerId, {
        dotNetRef: ref,
        options: resizeOptions
    });

    const container = document.getElementById(resizeOptions.containerId);
    if (!container) {
        console.warn('ColumnResize: Container not found:', resizeOptions.containerId);
        return;
    }

    // Find all resize handles with data-resize-handle attribute
    const resizeHandles = container.querySelectorAll('[data-resize-handle]');

    if (resizeHandles.length === 0) {
        console.warn('ColumnResize: No resize handles found in container');
        return;
    }

    resizeHandles.forEach((handle) => {
        const resizeHandle = handle as HTMLElement;
        const columnId = resizeHandle.getAttribute('data-resize-handle');

        // Find parent th element
        const th = resizeHandle.closest('th') as HTMLElement;
        if (th) {
            // Ensure th has relative positioning for absolute handle
            th.style.position = 'relative';
        }

        // Mouse events (pass containerId to identify instance)
        resizeHandle.addEventListener('mousedown', (e) => handleMouseDown(e, th, columnId, resizeOptions.containerId));
    });

    // Global mouse events - ensure we only add them once
    // Note: Checking strictly might be tricky if module is re-executed, 
    // but in this setup we rely on idempotence or just adding safely.
    // Ideally we should manage global listeners better, but for now we keep existing pattern 
    // just updated implementation. 
    // Actually, to prevent duplicates, we can check if it's the first instance.
    if (instanceMap.size === 1) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

    }
}

function handleMouseDown(e: MouseEvent, th: HTMLElement | null, columnId: string | null, containerId: string): void {
    if (!th || !columnId) return;

    const instance = instanceMap.get(containerId);
    if (!instance) return;

    activeInstance = instance;

    e.preventDefault();
    e.stopPropagation();

    // Freeze all column widths to prevent shrinking other columns
    const parentTr = th.closest('tr');
    if (parentTr) {
        const headers = parentTr.querySelectorAll('th');
        headers.forEach(header => {
            const width = header.getBoundingClientRect().width;
            header.style.width = `${width}px`;
            header.style.minWidth = `${width}px`;
        });

        // If AutoFit is enabled, switch to table-layout: fixed and width: auto
        // to force the table to grow instead of redistributing space
        if (activeInstance && activeInstance.options.autoFit) {
            const table = parentTr.closest('table');
            if (table) {
                table.style.tableLayout = 'fixed';
                table.style.width = 'auto';
            }
        }
    }

    currentTh = th;
    currentColumnId = columnId;
    isResizing = true;
    startX = e.pageX;
    startWidth = th.getBoundingClientRect().width;

    currentTh.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    // Add visual feedback
    currentTh.classList.add('resizing');
}

function handleMouseMove(e: MouseEvent): void {
    if (!isResizing || !currentTh || !activeInstance) return;

    const diff = e.pageX - startX;
    let newWidth = startWidth + diff;

    // Apply constraints
    newWidth = Math.max(activeInstance.options.minWidth, newWidth);
    if (activeInstance.options.maxWidth > 0) {
        newWidth = Math.min(activeInstance.options.maxWidth, newWidth);
    }

    currentTh.style.width = `${newWidth}px`;
    currentTh.style.minWidth = `${newWidth}px`;
}

function handleMouseUp(_e: MouseEvent): void {
    if (!isResizing || !currentTh) return;

    isResizing = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    currentTh.style.userSelect = '';
    currentTh.classList.remove('resizing');

    // Notify Blazor of the new width
    const newWidth = currentTh.getBoundingClientRect().width; // Use precise width

    if (currentColumnId && activeInstance) {
        activeInstance.dotNetRef.invokeMethodAsync('OnColumnResized', currentColumnId, newWidth);
    }

    currentTh = null;
    currentColumnId = null;
    activeInstance = null;
}

export function disposeColumnResize(containerId: string): void {
    instanceMap.delete(containerId);

    // Remove global listeners if no instances left
    if (instanceMap.size === 0) {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
}
