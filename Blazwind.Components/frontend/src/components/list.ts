/**
 * Blazwind List Module
 * Sortable list functionality
 */

let draggedItem: HTMLElement | null = null;
let originalIndex: number = -1;

export function initializeSortable(listId: string, dotNetRef: any, enable: boolean = true): void {
    const list = document.getElementById(listId);
    if (!list) return;

    // Check if already initialized to prevent duplicate container listeners
    if (list.dataset.sortableInitialized === "true") {
        updateSortable(listId, enable);
        return;
    }
    list.dataset.sortableInitialized = "true";

    updateSortable(listId, enable);

    list.addEventListener('dragover', (e: Event) => {
        // Global check: if sorting is disabled for this list, do nothing
        if (list.dataset.sortableEnabled !== "true") return;

        const dragEvent = e as DragEvent;
        dragEvent.preventDefault(); // Allow drop

        if (!draggedItem) return;

        const afterElement = getDragAfterElement(list, dragEvent.clientY);

        if (afterElement == null) {
            list.appendChild(draggedItem);
        } else {
            list.insertBefore(draggedItem, afterElement as Node);
        }
    });

    list.addEventListener('drop', () => {
        // Global check
        if (list.dataset.sortableEnabled !== "true") return;

        if (draggedItem) {
            // Recalculate index based on DOM
            const newIndex = Array.from(list.children).indexOf(draggedItem);

            dotNetRef.invokeMethodAsync('HandleDrop', originalIndex, newIndex);

            draggedItem.classList.remove('opacity-50', 'bg-gray-50', 'dark:bg-gray-800');
            draggedItem = null;
        }
    });
}

export function updateSortable(listId: string, enable: boolean): void {
    const el = document.getElementById(listId);
    if (!el) return;

    el.dataset.sortableEnabled = enable.toString();

    if (enable) {
        setupItems(el);
    } else {
        disableItems(el);
    }
}

function disableItems(container: HTMLElement) {
    const items = container.children;
    for (let i = 0; i < items.length; i++) {
        const el = items[i] as HTMLElement;
        el.removeAttribute('draggable');
        // We don't remove event listeners effectively without references or AbortController,
        // but removing the draggable attribute stops the dragstart event from doing anything meaningful natively.
        // Also, our dragstart handler can check for the attribute if needed, but the browser won't initiate drag.
    }
}

function setupItems(container: HTMLElement) {
    // Only target direct children that are designed to be draggable
    // In Blazor, they might re-render, so we rely on the class .bw-draggable
    const items = container.querySelectorAll('.bw-draggable');
    items.forEach((item, index) => {
        const el = item as HTMLElement;

        // Even if bound, we ensure draggable is true if re-enabled
        el.setAttribute('draggable', 'true');
        el.dataset.index = index.toString();

        // Avoid double binding of event listeners
        if (el.dataset.dragBound === "true") return;
        el.dataset.dragBound = "true";

        el.addEventListener('dragstart', (e: Event) => {
            if (container.dataset.sortableEnabled !== "true") {
                e.preventDefault();
                return;
            }

            draggedItem = el;
            originalIndex = Array.from(container.children).indexOf(el);
            (e as DragEvent).dataTransfer!.effectAllowed = 'move';

            // Add visual feedback
            requestAnimationFrame(() => {
                el.classList.add('opacity-50', 'bg-gray-50', 'dark:bg-gray-800');
            });
        });

        el.addEventListener('dragend', () => {
            el.classList.remove('opacity-50', 'bg-gray-50', 'dark:bg-gray-800');
            // draggedItem = null; // intentional keep for drop logic
        });
    });
}

function getDragAfterElement(container: HTMLElement, y: number) {
    const draggableElements = [...container.querySelectorAll('.bw-draggable:not(.opacity-50)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY, element: null as unknown as Element }).element;
}
