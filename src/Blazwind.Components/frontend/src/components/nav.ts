/**
 * Blazwind NavMenu Module
 * TypeScript-based navigation menu interactions
 */

let groupStates: Map<string, boolean> = new Map();

export function toggleGroup(groupId: string): boolean {
    const group = document.getElementById(groupId);
    if (!group) return false;

    const items = group.querySelector('[data-nav-items]') as HTMLElement;
    const chevron = group.querySelector('[data-nav-chevron]') as HTMLElement;

    if (!items) return false;

    const isExpanded = items.style.display !== 'none';

    if (isExpanded) {
        items.style.display = 'none';
        chevron?.classList.remove('rotate-90');
        groupStates.set(groupId, false);
    } else {
        items.style.display = 'flex';
        chevron?.classList.add('rotate-90');
        groupStates.set(groupId, true);
    }

    return !isExpanded;
}

export function expandGroup(groupId: string): void {
    const group = document.getElementById(groupId);
    if (!group) return;

    const items = group.querySelector('[data-nav-items]') as HTMLElement;
    const chevron = group.querySelector('[data-nav-chevron]') as HTMLElement;

    if (items) {
        items.style.display = 'flex';
        chevron?.classList.add('rotate-90');
        groupStates.set(groupId, true);
    }
}

export function collapseGroup(groupId: string): void {
    const group = document.getElementById(groupId);
    if (!group) return;

    const items = group.querySelector('[data-nav-items]') as HTMLElement;
    const chevron = group.querySelector('[data-nav-chevron]') as HTMLElement;

    if (items) {
        items.style.display = 'none';
        chevron?.classList.remove('rotate-90');
        groupStates.set(groupId, false);
    }
}

export function isGroupExpanded(groupId: string): boolean {
    return groupStates.get(groupId) ?? false;
}

export function initGroup(groupId: string, expanded: boolean): void {
    const group = document.getElementById(groupId);
    if (!group) return;

    const items = group.querySelector('[data-nav-items]') as HTMLElement;
    const chevron = group.querySelector('[data-nav-chevron]') as HTMLElement;

    if (items) {
        items.style.display = expanded ? 'flex' : 'none';
        if (expanded) {
            chevron?.classList.add('rotate-90');
        } else {
            chevron?.classList.remove('rotate-90');
        }
        groupStates.set(groupId, expanded);
    }
}

export function expandParentsForActive(): void {
    // Find all active items
    const activeItems = document.querySelectorAll('[data-active="true"]');

    activeItems.forEach(item => {
        // Walk up the DOM to find parent groups
        let parent = item.parentElement;
        while (parent) {
            if (parent.hasAttribute('data-nav-items')) {
                // This is a nav-items container, show it
                (parent as HTMLElement).style.display = 'flex';

                // Find the group container
                // We look for the previous sibling which should be the button
                const itemsContainer = parent as HTMLElement;
                const groupContainer = itemsContainer.parentElement; // div[data-nav-group]

                if (groupContainer && groupContainer.hasAttribute('data-nav-group')) {
                    const groupId = groupContainer.id;
                    const chevron = groupContainer.querySelector('[data-nav-chevron]');
                    chevron?.classList.add('rotate-90');
                    groupStates.set(groupId, true);
                }
            }
            parent = parent.parentElement;
        }
    });
}


export function filterNav(searchValue: string): void {
    const value = searchValue.toLowerCase().trim();
    const navGroups = document.querySelectorAll('[data-nav-group]');
    const navItems = document.querySelectorAll('[data-nav-item]'); // We need to add this attribute to items

    if (!value) {
        // Reset visibility
        navGroups.forEach(el => (el as HTMLElement).style.display = '');
        navItems.forEach(el => (el as HTMLElement).style.display = '');

        // Restore expanded states
        navGroups.forEach(group => {
            const groupId = group.id;
            const expanded = groupStates.get(groupId) || false;
            initGroup(groupId, expanded);
        });
        return;
    }

    // Hide everything first
    navGroups.forEach(el => (el as HTMLElement).style.display = 'none');
    navItems.forEach(el => (el as HTMLElement).style.display = 'none');

    // Show matching items and walk up
    navItems.forEach(item => {
        const text = item.textContent?.toLowerCase() || '';
        if (text.includes(value)) {
            // Show this item
            (item as HTMLElement).style.display = '';

            // Walk up to show parents
            let parent = item.parentElement;
            while (parent) {
                if (parent.hasAttribute('data-nav-group')) {
                    (parent as HTMLElement).style.display = '';
                    // Also force expand this group for search results
                    // const groupId = parent.id;
                    const itemsDiv = parent.querySelector('[data-nav-items]') as HTMLElement;
                    if (itemsDiv) itemsDiv.style.display = 'flex';
                }
                if (parent.hasAttribute('data-nav-items')) {
                    // Ensure the items container is visible
                    (parent as HTMLElement).style.display = 'flex';
                }
                parent = parent.parentElement;

                // Stop at root nav container
                if (parent?.tagName === 'NAV') break;
            }
        }
    });
}

// Auto-init when DOM is ready
function init() {
    expandParentsForActive();
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Use setTimeout to ensure Blazor has finished rendering
        setTimeout(init, 50);
    }
}
