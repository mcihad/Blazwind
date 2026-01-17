/**
 * Workflow - BPMN-style workflow visualization component (Enhanced)
 */

export type WorkflowNodeType = 'start' | 'end' | 'task' | 'decision' | 'parallel' | 'subprocess';
export type WorkflowNodeStatus = 'pending' | 'active' | 'completed' | 'error' | 'skipped';

export interface WorkflowNode {
    id: string;
    type: WorkflowNodeType;
    label: string;
    description?: string;
    status?: WorkflowNodeStatus;
    icon?: string;
    metadata?: Record<string, any>;
}

export interface WorkflowEdge {
    id: string;
    from: string;
    to: string;
    label?: string;
    condition?: string;
}

export interface WorkflowData {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
}

export interface WorkflowOptions {
    nodeWidth?: number;
    nodeHeight?: number;
    horizontalSpacing?: number;
    verticalSpacing?: number;
    direction?: 'horizontal' | 'vertical';
    showLabels?: boolean;
    interactive?: boolean;
    animated?: boolean;
}

interface WorkflowInstance {
    container: HTMLElement;
    data: WorkflowData;
    options: WorkflowOptions;
    netRef: any;
    svg: SVGSVGElement | null;
}

const instances: Map<string, WorkflowInstance> = new Map();

// Enhanced status colors with gradients
const statusStyles: Record<WorkflowNodeStatus, {
    bgStart: string;
    bgEnd: string;
    border: string;
    text: string;
    shadow: string;
    glow: string;
}> = {
    pending: {
        bgStart: '#f9fafb', bgEnd: '#f3f4f6',
        border: '#d1d5db', text: '#6b7280',
        shadow: 'rgba(156, 163, 175, 0.3)',
        glow: 'none'
    },
    active: {
        bgStart: '#eff6ff', bgEnd: '#dbeafe',
        border: '#3b82f6', text: '#1d4ed8',
        shadow: 'rgba(59, 130, 246, 0.4)',
        glow: '#3b82f6'
    },
    completed: {
        bgStart: '#ecfdf5', bgEnd: '#d1fae5',
        border: '#10b981', text: '#059669',
        shadow: 'rgba(16, 185, 129, 0.3)',
        glow: 'none'
    },
    error: {
        bgStart: '#fef2f2', bgEnd: '#fee2e2',
        border: '#ef4444', text: '#dc2626',
        shadow: 'rgba(239, 68, 68, 0.4)',
        glow: '#ef4444'
    },
    skipped: {
        bgStart: '#f9fafb', bgEnd: '#f3f4f6',
        border: '#9ca3af', text: '#9ca3af',
        shadow: 'rgba(156, 163, 175, 0.2)',
        glow: 'none'
    }
};

// Node icons (SVG paths)
const nodeIcons: Record<WorkflowNodeType, string> = {
    start: 'M8 5v14l11-7z', // Play icon
    end: 'M6 6h12v12H6z', // Stop icon
    task: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', // Clipboard
    decision: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01', // Question
    parallel: 'M4 6h16M4 12h16M4 18h16', // Menu lines
    subprocess: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' // Boxes
};

// Status icons
const statusIcons: Record<WorkflowNodeStatus, string> = {
    pending: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', // Clock
    active: 'M13 10V3L4 14h7v7l9-11h-7z', // Lightning
    completed: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', // Check circle
    error: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', // Exclamation
    skipped: 'M13 7l5 5m0 0l-5 5m5-5H6' // Arrow right
};

export function init(
    container: HTMLElement,
    data: WorkflowData,
    options: WorkflowOptions,
    netRef: any
): string {
    const id = `wf-${crypto.randomUUID()}`;

    const instance: WorkflowInstance = {
        container,
        data,
        options: {
            nodeWidth: options.nodeWidth || 180,
            nodeHeight: options.nodeHeight || 70,
            horizontalSpacing: options.horizontalSpacing || 100,
            verticalSpacing: options.verticalSpacing || 80,
            direction: options.direction || 'horizontal',
            showLabels: options.showLabels !== false,
            interactive: options.interactive !== false,
            animated: options.animated !== false,
            ...options
        },
        netRef,
        svg: null
    };

    instances.set(id, instance);
    render(id);

    return id;
}

