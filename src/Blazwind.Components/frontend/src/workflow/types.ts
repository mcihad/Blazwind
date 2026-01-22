/**
 * Workflow Types - Core interfaces for the workflow system
 */

export type WorkflowNodeType = 'start' | 'end' | 'task' | 'decision' | 'parallel' | 'subprocess' | string;
export type WorkflowNodeStatus = 'pending' | 'active' | 'completed' | 'error' | 'skipped';
export type WorkflowEdgeType = 'default' | 'conditional' | 'error' | string;

/**
 * Node position in the canvas
 */
export interface NodePosition {
    x: number;
    y: number;
}

/**
 * Workflow node interface
 */
export interface IWorkflowNode {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    status: WorkflowNodeStatus;
    position: NodePosition;
    nodeType: WorkflowNodeType;
    metadata?: Record<string, unknown>;
}

/**
 * Workflow edge interface
 */
export interface IWorkflowEdge {
    id: string;
    from: string;
    to: string;
    label?: string;
    edgeType: WorkflowEdgeType;
    animated: boolean;
}

/**
 * Workflow data
 */
export interface WorkflowData {
    nodes: IWorkflowNode[];
    edges: IWorkflowEdge[];
}

/**
 * Workflow options
 */
export interface WorkflowOptions {
    nodeWidth: number;
    nodeHeight: number;
    horizontalSpacing: number;
    verticalSpacing: number;
    direction: 'horizontal' | 'vertical';
    showLabels: boolean;
    interactive: boolean;
    draggable: boolean;
    animated: boolean;
    fitToScreen: boolean;
    minZoom: number;
    maxZoom: number;
}

/**
 * Default workflow options
 */
export const defaultOptions: WorkflowOptions = {
    nodeWidth: 180,
    nodeHeight: 70,
    horizontalSpacing: 100,
    verticalSpacing: 80,
    direction: 'horizontal',
    showLabels: true,
    interactive: true,
    draggable: true,
    animated: true,
    fitToScreen: true,
    minZoom: 0.1,
    maxZoom: 4
};

/**
 * Status styles for visual rendering
 */
export interface StatusStyle {
    bgStart: string;
    bgEnd: string;
    border: string;
    text: string;
    shadow: string;
    iconColor: string;
}

export const statusStyles: Record<WorkflowNodeStatus, StatusStyle> = {
    pending: {
        bgStart: '#ffffff', bgEnd: '#f9fafb',
        border: '#e5e7eb', text: '#374151',
        shadow: 'rgba(0,0,0,0.05)',
        iconColor: '#9ca3af'
    },
    active: {
        bgStart: '#eff6ff', bgEnd: '#dbeafe',
        border: '#3b82f6', text: '#1e40af',
        shadow: 'rgba(59, 130, 246, 0.25)',
        iconColor: '#2563eb'
    },
    completed: {
        bgStart: '#f0fdf4', bgEnd: '#dcfce7',
        border: '#22c55e', text: '#166534',
        shadow: 'rgba(34, 197, 94, 0.2)',
        iconColor: '#16a34a'
    },
    error: {
        bgStart: '#fef2f2', bgEnd: '#fee2e2',
        border: '#ef4444', text: '#991b1b',
        shadow: 'rgba(239, 68, 68, 0.2)',
        iconColor: '#dc2626'
    },
    skipped: {
        bgStart: '#f3f4f6', bgEnd: '#e5e7eb',
        border: '#9ca3af', text: '#6b7280',
        shadow: 'rgba(0,0,0,0.05)',
        iconColor: '#9ca3af'
    }
};

/**
 * Event types for Blazor interop
 */
export interface WorkflowEvents {
    onNodeClick?: (nodeId: string, node: IWorkflowNode) => void;
    onNodePositionChanged?: (nodeId: string, oldPos: NodePosition, newPos: NodePosition) => void;
    onNodeStatusChanged?: (nodeId: string, oldStatus: WorkflowNodeStatus, newStatus: WorkflowNodeStatus) => void;
    onEdgeClick?: (edgeId: string, edge: IWorkflowEdge) => void;
    onCanvasClick?: (position: NodePosition) => void;
}
