/**
 * Base node rendering utilities
 */
import type { IWorkflowNode, WorkflowOptions, StatusStyle } from '../types';
import { registerNodeRenderer } from './registry';

/**
 * Create the base node group with common setup
 */
export function createNodeGroup(node: IWorkflowNode, interactive: boolean): SVGGElement {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', `workflow-node node-${node.status} node-type-${node.nodeType}`);
    g.setAttribute('data-id', node.id);
    g.style.cursor = interactive ? 'pointer' : 'default';
    g.style.transition = 'filter 0.2s ease';
    return g;
}

/**
 * Create a foreignObject for icon and label
 */
export function createNodeContent(
    node: IWorkflowNode,
    x: number,
    y: number,
    width: number,
    height: number,
    style: StatusStyle,
    showLabels: boolean
): SVGForeignObjectElement {
    const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    fo.setAttribute('x', `${x}`);
    fo.setAttribute('y', `${y}`);
    fo.setAttribute('width', `${width}`);
    fo.setAttribute('height', `${height}`);
    fo.style.pointerEvents = 'none';

    const div = document.createElement('div');
    div.className = 'w-full h-full flex items-center justify-center p-2 text-center flex-col';
    div.style.color = style.text;

    if (node.icon) {
        div.innerHTML += `<i class="${node.icon} text-lg mb-1" style="color: ${style.iconColor}"></i>`;
    }

    if (showLabels) {
        div.innerHTML += `<span class="text-xs font-semibold leading-tight line-clamp-2">${node.label}</span>`;
        if (node.description) {
            div.innerHTML += `<span class="text-[9px] opacity-70 mt-0.5 line-clamp-1">${node.description}</span>`;
        }
    }

    fo.appendChild(div);
    return fo;
}

/**
 * Add hover effects to a node
 */
export function addHoverEffects(g: SVGGElement, shape: SVGElement): void {
    g.addEventListener('mouseenter', () => {
        shape.setAttribute('stroke-width', '2.5');
        shape.style.filter = 'brightness(1.02)';
    });
    g.addEventListener('mouseleave', () => {
        shape.setAttribute('stroke-width', '1.5');
        shape.style.filter = '';
    });
}

/**
 * Render a task node (rounded rectangle)
 */
export function renderTaskNode(
    group: SVGGElement,
    node: IWorkflowNode,
    options: WorkflowOptions,
    style: StatusStyle,
    scopeId: string
): void {
    const { nodeWidth, nodeHeight, interactive, showLabels } = options;
    const { x, y } = node.position;

    const g = createNodeGroup(node, interactive);

    // Rectangle shape
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', `${x}`);
    rect.setAttribute('y', `${y}`);
    rect.setAttribute('width', `${nodeWidth}`);
    rect.setAttribute('height', `${nodeHeight}`);
    rect.setAttribute('rx', '12');
    rect.setAttribute('fill', `url(#${scopeId}-grad-${node.status})`);
    rect.setAttribute('stroke', style.border);
    rect.setAttribute('stroke-width', '1.5');
    rect.setAttribute('filter', node.status === 'active' ? `url(#${scopeId}-glow)` : `url(#${scopeId}-shadow)`);

    g.appendChild(rect);
    g.appendChild(createNodeContent(node, x, y, nodeWidth, nodeHeight, style, showLabels));

    if (interactive) {
        addHoverEffects(g, rect);
    }

    group.appendChild(g);
}

/**
 * Render a start/end node (circle)
 */
export function renderCircleNode(
    group: SVGGElement,
    node: IWorkflowNode,
    options: WorkflowOptions,
    style: StatusStyle,
    scopeId: string,
    isEnd: boolean = false
): void {
    const { nodeWidth, nodeHeight, interactive, showLabels } = options;
    const { x, y } = node.position;

    const g = createNodeGroup(node, interactive);

    const r = Math.min(nodeWidth, nodeHeight) / 2;
    const cx = x + nodeWidth / 2;
    const cy = y + nodeHeight / 2;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', `${cx}`);
    circle.setAttribute('cy', `${cy}`);
    circle.setAttribute('r', `${r}`);
    circle.setAttribute('fill', `url(#${scopeId}-grad-${node.status})`);
    circle.setAttribute('stroke', style.border);
    circle.setAttribute('stroke-width', isEnd ? '3' : '1.5');
    circle.setAttribute('filter', node.status === 'active' ? `url(#${scopeId}-glow)` : `url(#${scopeId}-shadow)`);

    g.appendChild(circle);
    g.appendChild(createNodeContent(node, x, y, nodeWidth, nodeHeight, style, showLabels));

    if (interactive) {
        addHoverEffects(g, circle);
    }

    group.appendChild(g);
}

/**
 * Render a decision node (diamond)
 */
export function renderDecisionNode(
    group: SVGGElement,
    node: IWorkflowNode,
    options: WorkflowOptions,
    style: StatusStyle,
    scopeId: string
): void {
    const { nodeWidth, nodeHeight, interactive, showLabels } = options;
    const { x, y } = node.position;

    const g = createNodeGroup(node, interactive);

    const cx = x + nodeWidth / 2;
    const cy = y + nodeHeight / 2;
    const w = nodeWidth;
    const h = nodeHeight;

    const diamond = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    diamond.setAttribute('points', `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`);
    diamond.setAttribute('fill', `url(#${scopeId}-grad-${node.status})`);
    diamond.setAttribute('stroke', style.border);
    diamond.setAttribute('stroke-width', '1.5');
    diamond.setAttribute('filter', node.status === 'active' ? `url(#${scopeId}-glow)` : `url(#${scopeId}-shadow)`);

    g.appendChild(diamond);
    g.appendChild(createNodeContent(node, x, y, nodeWidth, nodeHeight, style, showLabels));

    if (interactive) {
        addHoverEffects(g, diamond);
    }

    group.appendChild(g);
}

// Register default renderers
registerNodeRenderer('task', renderTaskNode);
registerNodeRenderer('start', (g, n, o, s, id) => renderCircleNode(g, n, o, s, id, false));
registerNodeRenderer('end', (g, n, o, s, id) => renderCircleNode(g, n, o, s, id, true));
registerNodeRenderer('decision', renderDecisionNode);
registerNodeRenderer('parallel', renderTaskNode); // Use task style for parallel
registerNodeRenderer('subprocess', renderTaskNode); // Use task style for subprocess