function render(id: string): void {
    const instance = instances.get(id);
    if (!instance) return;

    const { container, data, options } = instance;
    container.innerHTML = '';

    // Calculate positions for nodes
    const nodePositions = calculateNodePositions(data, options);

    // Calculate SVG dimensions
    const padding = 60;
    const maxX = Math.max(...Object.values(nodePositions).map(p => p.x + options.nodeWidth!)) + padding;
    const maxY = Math.max(...Object.values(nodePositions).map(p => p.y + options.nodeHeight!)) + padding;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', `${maxX}`);
    svg.setAttribute('height', `${maxY}`);
    svg.setAttribute('viewBox', `0 0 ${maxX} ${maxY}`);
    svg.style.minWidth = '100%';
    svg.style.overflow = 'visible';
    svg.style.fontFamily = 'Inter, system-ui, sans-serif';

    // Add definitions (gradients, filters, markers)
    const defs = createDefs();
    svg.appendChild(defs);

    // Render edges first
    const edgesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    edgesGroup.setAttribute('class', 'workflow-edges');
    data.edges.forEach(edge => {
        renderEdge(edgesGroup, edge, nodePositions, options, data.nodes);
    });
    svg.appendChild(edgesGroup);

    // Render nodes
    const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodesGroup.setAttribute('class', 'workflow-nodes');
    data.nodes.forEach(node => {
        const pos = nodePositions[node.id];
        if (pos) {
            renderNode(id, nodesGroup, node, pos.x, pos.y, options);
        }
    });
    svg.appendChild(nodesGroup);

    instance.svg = svg;
    container.appendChild(svg);
}

function createDefs(): SVGDefsElement {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    // Gradients for each status
    Object.entries(statusStyles).forEach(([status, style]) => {
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', `grad-${status}`);
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '0%');
        gradient.setAttribute('y2', '100%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', style.bgStart);

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', style.bgEnd);

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
    });

    // Drop shadow filter
    const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    shadow.setAttribute('id', 'shadow');
    shadow.setAttribute('x', '-20%');
    shadow.setAttribute('y', '-20%');
    shadow.setAttribute('width', '140%');
    shadow.setAttribute('height', '140%');
    shadow.innerHTML = `
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.15)" />
    `;
    defs.appendChild(shadow);

    // Glow filter for active nodes
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    glow.setAttribute('id', 'glow');
    glow.setAttribute('x', '-50%');
    glow.setAttribute('y', '-50%');
    glow.setAttribute('width', '200%');
    glow.setAttribute('height', '200%');
    glow.innerHTML = `
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
    `;
    defs.appendChild(glow);

    // Arrow marker
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '12');
    marker.setAttribute('markerHeight', '8');
    marker.setAttribute('refX', '10');
    marker.setAttribute('refY', '4');
    marker.setAttribute('orient', 'auto');
    marker.innerHTML = `<path d="M0,0 L12,4 L0,8 L3,4 Z" fill="#94a3b8" />`;
    defs.appendChild(marker);

    // Animated arrow marker
    const animMarker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    animMarker.setAttribute('id', 'arrowhead-active');
    animMarker.setAttribute('markerWidth', '12');
    animMarker.setAttribute('markerHeight', '8');
    animMarker.setAttribute('refX', '10');
    animMarker.setAttribute('refY', '4');
    animMarker.setAttribute('orient', 'auto');
    animMarker.innerHTML = `<path d="M0,0 L12,4 L0,8 L3,4 Z" fill="#3b82f6" />`;
    defs.appendChild(animMarker);

    return defs;
}

