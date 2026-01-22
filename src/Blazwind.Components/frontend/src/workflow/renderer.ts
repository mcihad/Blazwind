/**
 * Main workflow renderer
 */
import type {
    IWorkflowNode,
    WorkflowData,
    WorkflowOptions,
    NodePosition
} from './types';
import { defaultOptions, statusStyles } from './types';
import { createPanZoom, type PanZoomController } from './pan-zoom';
import { createDragController, type DragController } from './drag';
import { getNodeRenderer } from './nodes/registry';
import { renderEdge, calculateEdgePath } from './edges';

// Import node renderers to register them
import './nodes/base';

export interface WorkflowInstance {
    id: string;
    container: HTMLElement;
    data: WorkflowData;
    options: WorkflowOptions;
    netRef: any;
    svg: SVGSVGElement | null;
    mainGroup: SVGGElement | null;
    nodesGroup: SVGGElement | null;
    edgesGroup: SVGGElement | null;
    panZoom: PanZoomController | null;
    dragController: DragController | null;
    hasInitialFit: boolean;
}

const instances: Map<string, WorkflowInstance> = new Map();

/**
 * Create SVG definitions (gradients, filters, markers)
 */
function createDefs(scopeId: string): SVGDefsElement {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    // Gradients for each status
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

    // Drop shadow
    const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    shadow.setAttribute('id', `${scopeId}-shadow`);
    shadow.setAttribute('x', '-50%');
    shadow.setAttribute('y', '-50%');
    shadow.setAttribute('width', '200%');
    shadow.setAttribute('height', '200%');
    shadow.innerHTML = `
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.08)" />
    `;
    defs.appendChild(shadow);

    // Active glow
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

    // Arrow markers
    const createArrowMarker = (id: string, color: string) => {
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', id);
        marker.setAttribute('markerWidth', '8');
        marker.setAttribute('markerHeight', '6');
        marker.setAttribute('refX', '7');
        marker.setAttribute('refY', '3');
        marker.setAttribute('orient', 'auto');
        marker.innerHTML = `<path d="M0,0.5 L7,3 L0,5.5 L1.5,3 Z" fill="${color}" />`;
        return marker;
    };

    defs.appendChild(createArrowMarker(`${scopeId}-arrowhead`, '#94a3b8'));
    defs.appendChild(createArrowMarker(`${scopeId}-arrowhead-active`, '#3b82f6'));

    return defs;
}

/**
 * Add zoom control buttons
 */
function addControls(container: HTMLElement, instanceId: string): void {
    const controls = document.createElement('div');
    controls.className = 'absolute bottom-4 right-4 flex flex-col gap-1 z-10';
    controls.innerHTML = `
        <div class="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button type="button" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 transition-colors" 
                    onclick="Blazwind.Workflow.zoomIn('${instanceId}')" title="Zoom In">
                <i class="fa-solid fa-plus text-sm"></i>
            </button>
            <button type="button" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 transition-colors" 
                    onclick="Blazwind.Workflow.fitToScreen('${instanceId}')" title="Fit to Screen">
                <i class="fa-solid fa-compress text-sm"></i>
            </button>
            <button type="button" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 transition-colors" 
                    onclick="Blazwind.Workflow.zoomOut('${instanceId}')" title="Zoom Out">
                <i class="fa-solid fa-minus text-sm"></i>
            </button>
            <button type="button" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 transition-colors" 
                    onclick="Blazwind.Workflow.toggleFullscreen('${instanceId}')" title="Fullscreen">
                <i class="fa-solid fa-expand text-sm"></i>
            </button>
            <button type="button" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors" 
                    onclick="Blazwind.Workflow.exportPng('${instanceId}')" title="Export PNG">
                <i class="fa-solid fa-download text-sm"></i>
            </button>
        </div>
    `;
    container.appendChild(controls);
}

/**
 * Calculate automatic positions for nodes without positions
 */
