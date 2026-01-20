/**
 * Edge rendering module
 */
import type { IWorkflowNode, IWorkflowEdge, WorkflowOptions } from './types';

export interface EdgeRenderOptions {
    nodeWidth: number;
    nodeHeight: number;
    direction: 'horizontal' | 'vertical';
    animated: boolean;
}

/**
 * Get connection point for a node based on its type
 */
function getNodeConnectionPoint(
    node: IWorkflowNode,
    side: 'left' | 'right' | 'top' | 'bottom',
    nodeWidth: number,
    nodeHeight: number
): { x: number; y: number } {
    const isCircle = node.nodeType === 'start' || node.nodeType === 'end';
    const cx = node.position.x + nodeWidth / 2;
    const cy = node.position.y + nodeHeight / 2;

    if (isCircle) {
        // For circle nodes, calculate point on circle edge
        const r = Math.min(nodeWidth, nodeHeight) / 2;
        switch (side) {
            case 'right': return { x: cx + r, y: cy };
            case 'left': return { x: cx - r, y: cy };
            case 'bottom': return { x: cx, y: cy + r };
            case 'top': return { x: cx, y: cy - r };
        }
    } else if (node.nodeType === 'decision') {
        // Diamond - offset slightly for better visual
        switch (side) {
            case 'right': return { x: node.position.x + nodeWidth, y: cy };
            case 'left': return { x: node.position.x, y: cy };
            case 'bottom': return { x: cx, y: node.position.y + nodeHeight };
            case 'top': return { x: cx, y: node.position.y };
        }
    }

    // Rectangle nodes
    switch (side) {
        case 'right': return { x: node.position.x + nodeWidth, y: cy };
        case 'left': return { x: node.position.x, y: cy };
        case 'bottom': return { x: cx, y: node.position.y + nodeHeight };
        case 'top': return { x: cx, y: node.position.y };
    }
}

/**
 * Calculate edge path between nodes
 */
export function calculateEdgePath(
    from: IWorkflowNode,
    to: IWorkflowNode,
    options: EdgeRenderOptions
): string {
    const { nodeWidth, nodeHeight, direction } = options;

    let start: { x: number; y: number };
    let end: { x: number; y: number };

    if (direction === 'horizontal') {
        start = getNodeConnectionPoint(from, 'right', nodeWidth, nodeHeight);
        end = getNodeConnectionPoint(to, 'left', nodeWidth, nodeHeight);

        // Improved Bezier with distance-proportional control points
        const dx = end.x - start.x;
        const controlOffset = Math.min(Math.abs(dx) * 0.4, 60);
        return `M${start.x},${start.y} C${start.x + controlOffset},${start.y} ${end.x - controlOffset},${end.y} ${end.x},${end.y}`;
    } else {
        start = getNodeConnectionPoint(from, 'bottom', nodeWidth, nodeHeight);
        end = getNodeConnectionPoint(to, 'top', nodeWidth, nodeHeight);

        const dy = end.y - start.y;
        const controlOffset = Math.min(Math.abs(dy) * 0.4, 50);
        return `M${start.x},${start.y} C${start.x},${start.y + controlOffset} ${end.x},${end.y - controlOffset} ${end.x},${end.y}`;
    }
}

/**
 * Update an existing edge path (for real-time drag updates)
 */
export function updateEdgePath(
    path: SVGPathElement,
    from: IWorkflowNode,
    to: IWorkflowNode,
    options: EdgeRenderOptions
): void {
    const pathD = calculateEdgePath(from, to, options);
    path.setAttribute('d', pathD);
}

/**
 * Update edge label position
 */
export function updateEdgeLabelPosition(
    label: SVGForeignObjectElement,
    from: IWorkflowNode,
    to: IWorkflowNode,
    options: EdgeRenderOptions
): void {
    const { nodeWidth, nodeHeight, direction } = options;

    const start = direction === 'horizontal'
        ? getNodeConnectionPoint(from, 'right', nodeWidth, nodeHeight)
        : getNodeConnectionPoint(from, 'bottom', nodeWidth, nodeHeight);
    const end = direction === 'horizontal'
        ? getNodeConnectionPoint(to, 'left', nodeWidth, nodeHeight)
        : getNodeConnectionPoint(to, 'top', nodeWidth, nodeHeight);

    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;

    label.setAttribute('x', `${midX - 40}`);
    label.setAttribute('y', `${midY - 12}`);
}

/**
 * Render an edge
 */
export function renderEdge(
    group: SVGGElement,
    edge: IWorkflowEdge,
    fromNode: IWorkflowNode,
    toNode: IWorkflowNode,
    options: WorkflowOptions,
    scopeId: string
): void {
    const isActive = fromNode.status === 'active' || fromNode.status === 'completed';

    const pathD = calculateEdgePath(fromNode, toNode, {
        nodeWidth: options.nodeWidth,
        nodeHeight: options.nodeHeight,
        direction: options.direction,
        animated: options.animated
    });

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', isActive ? '#3b82f6' : '#94a3b8');
    path.setAttribute('stroke-width', isActive ? '2' : '1.5');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('marker-end', isActive ? `url(#${scopeId}-arrowhead-active)` : `url(#${scopeId}-arrowhead)`);
    path.setAttribute('class', `workflow-edge edge-${edge.edgeType}`);
    path.setAttribute('data-id', edge.id);
    path.setAttribute('data-from', edge.from);
    path.setAttribute('data-to', edge.to);

    // Animated dash for active edges
    if (options.animated && (isActive || edge.animated)) {
        path.setAttribute('stroke-dasharray', '8,4');
        const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        anim.setAttribute('attributeName', 'stroke-dashoffset');
        anim.setAttribute('from', '24');
        anim.setAttribute('to', '0');
        anim.setAttribute('dur', '1.5s');
        anim.setAttribute('repeatCount', 'indefinite');
        path.appendChild(anim);
    }

    group.appendChild(path);

    // Edge label
    if (edge.label) {
        const { nodeWidth, nodeHeight, direction } = options;
        const start = direction === 'horizontal'
            ? getNodeConnectionPoint(fromNode, 'right', nodeWidth, nodeHeight)
            : getNodeConnectionPoint(fromNode, 'bottom', nodeWidth, nodeHeight);
        const end = direction === 'horizontal'
            ? getNodeConnectionPoint(toNode, 'left', nodeWidth, nodeHeight)
            : getNodeConnectionPoint(toNode, 'top', nodeWidth, nodeHeight);

        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;

        const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        fo.setAttribute('x', `${midX - 40}`);
        fo.setAttribute('y', `${midY - 12}`);
        fo.setAttribute('width', '80');
        fo.setAttribute('height', '24');
        fo.setAttribute('data-edge-label', edge.id);
        fo.style.pointerEvents = 'none';

        fo.innerHTML = `<div class="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 text-center shadow-sm truncate">${edge.label}</div>`;
        group.appendChild(fo);
    }
}