function calculateNodePositions(
    data: WorkflowData,
    options: WorkflowOptions
): Record<string, { x: number; y: number }> {
    const positions: Record<string, { x: number; y: number }> = {};
    const { nodeWidth, nodeHeight, horizontalSpacing, verticalSpacing, direction } = options;

    // Build adjacency list
    const adjacency: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};

    data.nodes.forEach(node => {
        adjacency[node.id] = [];
        inDegree[node.id] = 0;
    });

    data.edges.forEach(edge => {
        if (adjacency[edge.from]) {
            adjacency[edge.from].push(edge.to);
        }
        if (inDegree[edge.to] !== undefined) {
            inDegree[edge.to]++;
        }
    });

    // Topological sort to determine levels
    const levels: string[][] = [];
    const visited = new Set<string>();
    const queue = Object.keys(inDegree).filter(id => inDegree[id] === 0);

    while (queue.length > 0) {
        const level = [...queue];
        levels.push(level);
        queue.length = 0;

        level.forEach(nodeId => {
            visited.add(nodeId);
            (adjacency[nodeId] || []).forEach(nextId => {
                inDegree[nextId]--;
                if (inDegree[nextId] === 0 && !visited.has(nextId)) {
                    queue.push(nextId);
                }
            });
        });
    }

    // Calculate max level width for centering
    const maxLevelSize = Math.max(...levels.map(l => l.length));

    // Assign positions with centering
    levels.forEach((level, levelIndex) => {
        const levelOffset = (maxLevelSize - level.length) / 2;
        level.forEach((nodeId, nodeIndex) => {
            if (direction === 'horizontal') {
                positions[nodeId] = {
                    x: 40 + levelIndex * (nodeWidth! + horizontalSpacing!),
                    y: 40 + (nodeIndex + levelOffset) * (nodeHeight! + verticalSpacing!)
                };
            } else {
                positions[nodeId] = {
                    x: 40 + (nodeIndex + levelOffset) * (nodeWidth! + horizontalSpacing!),
                    y: 40 + levelIndex * (nodeHeight! + verticalSpacing!)
                };
            }
        });
    });

    return positions;
}