function autoLayoutNodes(data: WorkflowData, options: WorkflowOptions): void {
    const { nodeWidth, nodeHeight, horizontalSpacing, verticalSpacing, direction } = options;

    // Build adjacency for level calculation
    const inDegree: Record<string, number> = {};
    const adjacency: Record<string, string[]> = {};

    data.nodes.forEach(n => {
        inDegree[n.id] = 0;
        adjacency[n.id] = [];
    });

    data.edges.forEach(e => {
        if (adjacency[e.from]) adjacency[e.from].push(e.to);
        if (inDegree[e.to] !== undefined) inDegree[e.to]++;
    });

    // Topological sort for levels
    const levels: string[][] = [];
    let queue = Object.keys(inDegree).filter(id => inDegree[id] === 0);
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

        // Handle disconnected nodes
        if (queue.length === 0 && visited.size < data.nodes.length) {
            const unvisited = data.nodes.find(n => !visited.has(n.id));
            if (unvisited) {
                queue.push(unvisited.id);
                visited.add(unvisited.id);
            }
        }
    }

    const maxLevelSize = Math.max(...levels.map(l => l.length), 1);

    levels.forEach((level, levelIndex) => {
        const levelOffset = (maxLevelSize - level.length) / 2;
        level.forEach((nodeId, nodeIndex) => {
            const node = data.nodes.find(n => n.id === nodeId);
            if (!node) return;

            // Only set position if it's zero (not manually set)
            if (node.position.x === 0 && node.position.y === 0) {
                if (direction === 'horizontal') {
                    node.position = {
                        x: levelIndex * (nodeWidth + horizontalSpacing),
                        y: (nodeIndex + levelOffset) * (nodeHeight + verticalSpacing)
                    };
                } else {
                    node.position = {
                        x: (nodeIndex + levelOffset) * (nodeWidth + horizontalSpacing),
                        y: levelIndex * (nodeHeight + verticalSpacing)
                    };
                }
            }
        });
    });
}

/**
 * Calculate bounds of all nodes
 */
function calculateBounds(nodes: IWorkflowNode[], options: WorkflowOptions): { minX: number; maxX: number; minY: number; maxY: number } {
    if (nodes.length === 0) {
        return { minX: 0, maxX: 100, minY: 0, maxY: 100 };
    }

    const xs = nodes.map(n => n.position.x);
    const ys = nodes.map(n => n.position.y);

    return {
        minX: Math.min(...xs),
        maxX: Math.max(...xs) + options.nodeWidth,
        minY: Math.min(...ys),
        maxY: Math.max(...ys) + options.nodeHeight
    };
}

/**
 * Render the workflow
 */
function render(instance: WorkflowInstance): void {
    const { container, data, options, id: scopeId } = instance;

    // Auto-layout nodes if needed
    autoLayoutNodes(data, options);

    // Clear container (keep controls)
    const controls = container.querySelector('div.absolute');
    container.innerHTML = '';
    if (controls) container.appendChild(controls);

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.display = 'block';
    svg.appendChild(createDefs(scopeId));

    // Main group for pan/zoom
    const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    mainGroup.setAttribute('class', 'workflow-content');
    svg.appendChild(mainGroup);

    // Edges group (render first, behind nodes)
    const edgesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    edgesGroup.setAttribute('class', 'workflow-edges');
    mainGroup.appendChild(edgesGroup);

    // Render edges
    data.edges.forEach(edge => {
        const fromNode = data.nodes.find(n => n.id === edge.from);
        const toNode = data.nodes.find(n => n.id === edge.to);
        if (fromNode && toNode) {
            renderEdge(edgesGroup, edge, fromNode, toNode, options, scopeId);
        }
    });

    // Nodes group
    const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodesGroup.setAttribute('class', 'workflow-nodes');
    mainGroup.appendChild(nodesGroup);

    // Render nodes
    data.nodes.forEach(node => {
        const renderer = getNodeRenderer(node.nodeType);
        const style = statusStyles[node.status] || statusStyles.pending;
        if (renderer) {
            renderer(nodesGroup, node, options, style, scopeId);
        }
    });

    instance.svg = svg;
    instance.mainGroup = mainGroup;
    instance.nodesGroup = nodesGroup;
    instance.edgesGroup = edgesGroup;

    container.appendChild(svg);

    // Setup pan/zoom (preserve existing transform if available)
    const previousTransform = instance.panZoom?.transform;
    if (instance.panZoom) {
        instance.panZoom.destroy();
    }
    instance.panZoom = createPanZoom(container, mainGroup, options);

    // Restore previous transform or fit to screen
    if (previousTransform && (previousTransform.x !== 0 || previousTransform.y !== 0 || previousTransform.k !== 1)) {
        instance.panZoom.setTransform(previousTransform);
    } else if (options.fitToScreen && !instance.hasInitialFit) {
        setTimeout(() => {
            const bounds = calculateBounds(data.nodes, options);
            instance.panZoom?.fitToScreen(bounds);
            instance.hasInitialFit = true;
        }, 10);
    }

    // Setup drag
    if (instance.dragController) {
        instance.dragController.destroy();
    }
    if (options.draggable) {
        instance.dragController = createDragController(
            container,
            nodesGroup,
            () => data.nodes,
            () => instance.panZoom?.transform ?? { x: 0, y: 0, k: 1 },
            options,
            {
                onDrag: (nodeId, position) => {
                    // Real-time edge update during drag
                    updateEdgesDuringDrag(instance, nodeId, position);
                },
                onDragEnd: (nodeId, oldPos, newPos) => {
                    // Update node position in data
                    const node = data.nodes.find(n => n.id === nodeId);
                    if (node) {
                        node.position = newPos;
                    }

                    // Update node element position in DOM
                    updateNodeElementPosition(instance, nodeId, newPos);

                    // Update edges
                    updateAllEdges(instance);

                    // Notify Blazor
                    instance.netRef?.invokeMethodAsync('HandleNodePositionChanged', nodeId, oldPos, newPos);
                }
            }
        );
    }

    // Add click handlers
    if (options.interactive) {
        nodesGroup.addEventListener('click', (e) => {
            const nodeGroup = (e.target as Element).closest('.workflow-node');
            if (nodeGroup) {
                const nodeId = (nodeGroup as HTMLElement).dataset.id;
                const node = data.nodes.find(n => n.id === nodeId);
                if (node && nodeId) {
                    instance.netRef?.invokeMethodAsync('HandleNodeClick', nodeId, JSON.stringify(node));
                }
            }
        });
    }
}

