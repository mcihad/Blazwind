/**
 * Blazwind Sidebar Module
 * Mobile-first collapsible sidebar with left/right support
 */

let sidebarState: boolean = false;

export function toggle(): void {
    sidebarState = !sidebarState;
    updateSidebar();
}

export function open(): void {
    sidebarState = true;
    updateSidebar();
}

export function close(): void {
    sidebarState = false;
    updateSidebar();
}

export function isOpen(): boolean {
    return sidebarState;
}

function updateSidebar(): void {
    const sidebar = document.getElementById('bw-sidebar');
    const overlay = document.getElementById('bw-sidebar-overlay');

    if (!sidebar) return;

    // Detect if sidebar is on right side
    const isRight = sidebar.classList.contains('bw-sidebar-right');

    if (sidebarState) {
        // Open
        if (isRight) {
            sidebar.classList.remove('translate-x-full');
        } else {
            sidebar.classList.remove('-translate-x-full');
        }
        sidebar.classList.add('translate-x-0');
        overlay?.classList.remove('hidden');
        overlay?.classList.add('block');
        document.body.style.overflow = 'hidden';
    } else {
        // Close
        sidebar.classList.remove('translate-x-0');
        if (isRight) {
            sidebar.classList.add('translate-x-full');
        } else {
            sidebar.classList.add('-translate-x-full');
        }
        overlay?.classList.add('hidden');
        overlay?.classList.remove('block');
        document.body.style.overflow = '';
    }
}

// Close sidebar when clicking overlay
if (typeof document !== 'undefined') {
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.id === 'bw-sidebar-overlay') {
            close();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebarState) {
            close();
        }
    });

    // Close on window resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && sidebarState) {
            close();
        }
    });
}
