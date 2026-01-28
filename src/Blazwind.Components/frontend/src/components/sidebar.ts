/**
 * Blazwind Sidebar Module
 * Mobile-first collapsible sidebar with left/right support
 * Features: Overlay, click-to-close, swipe gestures
 */

let sidebarState: boolean = false;
let touchStartX: number = 0;
let touchCurrentX: number = 0;
let isSwiping: boolean = false;
const SWIPE_THRESHOLD = 50;
const EDGE_THRESHOLD = 30; // Distance from edge to start swipe

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

function getSidebar(): HTMLElement | null {
    return document.getElementById('bw-sidebar');
}

function getOverlay(): HTMLElement | null {
    return document.getElementById('bw-sidebar-overlay');
}

function isRightSidebar(): boolean {
    const sidebar = getSidebar();
    return sidebar?.classList.contains('bw-sidebar-right') ?? false;
}

function updateSidebar(): void {
    const sidebar = getSidebar();
    const overlay = getOverlay();

    if (!sidebar) return;

    if (sidebarState) {
        // Open sidebar
        sidebar.classList.add('bw-sidebar-open');
        overlay?.classList.add('bw-sidebar-overlay-visible');
        document.body.style.overflow = 'hidden';
    } else {
        // Close sidebar
        sidebar.classList.remove('bw-sidebar-open');
        overlay?.classList.remove('bw-sidebar-overlay-visible');
        document.body.style.overflow = '';
    }
}

// Handle touch start
function handleTouchStart(e: TouchEvent): void {
    if (window.innerWidth >= 1024) return; // Only mobile

    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchCurrentX = touchStartX;

    const sidebar = getSidebar();
    if (!sidebar) return;

    const isRight = isRightSidebar();
    const screenWidth = window.innerWidth;

    // Check if starting from edge when sidebar is closed
    if (!sidebarState) {
        if (isRight) {
            // Right sidebar: swipe from right edge
            if (touchStartX >= screenWidth - EDGE_THRESHOLD) {
                isSwiping = true;
                sidebar.style.transition = 'none';
            }
        } else {
            // Left sidebar: swipe from left edge
            if (touchStartX <= EDGE_THRESHOLD) {
                isSwiping = true;
                sidebar.style.transition = 'none';
            }
        }
    } else {
        // Sidebar is open, allow swipe to close
        isSwiping = true;
        sidebar.style.transition = 'none';
    }
}

// Handle touch move
function handleTouchMove(e: TouchEvent): void {
    if (!isSwiping || window.innerWidth >= 1024) return;

    const touch = e.touches[0];
    touchCurrentX = touch.clientX;

    const sidebar = getSidebar();
    if (!sidebar) return;

    const deltaX = touchCurrentX - touchStartX;
    const isRight = isRightSidebar();
    const sidebarWidth = sidebar.offsetWidth;

    if (sidebarState) {
        // Sidebar is open - allow dragging to close
        if (isRight) {
            // Right sidebar: drag right to close
            if (deltaX > 0) {
                const translateX = Math.min(deltaX, sidebarWidth);
                sidebar.style.transform = `translateX(${translateX}px)`;
            }
        } else {
            // Left sidebar: drag left to close
            if (deltaX < 0) {
                const translateX = Math.max(deltaX, -sidebarWidth);
                sidebar.style.transform = `translateX(${translateX}px)`;
            }
        }
    } else {
        // Sidebar is closed - allow dragging to open
        if (isRight) {
            // Right sidebar: drag left to open
            if (deltaX < 0) {
                const translateX = Math.max(sidebarWidth + deltaX, 0);
                sidebar.style.transform = `translateX(${translateX}px)`;
            }
        } else {
            // Left sidebar: drag right to open
            if (deltaX > 0) {
                const translateX = Math.min(-sidebarWidth + deltaX, 0);
                sidebar.style.transform = `translateX(${translateX}px)`;
            }
        }
    }
}

// Handle touch end
function handleTouchEnd(): void {
    if (!isSwiping || window.innerWidth >= 1024) return;

    const sidebar = getSidebar();
    if (!sidebar) return;

    // Restore transition
    sidebar.style.transition = '';
    sidebar.style.transform = '';

    const deltaX = touchCurrentX - touchStartX;
    const isRight = isRightSidebar();

    if (sidebarState) {
        // Sidebar is open - check if should close
        if (isRight) {
            // Right sidebar: swipe right to close
            if (deltaX > SWIPE_THRESHOLD) {
                close();
            } else {
                // Stay open - restore state
                updateSidebar();
            }
        } else {
            // Left sidebar: swipe left to close
            if (deltaX < -SWIPE_THRESHOLD) {
                close();
            } else {
                updateSidebar();
            }
        }
    } else {
        // Sidebar is closed - check if should open
        if (isRight) {
            // Right sidebar: swipe left to open
            if (deltaX < -SWIPE_THRESHOLD) {
                open();
            } else {
                updateSidebar();
            }
        } else {
            // Left sidebar: swipe right to open
            if (deltaX > SWIPE_THRESHOLD) {
                open();
            } else {
                updateSidebar();
            }
        }
    }

    isSwiping = false;
}

// Initialize event listeners
if (typeof document !== 'undefined') {
    // Close sidebar when clicking overlay
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.id === 'bw-sidebar-overlay' || target.closest('#bw-sidebar-overlay')) {
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

    // Swipe gestures - use passive: false to allow preventDefault if needed
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
}