/**
 * Initialize a workflow instance
 */
export function init(
    container: HTMLElement,
    data: WorkflowData,
    options: Partial<WorkflowOptions>,
    netRef: any
): string {
    const id = `wf-${crypto.randomUUID().substring(0, 8)}`;

    const mergedOptions: WorkflowOptions = { ...defaultOptions, ...options };

    const instance: WorkflowInstance = {
        id,
        container,
        data,
        options: mergedOptions,
        netRef,
        svg: null,
        mainGroup: null,
        nodesGroup: null,
        edgesGroup: null,
        panZoom: null,
        dragController: null,
        hasInitialFit: false
    };

    instances.set(id, instance);

    // Setup container
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.touchAction = 'none';

    addControls(container, id);
    render(instance);

    return id;
}

/**
 * Update workflow data
 */
export function update(id: string, data: WorkflowData): void {
    const instance = instances.get(id);
    if (!instance) return;
    instance.data = data;
    render(instance);
}

/**
 * Update a single node's status
 */
export function updateNodeStatus(id: string, nodeId: string, status: string): void {
    const instance = instances.get(id);
    if (!instance) return;

    const node = instance.data.nodes.find(n => n.id === nodeId);
    if (node) {
        node.status = status as any;
        render(instance);
    }
}

/**
 * Update a single node's position
 */
export function updateNodePosition(id: string, nodeId: string, position: NodePosition): void {
    const instance = instances.get(id);
    if (!instance) return;

    const node = instance.data.nodes.find(n => n.id === nodeId);
    if (node) {
        node.position = position;
        render(instance);
    }
}

/**
 * Zoom in
 */
export function zoomIn(id: string): void {
    instances.get(id)?.panZoom?.zoomIn();
}

/**
 * Zoom out
 */
export function zoomOut(id: string): void {
    instances.get(id)?.panZoom?.zoomOut();
}

/**
 * Fit to screen
 */
export function fitToScreen(id: string): void {
    const instance = instances.get(id);
    if (!instance?.panZoom) return;
    const bounds = calculateBounds(instance.data.nodes, instance.options);
    instance.panZoom.fitToScreen(bounds);
}

/**
 * Dispose instance
 */
export function dispose(id: string): void {
    const instance = instances.get(id);
    if (instance) {
        instance.panZoom?.destroy();
        instance.dragController?.destroy();
        instances.delete(id);
    }
}

/**
 * Update edges during drag (real-time)
 */