function renderNode(
    chartId: string,
    group: SVGGElement,
    node: WorkflowNode,
    x: number,
    y: number,
    options: WorkflowOptions
): void {
    const instance = instances.get(chartId);
    if (!instance) return;

    const { nodeWidth, nodeHeight, interactive, animated } = options;
    const status = (node.status || 'pending') as WorkflowNodeStatus;
    const style = statusStyles[status];

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', `workflow-node node-${status}`);
    g.setAttribute('data-node-id', node.id);
    g.style.cursor = interactive ? 'pointer' : 'default';
    g.style.transition = 'transform 0.2s ease';

    // Apply filters
    if (status === 'active' || status === 'error') {
        g.setAttribute('filter', 'url(#glow)');
    } else {
        g.setAttribute('filter', 'url(#shadow)');
    }

    // Node shape based on type
    let shape: SVGElement;

    if (node.type === 'start' || node.type === 'end') {
        // Ellipse for start/end
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        shape.setAttribute('cx', `${x + nodeWidth! / 2}`);
        shape.setAttribute('cy', `${y + nodeHeight! / 2}`);
        shape.setAttribute('rx', `${nodeWidth! / 2 - 5}`);
        shape.setAttribute('ry', `${nodeHeight! / 2 - 5}`);
    } else if (node.type === 'decision') {
        // Diamond for decision
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const cx = x + nodeWidth! / 2;
        const cy = y + nodeHeight! / 2;
        const hw = nodeWidth! / 2 - 5;
        const hh = nodeHeight! / 2 - 5;
        shape.setAttribute('points', `${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`);
    } else {
        // Rounded rectangle for task, parallel, subprocess
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        shape.setAttribute('x', `${x}`);
        shape.setAttribute('y', `${y}`);
        shape.setAttribute('width', `${nodeWidth}`);
        shape.setAttribute('height', `${nodeHeight}`);
        shape.setAttribute('rx', '8');
        shape.setAttribute('ry', '8');
    }

    shape.setAttribute('fill', `url(#grad-${status})`);
    shape.setAttribute('stroke', style.border);
    shape.setAttribute('stroke-width', status === 'active' ? '2.5' : '2');
    g.appendChild(shape);

    // Status icon (top-right corner)
    const iconSize = 16;
    const iconX = x + nodeWidth! - iconSize - 8;
    const iconY = y + 8;

    const iconCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    iconCircle.setAttribute('cx', `${iconX + iconSize / 2}`);
    iconCircle.setAttribute('cy', `${iconY + iconSize / 2}`);
    iconCircle.setAttribute('r', `${iconSize / 2 + 2}`);
    iconCircle.setAttribute('fill', style.border);
    g.appendChild(iconCircle);

    const statusIcon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    statusIcon.setAttribute('d', statusIcons[status]);
    statusIcon.setAttribute('fill', 'none');
    statusIcon.setAttribute('stroke', 'white');
    statusIcon.setAttribute('stroke-width', '1.5');
    statusIcon.setAttribute('stroke-linecap', 'round');
    statusIcon.setAttribute('stroke-linejoin', 'round');
    statusIcon.setAttribute('transform', `translate(${iconX}, ${iconY}) scale(0.67)`);
    g.appendChild(statusIcon);

    // Node type icon (left side)
    if (node.type !== 'task') {
        const typeIconX = x + 12;
        const typeIconY = y + nodeHeight! / 2 - 10;
        const typeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        typeIcon.setAttribute('d', nodeIcons[node.type]);
        typeIcon.setAttribute('fill', 'none');
        typeIcon.setAttribute('stroke', style.text);
        typeIcon.setAttribute('stroke-width', '1.5');
        typeIcon.setAttribute('stroke-linecap', 'round');
        typeIcon.setAttribute('stroke-linejoin', 'round');
        typeIcon.setAttribute('transform', `translate(${typeIconX}, ${typeIconY}) scale(0.83)`);
        g.appendChild(typeIcon);
    }

    // Label
    if (options.showLabels) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const textX = node.type !== 'task' ? x + 35 : x + nodeWidth! / 2;
        text.setAttribute('x', `${textX}`);
        text.setAttribute('y', `${y + nodeHeight! / 2 + 1}`);
        text.setAttribute('text-anchor', node.type !== 'task' ? 'start' : 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', style.text);
        text.setAttribute('font-size', '13');
        text.setAttribute('font-weight', '600');

        // Truncate text
        const maxLen = node.type !== 'task' ? 14 : 18;
        text.textContent = node.label.length > maxLen
            ? node.label.substring(0, maxLen - 2) + '...'
            : node.label;
        g.appendChild(text);

        // Description (smaller, below label)
        if (node.description && node.type === 'task') {
            const desc = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            desc.setAttribute('x', `${x + nodeWidth! / 2}`);
            desc.setAttribute('y', `${y + nodeHeight! / 2 + 16}`);
            desc.setAttribute('text-anchor', 'middle');
            desc.setAttribute('fill', '#9ca3af');
            desc.setAttribute('font-size', '10');
            desc.textContent = node.description.length > 22
                ? node.description.substring(0, 20) + '...'
                : node.description;
            g.appendChild(desc);
        }
    }

    // Pulse animation for active nodes
    if (animated && status === 'active') {
        const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        pulse.setAttribute('attributeName', 'opacity');
        pulse.setAttribute('values', '1;0.7;1');
        pulse.setAttribute('dur', '2s');
        pulse.setAttribute('repeatCount', 'indefinite');
        shape.appendChild(pulse);
    }

    // Event handlers
    if (interactive) {
        g.addEventListener('click', () => {
            instance.netRef.invokeMethodAsync('HandleNodeClick', node.id, JSON.stringify(node));
        });

        g.addEventListener('mouseenter', () => {
            g.style.transform = 'scale(1.01)';
            g.style.filter = 'url(#glow)';
        });

        g.addEventListener('mouseleave', () => {
            g.style.transform = 'scale(1)';
            if (status !== 'active' && status !== 'error') {
                g.style.filter = 'url(#shadow)';
            }
        });
    }

    group.appendChild(g);
}

