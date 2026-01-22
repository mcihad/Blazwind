/**
 * Node renderer registry - allows registering custom node renderers
 */
import type { IWorkflowNode, WorkflowOptions, StatusStyle } from '../types';

/**
 * Node renderer function type
 */
export type NodeRenderer = (
    group: SVGGElement,
    node: IWorkflowNode,
    options: WorkflowOptions,
    style: StatusStyle,
    scopeId: string
) => void;

/**
 * Registry of node renderers by type
 */
const renderers: Map<string, NodeRenderer> = new Map();

/**
 * Register a custom node renderer
 */
export function registerNodeRenderer(nodeType: string, renderer: NodeRenderer): void {
    renderers.set(nodeType, renderer);
}

/**
 * Get renderer for a node type
 */
export function getNodeRenderer(nodeType: string): NodeRenderer | undefined {
    return renderers.get(nodeType);
}

/**
 * Check if a renderer exists
 */
export function hasNodeRenderer(nodeType: string): boolean {
    return renderers.has(nodeType);
}

/**
 * Get all registered node types
 */
export function getRegisteredNodeTypes(): string[] {
    return Array.from(renderers.keys());
}