function updateEdgesDuringDrag(instance: WorkflowInstance, nodeId: string, tempPosition: NodePosition): void {
    const { edgesGroup, data, options } = instance;
    if (!edgesGroup) return;

    // Find edges connected to this node
    data.edges.forEach(edge => {
        if (edge.from === nodeId || edge.to === nodeId) {
            const path = edgesGroup.querySelector(`path[data-id="${edge.id}"]`) as SVGPathElement;
            if (!path) return;

            const fromNode = data.nodes.find(n => n.id === edge.from);
            const toNode = data.nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return;

            // Create temp position for dragged node
            const tempFrom = edge.from === nodeId
                ? { ...fromNode, position: tempPosition }
                : fromNode;
            const tempTo = edge.to === nodeId
                ? { ...toNode, position: tempPosition }
                : toNode;

            const pathD = calculateEdgePath(tempFrom, tempTo, {
                nodeWidth: options.nodeWidth,
                nodeHeight: options.nodeHeight,
                direction: options.direction,
                animated: options.animated
            });
            path.setAttribute('d', pathD);
        }
    });
}

/**
 * Update all edges without re-rendering entire canvas
 */
function updateAllEdges(instance: WorkflowInstance): void {
    const { edgesGroup, data, options } = instance;
    if (!edgesGroup) return;

    data.edges.forEach(edge => {
        const path = edgesGroup.querySelector(`path[data-id="${edge.id}"]`) as SVGPathElement;
        if (!path) return;

        const fromNode = data.nodes.find(n => n.id === edge.from);
        const toNode = data.nodes.find(n => n.id === edge.to);
        if (!fromNode || !toNode) return;

        const pathD = calculateEdgePath(fromNode, toNode, {
            nodeWidth: options.nodeWidth,
            nodeHeight: options.nodeHeight,
            direction: options.direction,
            animated: options.animated
        });
        path.setAttribute('d', pathD);
    });
}

/**
 * Update a single node element's position in the DOM after drag
 */
function updateNodeElementPosition(instance: WorkflowInstance, nodeId: string, position: NodePosition): void {
    const { nodesGroup, options } = instance;
    if (!nodesGroup) return;

    const nodeGroup = nodesGroup.querySelector(`g[data-id="${nodeId}"]`) as SVGGElement;
    if (!nodeGroup) return;

    // Update rectangle position if present (task, parallel, subprocess nodes)
    const rect = nodeGroup.querySelector('rect');
    if (rect) {
        rect.setAttribute('x', `${position.x}`);
        rect.setAttribute('y', `${position.y}`);
    }

    // Update circle position if present (start, end nodes)
    const circle = nodeGroup.querySelector('circle');
    if (circle) {
        circle.setAttribute('cx', `${position.x + options.nodeWidth / 2}`);
        circle.setAttribute('cy', `${position.y + options.nodeHeight / 2}`);
    }

    // Update diamond/polygon position (decision nodes)
    const polygon = nodeGroup.querySelector('polygon');
    if (polygon) {
        const cx = position.x + options.nodeWidth / 2;
        const cy = position.y + options.nodeHeight / 2;
        polygon.setAttribute('points', `${cx},${position.y} ${position.x + options.nodeWidth},${cy} ${cx},${position.y + options.nodeHeight} ${position.x},${cy}`);
    }

    // Update foreignObjects (labels, icons)
    const foreignObjects = nodeGroup.querySelectorAll('foreignObject');
    foreignObjects.forEach((fo) => {
        const foWidth = parseFloat(fo.getAttribute('width') || '0');
        const foHeight = parseFloat(fo.getAttribute('height') || '0');

        // Calculate new position centered on node
        const newX = position.x + (options.nodeWidth - foWidth) / 2;
        const newY = position.y + (options.nodeHeight - foHeight) / 2;

        fo.setAttribute('x', `${newX}`);
        fo.setAttribute('y', `${newY}`);
    });

    // Reset the transform that was applied during drag
    nodeGroup.setAttribute('transform', '');
}

/**
 * Toggle fullscreen mode
 */
export function toggleFullscreen(id: string): void {
    const instance = instances.get(id);
    if (!instance) return;

    if (document.fullscreenElement === instance.container) {
        document.exitFullscreen();
    } else {
        instance.container.requestFullscreen();
    }
}

/**
 * Export as PNG
 */
