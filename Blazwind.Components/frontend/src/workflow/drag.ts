/**
 * Drag controller for workflow nodes
 */
import type { IWorkflowNode, NodePosition, WorkflowOptions } from './types';
import type { Transform } from './pan-zoom';

export interface DragController {
    enable(): void;
    disable(): void;
    destroy(): void;
}

export interface DragCallbacks {
    onDragStart?: (nodeId: string, position: NodePosition) => void;
    onDrag?: (nodeId: string, position: NodePosition) => void;
    onDragEnd?: (nodeId: string, oldPosition: NodePosition, newPosition: NodePosition) => void;
}

/**
 * Create a drag controller for workflow nodes
 */
export function createDragController(
    _container: HTMLElement,
    nodesGroup: SVGGElement,
    getNodes: () => IWorkflowNode[],
    getTransform: () => Transform,
    options: WorkflowOptions,
    callbacks: DragCallbacks
): DragController {
    let enabled = options.draggable;
    let draggedNode: IWorkflowNode | null = null;
    let draggedElement: SVGGElement | null = null;
    let startPosition: NodePosition = { x: 0, y: 0 };
    let startMouse: NodePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
        if (!enabled) return;

        // Find the node group that was clicked
        const target = e.target as Element;
        const nodeGroup = target.closest('.workflow-node') as SVGGElement | null;
        if (!nodeGroup) return;

        const nodeId = nodeGroup.dataset.id;
        if (!nodeId) return;

        const node = getNodes().find(n => n.id === nodeId);
        if (!node) return;

        e.stopPropagation();
        e.preventDefault();

        draggedNode = node;
        draggedElement = nodeGroup;
        startPosition = { ...node.position };
        startMouse = { x: e.clientX, y: e.clientY };

        nodeGroup.style.cursor = 'grabbing';
        nodeGroup.classList.add('dragging');

        callbacks.onDragStart?.(nodeId, startPosition);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!draggedNode || !draggedElement) return;

        const transform = getTransform();
        const dx = (e.clientX - startMouse.x) / transform.k;
        const dy = (e.clientY - startMouse.y) / transform.k;

        const newPosition: NodePosition = {
            x: startPosition.x + dx,
            y: startPosition.y + dy
        };

        // Update visual position
        draggedElement.setAttribute('transform', `translate(${dx}, ${dy})`);

        callbacks.onDrag?.(draggedNode.id, newPosition);
    };

    const handleMouseUp = () => {
        if (!draggedNode || !draggedElement) return;

        // Calculate final position
        const currentTransform = draggedElement.getAttribute('transform') || '';
        const match = currentTransform.match(/translate\(([\-\d.]+),\s*([\-\d.]+)\)/);

        let newPosition = startPosition;
        if (match) {
            const dx = parseFloat(match[1]);
            const dy = parseFloat(match[2]);
            newPosition = {
                x: startPosition.x + dx,
                y: startPosition.y + dy
            };
        }

        // Reset transform - the renderer will update with new position
        draggedElement.setAttribute('transform', '');
        draggedElement.style.cursor = 'pointer';
        draggedElement.classList.remove('dragging');

        callbacks.onDragEnd?.(draggedNode.id, startPosition, newPosition);

        draggedNode = null;
        draggedElement = null;
    };

    // Touch support
    const handleTouchStart = (e: TouchEvent) => {
        if (!enabled || e.touches.length !== 1) return;

        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY) as Element;
        const nodeGroup = target?.closest('.workflow-node') as SVGGElement | null;
        if (!nodeGroup) return;

        const nodeId = nodeGroup.dataset.id;
        if (!nodeId) return;

        const node = getNodes().find(n => n.id === nodeId);
        if (!node) return;

        e.stopPropagation();

        draggedNode = node;
        draggedElement = nodeGroup;
        startPosition = { ...node.position };
        startMouse = { x: touch.clientX, y: touch.clientY };

        nodeGroup.classList.add('dragging');

        callbacks.onDragStart?.(nodeId, startPosition);
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!draggedNode || !draggedElement || e.touches.length !== 1) return;

        e.preventDefault();

        const touch = e.touches[0];
        const transform = getTransform();
        const dx = (touch.clientX - startMouse.x) / transform.k;
        const dy = (touch.clientY - startMouse.y) / transform.k;

        draggedElement.setAttribute('transform', `translate(${dx}, ${dy})`);

        callbacks.onDrag?.(draggedNode.id, {
            x: startPosition.x + dx,
            y: startPosition.y + dy
        });
    };

    const handleTouchEnd = () => {
        if (draggedNode && draggedElement) {
            const currentTransform = draggedElement.getAttribute('transform') || '';
            const match = currentTransform.match(/translate\(([-\d.]+),\s*([-\d.]+)\)/);

            let newPosition = startPosition;
            if (match) {
                newPosition = {
                    x: startPosition.x + parseFloat(match[1]),
                    y: startPosition.y + parseFloat(match[2])
                };
            }

            draggedElement.setAttribute('transform', '');
            draggedElement.classList.remove('dragging');

            callbacks.onDragEnd?.(draggedNode.id, startPosition, newPosition);
        }

        draggedNode = null;
        draggedElement = null;
    };

    // Attach to nodesGroup instead of container for node-specific events
    nodesGroup.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    nodesGroup.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return {
        enable() { enabled = true; },
        disable() { enabled = false; },
        destroy() {
            nodesGroup.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            nodesGroup.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        }
    };
}
