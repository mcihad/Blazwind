/**
 * DataGrid Column Drag & Drop Reorder Module
 * Enables users to drag column headers to reorder them
 */

interface ColumnDragOptions {
    containerId: string;
    onReorder: (fromIndex: number, toIndex: number) => void;
}

let draggedColumn: HTMLElement | null = null;
let draggedIndex: number = -1;
let targetIndex: number = -1;
let dotNetRef: any = null;

export function initColumnDrag(ref: any, options: ColumnDragOptions): void {
    dotNetRef = ref;
    const container = document.getElementById(options.containerId);
    if (!container) return;

    const headerRow = container.querySelector('thead tr:first-child');
    if (!headerRow) return;

    const headers = headerRow.querySelectorAll('th[data-draggable="true"]');

    headers.forEach((header, index) => {
        const th = header as HTMLElement;
        th.setAttribute('draggable', 'true');
        th.style.cursor = 'grab';
        th.dataset.columnIndex = index.toString();

        th.addEventListener('dragstart', handleDragStart);
        th.addEventListener('dragend', handleDragEnd);
        th.addEventListener('dragover', handleDragOver);
        th.addEventListener('drop', handleDrop);
        th.addEventListener('dragenter', handleDragEnter);
        th.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e: DragEvent): void {
    draggedColumn = e.target as HTMLElement;
    draggedIndex = parseInt(draggedColumn.dataset.columnIndex || '-1');

    draggedColumn.style.opacity = '0.5';
    draggedColumn.style.cursor = 'grabbing';

    if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedIndex.toString());
    }
}

function handleDragEnd(_e: DragEvent): void {
    if (draggedColumn) {
        draggedColumn.style.opacity = '1';
        draggedColumn.style.cursor = 'grab';
    }

    // Remove all drop indicators
    document.querySelectorAll('.column-drop-indicator').forEach(el => el.remove());
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

    draggedColumn = null;
    draggedIndex = -1;
    targetIndex = -1;
}

function handleDragOver(e: DragEvent): void {
    e.preventDefault();
    if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
    }
}

function handleDragEnter(e: DragEvent): void {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const th = target.closest('th') as HTMLElement;

    if (th && th !== draggedColumn) {
        th.classList.add('drag-over');
        th.style.borderLeft = '3px solid #3b82f6';
    }
}

function handleDragLeave(e: DragEvent): void {
    const target = e.target as HTMLElement;
    const th = target.closest('th') as HTMLElement;

    if (th) {
        th.classList.remove('drag-over');
        th.style.borderLeft = '';
    }
}

function handleDrop(e: DragEvent): void {
    e.preventDefault();

    const target = e.target as HTMLElement;
    const th = target.closest('th') as HTMLElement;

    if (th && draggedColumn && th !== draggedColumn) {
        targetIndex = parseInt(th.dataset.columnIndex || '-1');

        if (draggedIndex >= 0 && targetIndex >= 0 && draggedIndex !== targetIndex) {
            // Notify Blazor of the reorder
            if (dotNetRef) {
                dotNetRef.invokeMethodAsync('OnColumnReorder', draggedIndex, targetIndex);
            }
        }
    }

    // Clean up
    if (th) {
        th.classList.remove('drag-over');
        th.style.borderLeft = '';
    }
}

export function disposeColumnDrag(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    const headers = container.querySelectorAll('th[data-draggable="true"]');
    headers.forEach(header => {
        const th = header as HTMLElement;
        th.removeAttribute('draggable');
        th.style.cursor = '';
        th.removeEventListener('dragstart', handleDragStart);
        th.removeEventListener('dragend', handleDragEnd);
        th.removeEventListener('dragover', handleDragOver);
        th.removeEventListener('drop', handleDrop);
        th.removeEventListener('dragenter', handleDragEnter);
        th.removeEventListener('dragleave', handleDragLeave);
    });

    dotNetRef = null;
}
