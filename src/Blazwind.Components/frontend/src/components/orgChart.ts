/**
 * OrgChart - Organization chart visualization component
 * Enhanced with child count, better aesthetics, and dynamic options
 */

export interface OrgChartNode {
    id: string;
    name: string;
    title?: string;
    avatar?: string;
    department?: string;
    children?: OrgChartNode[];
    color?: string;
    borderColor?: string;
    [key: string]: any;
}

export interface OrgChartOptions {
    nodeWidth?: number;
    nodeHeight?: number;
    horizontalSpacing?: number;
    verticalSpacing?: number;
    direction?: 'top-to-bottom' | 'left-to-right';
    expandable?: boolean;
    showChildCount?: boolean;
}

interface ChartInstance {
    container: HTMLElement;
    data: OrgChartNode;
    options: OrgChartOptions;
    netRef: any;
    expandedNodes: Set<string>;
}

const instances: Map<string, ChartInstance> = new Map();

// Count total descendants
function countDescendants(node: OrgChartNode): number {
    if (!node.children || node.children.length === 0) return 0;
    return node.children.reduce((sum, child) => sum + 1 + countDescendants(child), 0);
}

export function init(
    container: HTMLElement,
    data: OrgChartNode,
    options: OrgChartOptions,
    netRef: any
): string {
    const id = `org-${crypto.randomUUID()}`;

    const instance: ChartInstance = {
        container,
        data,
        options: {
            nodeWidth: options.nodeWidth || 180,
            nodeHeight: options.nodeHeight || 80,
            horizontalSpacing: options.horizontalSpacing || 20,
            verticalSpacing: options.verticalSpacing || 40,
            direction: options.direction || 'top-to-bottom',
            expandable: options.expandable !== false,
            showChildCount: options.showChildCount !== false,
            ...options
        },
        netRef,
        expandedNodes: new Set()
    };

    // Initially expand all nodes
    expandAllNodes(data, instance.expandedNodes);

    instances.set(id, instance);
    render(id);

    return id;
}

function expandAllNodes(node: OrgChartNode, expandedSet: Set<string>): void {
    expandedSet.add(node.id);
    if (node.children) {
        node.children.forEach(child => expandAllNodes(child, expandedSet));
    }
}

function render(id: string): void {
    const instance = instances.get(id);
    if (!instance) return;

    const { container, data } = instance;
    container.innerHTML = '';
    container.className = 'bw-orgchart overflow-auto';

    const wrapper = document.createElement('div');
    wrapper.className = 'inline-flex flex-col items-center p-6 min-w-full';

    const chart = renderNode(id, data, 0);
    wrapper.appendChild(chart);

    container.appendChild(wrapper);
}