export async function exportPng(id: string): Promise<void> {
    const instance = instances.get(id);
    if (!instance?.svg) return;

    try {
        // Clone SVG for export
        const clonedSvg = instance.svg.cloneNode(true) as SVGSVGElement;
        const bounds = calculateBounds(instance.data.nodes, instance.options);
        const padding = 60;
        const width = bounds.maxX - bounds.minX + padding * 2;
        const height = bounds.maxY - bounds.minY + padding * 2;

        clonedSvg.setAttribute('width', `${width}`);
        clonedSvg.setAttribute('height', `${height}`);
        clonedSvg.setAttribute('viewBox', `${bounds.minX - padding} ${bounds.minY - padding} ${width} ${height}`);

        // Reset transform on main group
        const mainGroup = clonedSvg.querySelector('.workflow-content');
        if (mainGroup) {
            mainGroup.setAttribute('transform', '');
        }

        // Inline all computed styles for foreignObject elements
        inlineStylesForExport(instance.svg, clonedSvg);

        // Add XML namespace for foreignObject support
        clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        clonedSvg.setAttribute('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');

        // Serialize to string with proper encoding
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(clonedSvg);

        // Add XML declaration
        svgString = '<?xml version="1.0" encoding="UTF-8"?>' + svgString;

        // Create data URL
        const base64 = btoa(unescape(encodeURIComponent(svgString)));
        const dataUrl = `data:image/svg+xml;base64,${base64}`;

        // Create canvas and draw
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        await new Promise<void>((resolve) => {
            img.onload = () => {
                canvas.width = width * 2; // 2x for retina
                canvas.height = height * 2;
                ctx!.scale(2, 2);
                ctx!.fillStyle = '#f9fafb';
                ctx!.fillRect(0, 0, width, height);
                ctx!.drawImage(img, 0, 0, width, height);

                // Download
                const link = document.createElement('a');
                link.download = 'workflow.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                resolve();
            };
            img.onerror = () => {
                // Fallback: download as SVG
                const link = document.createElement('a');
                link.download = 'workflow.svg';
                link.href = dataUrl;
                link.click();
                resolve();
            };
            img.src = dataUrl;
        });
    } catch (e) {
        console.error('PNG export failed', e);
    }
}

/**
 * Inline computed styles from original SVG to cloned SVG for export
 */
function inlineStylesForExport(originalSvg: SVGSVGElement, clonedSvg: SVGSVGElement): void {
    // Find all foreignObject elements and inline their styles
    const originalFOs = originalSvg.querySelectorAll('foreignObject');
    const clonedFOs = clonedSvg.querySelectorAll('foreignObject');

    originalFOs.forEach((originalFO, index) => {
        const clonedFO = clonedFOs[index];
        if (!clonedFO) return;

        // Get all elements inside foreignObject
        const originalElements = originalFO.querySelectorAll('*');
        const clonedElements = clonedFO.querySelectorAll('*');

        originalElements.forEach((originalEl, elIndex) => {
            const clonedEl = clonedElements[elIndex] as HTMLElement;
            if (!clonedEl) return;

            const computed = window.getComputedStyle(originalEl);

            // Copy essential layout and text properties
            const essentialStyles = [
                'display', 'flex-direction', 'justify-content', 'align-items', 'gap',
                'font-family', 'font-size', 'font-weight', 'color', 'text-align',
                'padding', 'margin', 'width', 'height', 'line-height',
                'background-color', 'border-radius', 'overflow'
            ];

            let styleString = '';
            essentialStyles.forEach(prop => {
                const value = computed.getPropertyValue(prop);
                if (value && value !== 'none' && value !== 'normal' && value !== 'auto') {
                    styleString += `${prop}: ${value}; `;
                }
            });

            clonedEl.setAttribute('style', styleString);
            clonedEl.removeAttribute('class');
        });

        // Also style the foreignObject's direct div child
        const clonedDiv = clonedFO.querySelector('div');
        if (clonedDiv) {
            const originalDiv = originalFO.querySelector('div');
            if (originalDiv) {
                const computed = window.getComputedStyle(originalDiv);
                clonedDiv.setAttribute('style', `
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    font-family: ${computed.fontFamily};
                    font-size: ${computed.fontSize};
                    color: ${computed.color};
                    text-align: center;
                    gap: 4px;
                `);
            }
        }
    });
}
