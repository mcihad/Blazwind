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
    icon?: string; // FontAwesome icon class (e.g., 'fa-solid fa-user')
    variant?: 'solid' | 'outline' | 'ghost'; // For future styling
    metadata?: Record<string, any>;
}

export interface WorkflowEdge {
    id: string;
    from: string;
    to: string;
    label?: string;
    condition?: string;
    animated?: boolean;
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
    fitToScreen?: boolean;
}

interface WorkflowInstance {
    id: string;
    container: HTMLElement;
    data: WorkflowData;
    options: WorkflowOptions;
    netRef: any;
    svg: SVGSVGElement | null;
    mainGroup: SVGGElement | null;
    transform: { x: number; y: number; k: number };
    isDragging: boolean;
    lastMouse: { x: number; y: number };
}

const instances: Map<string, WorkflowInstance> = new Map();

// Enhanced status colors with gradients and glassmorphism
const statusStyles: Record<WorkflowNodeStatus, {
    bgStart: string;
    bgEnd: string;
    border: string;
    text: string;
    shadow: string;
    iconColor: string;
}> = {
    pending: {
        bgStart: '#ffffff', bgEnd: '#f9fafb',
        border: '#e5e7eb', text: '#374151',
        shadow: 'rgba(0,0,0,0.05)',
        iconColor: '#9ca3af'
    },
    active: {
        bgStart: '#eff6ff', bgEnd: '#dbeafe', // Blue-50 to Blue-100
        border: '#3b82f6', text: '#1e40af', // Blue-500, Blue-800
        shadow: 'rgba(59, 130, 246, 0.25)',
        iconColor: '#2563eb'
    },
    completed: {
        bgStart: '#f0fdf4', bgEnd: '#dcfce7', // Green
        border: '#22c55e', text: '#166534',
        shadow: 'rgba(34, 197, 94, 0.2)',
        iconColor: '#16a34a'
    },
    error: {
        bgStart: '#fef2f2', bgEnd: '#fee2e2', // Red
        border: '#ef4444', text: '#991b1b',
        shadow: 'rgba(239, 68, 68, 0.2)',
        iconColor: '#dc2626'
    },
    skipped: {
        bgStart: '#f3f4f6', bgEnd: '#e5e7eb', // Gray
        border: '#9ca3af', text: '#6b7280',
        shadow: 'rgba(0,0,0,0.05)',
        iconColor: '#9ca3af'
    }
};

export function init(
    container: HTMLElement,
    data: WorkflowData,
    options: WorkflowOptions,
    netRef: any
): string {
    const id = `wf-${crypto.randomUUID()}`;

    const instance: WorkflowInstance = {
        id,
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
            fitToScreen: true,
            ...options
        },
        netRef,
        svg: null,
        mainGroup: null,
        transform: { x: 0, y: 0, k: 1 },
        isDragging: false,
        lastMouse: { x: 0, y: 0 }
    };

    instances.set(id, instance);

    // Setup container styles
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.cursor = 'grab';
    container.style.userSelect = 'none';

    // Add controls overlay
    addControls(container, id);

    render(id);
    setupInteractions(id);

    return id;
}

function addControls(container: HTMLElement, id: string) {
    const controls = document.createElement('div');
    controls.className = 'absolute bottom-4 right-4 flex flex-col gap-2 z-10';
    controls.innerHTML = `
        <div class="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 transition" onclick="Blazwind.Workflow.zoomIn('${id}')">
                <i class="fa-solid fa-plus"></i>
            </button>
            <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 transition" onclick="Blazwind.Workflow.fitToScreen('${id}')">
                <i class="fa-solid fa-compress"></i>
            </button>
            <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition" onclick="Blazwind.Workflow.zoomOut('${id}')">
                <i class="fa-solid fa-minus"></i>
            </button>
        </div>
    `;
    container.appendChild(controls);
}