function renderNode(chartId: string, node: OrgChartNode, level: number): HTMLElement {
    const instance = instances.get(chartId);
    if (!instance) return document.createElement('div');

    const { options, expandedNodes, netRef } = instance;
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const childCount = hasChildren ? countDescendants(node) : 0;

    const nodeContainer = document.createElement('div');
    nodeContainer.className = 'flex flex-col items-center';

    // Node box with improved styling
    const nodeBox = document.createElement('div');
    nodeBox.className = 'bw-org-node relative flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer';
    nodeBox.style.width = `${options.nodeWidth}px`;
    nodeBox.style.minHeight = `${options.nodeHeight}px`;
    nodeBox.style.padding = '12px';
    nodeBox.style.borderRadius = '8px';

    // Apply colors and gradients
    if (node.color) {
        nodeBox.style.background = `linear-gradient(135deg, ${node.color}, ${adjustColor(node.color, -20)})`;
        nodeBox.style.border = `2px solid ${node.borderColor || adjustColor(node.color, -30)}`;
        nodeBox.style.boxShadow = `0 4px 12px ${node.color}40`;
        nodeBox.classList.add('text-white');
    } else {
        // nodeBox.style.background = 'linear-gradient(135deg, #ffffff, #f8fafc)';
        // nodeBox.style.border = '1px solid #e2e8f0';
        // nodeBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';

        // Use Tailwind classes for default light/dark mode instead of inline styles for non-colored nodes
        nodeBox.classList.add('bg-gradient-to-br', 'from-white', 'to-slate-50', 'dark:from-gray-800', 'dark:to-gray-900', 'border', 'border-slate-200', 'dark:border-gray-700', 'shadow-sm', 'dark:shadow-gray-900/20');
        // We override the inline style assignments that were here by simply NOT setting them if no color is present
        // But need to ensure previous inline styles are cleared if reused? (renderNode creates new element though)
    }

    // Avatar with ring
    const avatarContainer = document.createElement('div');
    avatarContainer.className = 'relative mb-2';

    if (node.avatar) {
        const avatar = document.createElement('img');
        avatar.src = node.avatar;
        avatar.className = 'w-12 h-12 rounded-full object-cover ring-3 ring-white dark:ring-gray-800 shadow-md';
        avatar.alt = node.name;
        avatarContainer.appendChild(avatar);
    } else {
        const avatarPlaceholder = document.createElement('div');
        avatarPlaceholder.className = 'w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-md ring-3 ring-white dark:ring-gray-800';
        if (node.color) {
            avatarPlaceholder.style.backgroundColor = adjustColor(node.color, 30);
            avatarPlaceholder.style.color = 'white';
        } else {
            avatarPlaceholder.style.backgroundColor = '#dbeafe';
            avatarPlaceholder.style.color = '#1e40af';
        }
        avatarPlaceholder.textContent = node.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        avatarContainer.appendChild(avatarPlaceholder);
    }

    // Child count badge on avatar
    if (hasChildren && options.showChildCount) {
        const badge = document.createElement('div');
        badge.className = 'absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center shadow ring-2 ring-white dark:ring-gray-800';
        badge.textContent = childCount.toString();
        badge.title = `${childCount} alt öğe`;
        avatarContainer.appendChild(badge);
    }

    nodeBox.appendChild(avatarContainer);

    // Name
    const nameEl = document.createElement('div');
    nameEl.className = `font-semibold text-sm truncate w-full ${node.color ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`;
    nameEl.textContent = node.name;
    nodeBox.appendChild(nameEl);

    // Title
    if (node.title) {
        const titleEl = document.createElement('div');
        titleEl.className = `text-xs truncate w-full mt-0.5 ${node.color ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`;
        titleEl.textContent = node.title;
        nodeBox.appendChild(titleEl);
    }

    // Department badge
    if (node.department && !node.title) {
        const deptEl = document.createElement('div');
        deptEl.className = `text-[10px] mt-1 px-2 py-0.5 rounded-full truncate ${node.color ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`;
        deptEl.textContent = node.department;
        nodeBox.appendChild(deptEl);
    }

    // Expand/collapse button with child count
    if (hasChildren && options.expandable) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'absolute -bottom-4 left-1/2 -translate-x-1/2 h-7 px-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center gap-1 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md transition-all text-xs shadow-sm';

        const icon = document.createElement('i');
        icon.className = isExpanded ? 'fa-solid fa-chevron-up text-[10px]' : 'fa-solid fa-chevron-down text-[10px]';
        toggleBtn.appendChild(icon);

        if (!isExpanded) {
            const countSpan = document.createElement('span');
            countSpan.className = 'font-medium';
            countSpan.textContent = childCount.toString();
            toggleBtn.appendChild(countSpan);
        }

        toggleBtn.onclick = (e) => {
            e.stopPropagation();
            if (isExpanded) {
                expandedNodes.delete(node.id);
            } else {
                expandedNodes.add(node.id);
            }
            render(chartId);
        };
        nodeBox.appendChild(toggleBtn);
    }

    // Hover effect
    nodeBox.onmouseenter = () => {
        nodeBox.style.transform = 'translateY(-2px)';
        nodeBox.style.boxShadow = node.color
            ? `0 8px 20px ${node.color}50`
            : '0 8px 20px rgba(0,0,0,0.12)';
    };
    nodeBox.onmouseleave = () => {
        nodeBox.style.transform = 'translateY(0)';
        nodeBox.style.boxShadow = node.color
            ? `0 4px 12px ${node.color}40`
            : '0 2px 8px rgba(0,0,0,0.08)';
    };

    // Click handler
    nodeBox.onclick = () => {
        netRef.invokeMethodAsync('HandleNodeClick', node.id, JSON.stringify(node));
    };

    nodeContainer.appendChild(nodeBox);

    // Children with improved connectors
    if (hasChildren && isExpanded) {
        // Connector line down
        const connectorDown = document.createElement('div');
        connectorDown.style.width = '2px';
        connectorDown.style.height = `${options.verticalSpacing! / 2}px`;
        connectorDown.style.background = 'linear-gradient(to bottom, #94a3b8, #cbd5e1)';
        connectorDown.style.borderRadius = '1px';
        nodeContainer.appendChild(connectorDown);

        // Horizontal connector for multiple children
        if (node.children!.length > 1) {
            const horizontalConnector = document.createElement('div');
            horizontalConnector.style.height = '2px';
            horizontalConnector.style.width = 'calc(100% - 60px)';
            horizontalConnector.style.background = 'linear-gradient(to right, #cbd5e1, #94a3b8, #cbd5e1)';
            horizontalConnector.style.borderRadius = '1px';
            nodeContainer.appendChild(horizontalConnector);
        }

        // Children container
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'flex items-start justify-center';
        childrenContainer.style.gap = `${options.horizontalSpacing}px`;

        node.children!.forEach(child => {
            const childWrapper = document.createElement('div');
            childWrapper.className = 'flex flex-col items-center';

            // Connector line up to child
            const connectorUp = document.createElement('div');
            connectorUp.style.width = '2px';
            connectorUp.style.height = `${options.verticalSpacing! / 2}px`;
            connectorUp.style.background = 'linear-gradient(to bottom, #cbd5e1, #94a3b8)';
            connectorUp.style.borderRadius = '1px';
            childWrapper.appendChild(connectorUp);

            const childNode = renderNode(chartId, child, level + 1);
            childWrapper.appendChild(childNode);

            childrenContainer.appendChild(childWrapper);
        });

        nodeContainer.appendChild(childrenContainer);
    }

    return nodeContainer;
}

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function update(id: string, data: OrgChartNode): void {
    const instance = instances.get(id);
    if (instance) {
        instance.data = data;
        render(id);
    }
}

export function updateOptions(id: string, options: OrgChartOptions): void {
    const instance = instances.get(id);
    if (instance) {
        instance.options = {
            ...instance.options,
            ...options
        };
        render(id);
    }
}

export function expandNode(id: string, nodeId: string): void {
    const instance = instances.get(id);
    if (instance) {
        instance.expandedNodes.add(nodeId);
        render(id);
    }
}

export function collapseNode(id: string, nodeId: string): void {
    const instance = instances.get(id);
    if (instance) {
        instance.expandedNodes.delete(nodeId);
        render(id);
    }
}

export function expandAll(id: string): void {
    const instance = instances.get(id);
    if (instance) {
        expandAllNodes(instance.data, instance.expandedNodes);
        render(id);
    }
}

export function collapseAll(id: string): void {
    const instance = instances.get(id);
    if (instance) {
        instance.expandedNodes.clear();
        instance.expandedNodes.add(instance.data.id); // Keep root expanded
        render(id);
    }
}

export function dispose(id: string): void {
    const instance = instances.get(id);
    if (instance) {
        instance.container.innerHTML = '';
        instances.delete(id);
    }
}