function renderEdge(
    group: SVGGElement,
    edge: WorkflowEdge,
    positions: Record<string, { x: number; y: number }>,
    options: WorkflowOptions,
    nodes: WorkflowNode[]
): void {
    const fromPos = positions[edge.from];
    const toPos = positions[edge.to];
    if (!fromPos || !toPos) return;

    const { nodeWidth, nodeHeight, direction, animated } = options;

    // Get source node status for edge styling
    const sourceNode = nodes.find(n => n.id === edge.from);
    const isActiveEdge = sourceNode?.status === 'completed' || sourceNode?.status === 'active';

    // Calculate connection points
    let startX: number, startY: number, endX: number, endY: number;

    if (direction === 'horizontal') {
        startX = fromPos.x + nodeWidth!;
        startY = fromPos.y + nodeHeight! / 2;
        endX = toPos.x;
        endY = toPos.y + nodeHeight! / 2;
    } else {
        startX = fromPos.x + nodeWidth! / 2;
        startY = fromPos.y + nodeHeight!;
        endX = toPos.x + nodeWidth! / 2;
        endY = toPos.y;
    }

    // Create path with nice curves
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    if (direction === 'horizontal') {
        const midX = (startX + endX) / 2;
        path.setAttribute('d', `M${startX},${startY} C${midX},${startY} ${midX},${endY} ${endX},${endY}`);
    } else {
        const midY = (startY + endY) / 2;
        path.setAttribute('d', `M${startX},${startY} C${startX},${midY} ${endX},${midY} ${endX},${endY}`);
    }

    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', isActiveEdge ? '#3b82f6' : '#94a3b8');
    path.setAttribute('stroke-width', isActiveEdge ? '2.5' : '2');
    path.setAttribute('marker-end', isActiveEdge ? 'url(#arrowhead-active)' : 'url(#arrowhead)');

    // Animated dash for active edges
    if (animated && isActiveEdge) {
        path.setAttribute('stroke-dasharray', '8 4');
        const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('attributeName', 'stroke-dashoffset');
        animate.setAttribute('from', '24');
        animate.setAttribute('to', '0');
        animate.setAttribute('dur', '1s');
        animate.setAttribute('repeatCount', 'indefinite');
        path.appendChild(animate);
    }

    group.appendChild(path);

    // Edge label
    if (edge.label) {
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        // Background for label
        const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        labelBg.setAttribute('x', `${midX - 25}`);
        labelBg.setAttribute('y', `${midY - 10}`);
        labelBg.setAttribute('width', '50');
        labelBg.setAttribute('height', '18');
        labelBg.setAttribute('rx', '4');
        labelBg.setAttribute('fill', 'white');
        labelBg.setAttribute('stroke', '#e5e7eb');
        group.appendChild(labelBg);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', `${midX}`);
        text.setAttribute('y', `${midY + 3}`);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#6b7280');
        text.setAttribute('font-size', '11');
        text.setAttribute('font-weight', '500');
        text.textContent = edge.label;
        group.appendChild(text);
    }
}

export function update(id: string, data: WorkflowData): void {
    const instance = instances.get(id);
    if (instance) {
        instance.data = data;
        render(id);
    }
}

export function updateNodeStatus(id: string, nodeId: string, status: WorkflowNodeStatus): void {
    const instance = instances.get(id);
    if (instance) {
        const node = instance.data.nodes.find(n => n.id === nodeId);
        if (node) {
            node.status = status;
            render(id);
        }
    }
}

export function dispose(id: string): void {
    const instance = instances.get(id);
    if (instance) {
        instance.container.innerHTML = '';
        instances.delete(id);
    }
}