function setupInteractions(id: string) {
    const instance = instances.get(id);
    if (!instance) return;

    const { container } = instance;

    // Wheel Zoom
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = -Math.sign(e.deltaY) * 0.1;
        zoom(id, delta, e.offsetX, e.offsetY);
    });

    // Mouse Pan
    container.addEventListener('mousedown', (e) => {
        if (e.target !== container && (e.target as Element).tagName !== 'svg') return; // Allow clicking nodes
        instance.isDragging = true;
        instance.lastMouse = { x: e.clientX, y: e.clientY };
        container.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!instance.isDragging) return;
        const dx = e.clientX - instance.lastMouse.x;
        const dy = e.clientY - instance.lastMouse.y;
        instance.lastMouse = { x: e.clientX, y: e.clientY };
        pan(id, dx, dy);
    });

    window.addEventListener('mouseup', () => {
        instance.isDragging = false;
        container.style.cursor = 'grab';
    });

    // Touch support could be added here similar to mouse events
}

export function zoomIn(id: string) {
    const instance = instances.get(id);
    if (!instance) return;
    const center = { x: instance.container.clientWidth / 2, y: instance.container.clientHeight / 2 };
    zoom(id, 0.2, center.x, center.y);
}

export function zoomOut(id: string) {
    const instance = instances.get(id);
    if (!instance) return;
    const center = { x: instance.container.clientWidth / 2, y: instance.container.clientHeight / 2 };
    zoom(id, -0.2, center.x, center.y);
}

function zoom(id: string, delta: number, cx: number, cy: number) {
    const instance = instances.get(id);
    if (!instance || !instance.mainGroup) return;

    const oldK = instance.transform.k;
    const newK = Math.max(0.1, Math.min(4, oldK * (1 + delta))); // Clamp zoom 0.1x to 4x

    // Zoom towards cursor/center
    // newX = cx - (cx - oldX) * (newK / oldK)
    instance.transform.x = cx - (cx - instance.transform.x) * (newK / oldK);
    instance.transform.y = cy - (cy - instance.transform.y) * (newK / oldK);
    instance.transform.k = newK;

    updateTransform(instance);
}

function pan(id: string, dx: number, dy: number) {
    const instance = instances.get(id);
    if (!instance || !instance.mainGroup) return;

    instance.transform.x += dx;
    instance.transform.y += dy;

    updateTransform(instance);
}

function updateTransform(instance: WorkflowInstance) {
    if (instance.mainGroup) {
        instance.mainGroup.setAttribute('transform', `translate(${instance.transform.x}, ${instance.transform.y}) scale(${instance.transform.k})`);

        // Update grid background pattern size/opacity if we had one
    }
}

export function fitToScreen(id: string) {
    const instance = instances.get(id);
    if (!instance || !instance.mainGroup) return;

    const { options } = instance;
    const positions = calculateNodePositions(instance.data, options);
    const padding = 60;

    // Calculate content bounds
    const xs = Object.values(positions).map(p => p.x);
    const ys = Object.values(positions).map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs) + options.nodeWidth!;
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys) + options.nodeHeight!;

    const contentWidth = maxX - minX + padding * 2;
    const contentHeight = maxY - minY + padding * 2;

    const containerWidth = instance.container.clientWidth;
    const containerHeight = instance.container.clientHeight;

    const scaleX = containerWidth / contentWidth;
    const scaleY = containerHeight / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1) * 0.9; // 90% fit

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    instance.transform = {
        x: containerWidth / 2 - midX * scale,
        y: containerHeight / 2 - midY * scale,
        k: scale
    };

    updateTransform(instance);
}

function render(id: string): void {
    const instance = instances.get(id);
    if (!instance) return;

    const { container, data, options } = instance;

    // Clear keeping controls
    const controls = container.querySelector('div.absolute'); // Keep controls
    container.innerHTML = '';
    if (controls) container.appendChild(controls);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.display = 'block';

    // Definitions
    const defs = createDefs(id);
    svg.appendChild(defs);

    // Main Group for Pan/Zoom
    const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    mainGroup.setAttribute('class', 'workflow-content');
    svg.appendChild(mainGroup);

    // Dots Background (Optional, helps visualization of movement)
    // We can add a pattern to defs and a large rect in SVG before mainGroup

    const nodePositions = calculateNodePositions(data, options);

    // Edges
    const edgesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    edgesGroup.setAttribute('class', 'workflow-edges');
    data.edges.forEach(edge => {
        renderEdge(edgesGroup, edge, nodePositions, options, data.nodes, id);
    });
    mainGroup.appendChild(edgesGroup);

    // Nodes
    const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodesGroup.setAttribute('class', 'workflow-nodes');
    data.nodes.forEach(node => {
        const pos = nodePositions[node.id];
        if (pos) {
            renderNode(id, nodesGroup, node, pos.x, pos.y, options, id);
        }
    });
    mainGroup.appendChild(nodesGroup);

    instance.svg = svg;
    instance.mainGroup = mainGroup;
    container.appendChild(svg);

    if (options.fitToScreen) {
        setTimeout(() => fitToScreen(id), 10);
    }
}

function createDefs(scopeId: string): SVGDefsElement {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    // Gradients
    Object.entries(statusStyles).forEach(([status, style]) => {
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', `${scopeId}-grad-${status}`);
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '0%');
        gradient.setAttribute('y2', '100%');
        gradient.innerHTML = `
            <stop offset="0%" stop-color="${style.bgStart}" />
            <stop offset="100%" stop-color="${style.bgEnd}" />
        `;
        defs.appendChild(gradient);
    });

    // Drop Shadow - softer and more modern
    const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    shadow.setAttribute('id', `${scopeId}-shadow`);
    shadow.setAttribute('x', '-50%');
    shadow.setAttribute('y', '-50%');
    shadow.setAttribute('width', '200%');
    shadow.setAttribute('height', '200%');
    shadow.innerHTML = `
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.06)" />
        <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="rgba(0,0,0,0.04)" />
    `;
    defs.appendChild(shadow);

    // Active Glow - more pronounced blue glow
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    glow.setAttribute('id', `${scopeId}-glow`);
    glow.setAttribute('x', '-50%');
    glow.setAttribute('y', '-50%');
    glow.setAttribute('width', '200%');
    glow.setAttribute('height', '200%');
    glow.innerHTML = `
        <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="rgba(59, 130, 246, 0.35)" />
    `;
    defs.appendChild(glow);

    // Arrow Marker (Standard) - cleaner, smaller arrowhead
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', `${scopeId}-arrowhead`);
    marker.setAttribute('markerWidth', '8');
    marker.setAttribute('markerHeight', '6');
    marker.setAttribute('refX', '7');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');
    marker.innerHTML = `<path d="M0,0.5 L7,3 L0,5.5 L1.5,3 Z" fill="#94a3b8" />`;
    defs.appendChild(marker);

    // Arrow Marker (Active) - matching blue
    const activeMarker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    activeMarker.setAttribute('id', `${scopeId}-arrowhead-active`);
    activeMarker.setAttribute('markerWidth', '8');
    activeMarker.setAttribute('markerHeight', '6');
    activeMarker.setAttribute('refX', '7');
    activeMarker.setAttribute('refY', '3');
    activeMarker.setAttribute('orient', 'auto');
    activeMarker.innerHTML = `<path d="M0,0.5 L7,3 L0,5.5 L1.5,3 Z" fill="#3b82f6" />`;
    defs.appendChild(activeMarker);

    return defs;
}

function calculateNodePositions(data: WorkflowData, options: WorkflowOptions): Record<string, { x: number; y: number }> {
    // Simple topological sort / hierarchy layout
    // Reuse existing logic but ensuring robust fallback
    const positions: Record<string, { x: number; y: number }> = {};
    const { nodeWidth, nodeHeight, horizontalSpacing, verticalSpacing, direction } = options;

    const adjacency: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};

    data.nodes.forEach(n => {
        adjacency[n.id] = [];
        inDegree[n.id] = 0;
    });

    data.edges.forEach(e => {
        if (adjacency[e.from]) adjacency[e.from].push(e.to);
        if (inDegree[e.to] !== undefined) inDegree[e.to]++;
    });

    // Level-based layout
    const levels: string[][] = [];
    let queue = Object.keys(inDegree).filter(id => inDegree[id] === 0);
    // If cycle or no start, pick one
    if (queue.length === 0 && data.nodes.length > 0) queue = [data.nodes[0].id];

    const visited = new Set<string>();

    while (queue.length > 0) {
        const level = [...queue];
        levels.push(level);
        queue = [];

        level.forEach(nodeId => {
            visited.add(nodeId);
            (adjacency[nodeId] || []).forEach(nextId => {
                inDegree[nextId]--;
                if (inDegree[nextId] <= 0 && !visited.has(nextId)) {
                    queue.push(nextId);
                    visited.add(nextId);
                }
            });
        });

        // Safety break for disconnected components
        if (queue.length === 0 && visited.size < data.nodes.length) {
            const unvisited = data.nodes.find(n => !visited.has(n.id));
            if (unvisited) {
                queue.push(unvisited.id);
                visited.add(unvisited.id);
            }
        }
    }

    const maxLevelSize = Math.max(...levels.map(l => l.length));

    levels.forEach((level, levelIndex) => {
        const levelOffset = (maxLevelSize - level.length) / 2;
        level.forEach((nodeId, nodeIndex) => {
            if (direction === 'horizontal') {
                positions[nodeId] = {
                    x: levelIndex * (nodeWidth! + horizontalSpacing!),
                    y: (nodeIndex + levelOffset) * (nodeHeight! + verticalSpacing!)
                };
            } else {
                positions[nodeId] = {
                    x: (nodeIndex + levelOffset) * (nodeWidth! + horizontalSpacing!),
                    y: levelIndex * (nodeHeight! + verticalSpacing!)
                };
            }
        });
    });

    return positions;
}

function renderNode(chartId: string, group: SVGGElement, node: WorkflowNode, x: number, y: number, options: WorkflowOptions, scopeId: string) {
    const instance = instances.get(chartId);
    if (!instance) return;

    const { nodeWidth, nodeHeight, interactive } = options;
    const status = (node.status || 'pending');
    const style = statusStyles[status];

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', `workflow-node node-${status}`);
    g.setAttribute('data-id', node.id);
    g.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
    g.style.cursor = interactive ? 'pointer' : 'default';

    // Hover effects via CSS/JS
    // Note: We use foreignObject for icon support if possible, or simple standard rendering
    // Let's use standard Shapes but cleaner

    // Shadow Group (Offset)
    // Shadow Group (Offset) - Removed unused var

    // Main Shape
    let shape: SVGElement;
    if (node.type === 'start' || node.type === 'end') {
        const r = Math.min(nodeWidth!, nodeHeight!) / 2;
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        shape.setAttribute('cx', `${x + nodeWidth! / 2}`);
        shape.setAttribute('cy', `${y + nodeHeight! / 2}`);
        shape.setAttribute('r', `${r}`);
    } else if (node.type === 'decision') {
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const cx = x + nodeWidth! / 2;
        const cy = y + nodeHeight! / 2;
        const w = nodeWidth!;
        const h = nodeHeight!;
        shape.setAttribute('points', `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`);
    } else {
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        shape.setAttribute('x', `${x}`);
        shape.setAttribute('y', `${y}`);
        shape.setAttribute('width', `${nodeWidth}`);
        shape.setAttribute('height', `${nodeHeight}`);
        shape.setAttribute('rx', '12'); // Modern rounded corners
    }

    shape.setAttribute('fill', `url(#${scopeId}-grad-${status})`);
    shape.setAttribute('stroke', style.border);
    shape.setAttribute('stroke-width', '1.5'); // Slightly thicker border
    if (status === 'active') {
        shape.setAttribute('filter', `url(#${scopeId}-glow)`);
    } else {
        shape.setAttribute('filter', `url(#${scopeId}-shadow)`);
    }

    g.appendChild(shape);

    // Icon & Label Container via ForeignObject for rich content (FontAwesome!)
    // If not supported by environment, fallback to SVG

    const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    fo.setAttribute('x', `${x}`);
    fo.setAttribute('y', `${y}`);
    fo.setAttribute('width', `${nodeWidth}`);
    fo.setAttribute('height', `${nodeHeight}`);
    fo.style.pointerEvents = 'none'; // Let clicks pass through to Group

    const div = document.createElement('div');
    div.className = 'w-full h-full flex items-center justify-center p-2 text-center flex-col';
    div.style.color = style.text;

    // Icon
    if (node.icon) {
        div.innerHTML += `<i class="${node.icon} text-lg mb-1" style="color: ${style.iconColor}"></i>`;
    } else if (node.type !== 'task' && node.type !== 'start' && node.type !== 'end') {
        // Default icons
    }

    // Label
    if (options.showLabels) {
        div.innerHTML += `<span class="text-xs font-semibold leading-tight line-clamp-2">${node.label}</span>`;
        // Description
        if (node.description && node.type === 'task') {
            div.innerHTML += `<span class="text-[9px] opacity-70 mt-1 line-clamp-1">${node.description}</span>`;
        }
    }

    fo.appendChild(div);
    g.appendChild(fo);

    // Event Listeners
    if (interactive) {
        g.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent drag start interference sometimes
            instance.netRef.invokeMethodAsync('HandleNodeClick', node.id, JSON.stringify(node));
        });

        g.addEventListener('mouseenter', () => {
            // Simple hover effect - just highlight stroke, no transform to avoid jumps
            shape.setAttribute('stroke-width', '2.5');
            shape.style.filter = 'brightness(1.05)';
        });
        g.addEventListener('mouseleave', () => {
            shape.setAttribute('stroke-width', '1.5');
            shape.style.filter = '';
        });
    }

    group.appendChild(g);
}

function renderEdge(group: SVGGElement, edge: WorkflowEdge, positions: any, options: WorkflowOptions, nodes: WorkflowNode[], scopeId: string) {
    const from = positions[edge.from];
    const to = positions[edge.to];
    if (!from || !to) return;

    const { nodeWidth, nodeHeight, direction, animated } = options;
    const sourceNode = nodes.find(n => n.id === edge.from);
    const isActive = sourceNode?.status === 'active' || sourceNode?.status === 'completed'; // Simplified logic

    // Path calculation
    let pathD = '';
    const start = { x: 0, y: 0 };
    const end = { x: 0, y: 0 };

    if (direction === 'horizontal') {
        start.x = from.x + nodeWidth!;
        start.y = from.y + nodeHeight! / 2;
        end.x = to.x;
        end.y = to.y + nodeHeight! / 2;

        // Improved Bezier: use distance-proportional control points for smoother curves
        const dx = end.x - start.x;
        const controlOffset = Math.min(Math.abs(dx) * 0.5, 80); // Cap at 80px
        pathD = `M${start.x},${start.y} C${start.x + controlOffset},${start.y} ${end.x - controlOffset},${end.y} ${end.x},${end.y}`;
    } else {
        start.x = from.x + nodeWidth! / 2;
        start.y = from.y + nodeHeight!;
        end.x = to.x + nodeWidth! / 2;
        end.y = to.y;

        // Improved Bezier for vertical
        const dy = end.y - start.y;
        const controlOffset = Math.min(Math.abs(dy) * 0.5, 60);
        pathD = `M${start.x},${start.y} C${start.x},${start.y + controlOffset} ${end.x},${end.y - controlOffset} ${end.x},${end.y}`;
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', isActive ? '#3b82f6' : '#94a3b8'); // Slightly nicer gray
    path.setAttribute('stroke-width', isActive ? '2' : '1.5');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('marker-end', isActive ? `url(#${scopeId}-arrowhead-active)` : `url(#${scopeId}-arrowhead)`);

    if (animated && isActive) {
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

    // Label
    if (edge.label) {
        // Simple label at midpoint
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;

        // Background rect
        const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        fo.setAttribute('x', `${midX - 30}`);
        fo.setAttribute('y', `${midY - 10}`);
        fo.setAttribute('width', '60');
        fo.setAttribute('height', '20');

        fo.innerHTML = `<div class="bg-white dark:bg-gray-800 text-gray-500 text-[10px] px-1 rounded border border-gray-200 dark:border-gray-700 text-center shadow-sm truncate">${edge.label}</div>`;
        group.appendChild(fo);
    }
}

export function update(id: string, data: WorkflowData): void {
    const instance = instances.get(id);
    if (!instance) return;
    instance.data = data;
    render(id);
}

export function updateNodeStatus(id: string, nodeId: string, status: WorkflowNodeStatus): void {
    const instance = instances.get(id);
    if (!instance) return;

    const node = instance.data.nodes.find(n => n.id === nodeId);
    if (node) {
        node.status = status;
        render(id); // Re-render to update gradients/styles
    }
}

export function dispose(id: string): void {
    instances.delete(id);
}
