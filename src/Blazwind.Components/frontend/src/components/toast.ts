/**
 * Blazwind Toast Module
 * TypeScript-based toast notifications with Tailwind CSS
 */

export interface ToastOptions {
    id?: string;
    title?: string;
    message: string;
    variant?: 'success' | 'danger' | 'warning' | 'info' | 'primary' | 'secondary' | 'dark';
    duration?: number;
    showProgress?: boolean;
    showClose?: boolean;
    position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
    actions?: ToastAction[];
}

export interface ToastAction {
    text: string;
    variant?: string; // success, danger, etc.
    actionId: string;
}

interface ToastInstance {
    id: string;
    element: HTMLElement;
    timer?: number;
    position: string;
    duration: number;
    // Swipe tracking
    startX?: number;
    startY?: number;
    currentX?: number;
    isDragging?: boolean;
}

const toasts: Map<string, ToastInstance> = new Map();
const containers: Map<string, HTMLElement> = new Map();

const variantConfig: any = {
    success: {
        icon: 'fa-solid fa-circle-check',
        borderClass: 'bw-toast-border-success',
        iconClass: 'bw-toast-icon-success',
        progressClass: 'bw-toast-progress-success',
    },
    danger: {
        icon: 'fa-solid fa-circle-xmark',
        borderClass: 'bw-toast-border-danger',
        iconClass: 'bw-toast-icon-danger',
        progressClass: 'bw-toast-progress-danger',
    },
    warning: {
        icon: 'fa-solid fa-triangle-exclamation',
        borderClass: 'bw-toast-border-warning',
        iconClass: 'bw-toast-icon-warning',
        progressClass: 'bw-toast-progress-warning',
    },
    info: {
        icon: 'fa-solid fa-circle-info',
        borderClass: 'bw-toast-border-info',
        iconClass: 'bw-toast-icon-info',
        progressClass: 'bw-toast-progress-info',
    },
    primary: {
        icon: 'fa-solid fa-bell',
        borderClass: 'bw-toast-border-primary',
        iconClass: 'bw-toast-icon-primary',
        progressClass: 'bw-toast-progress-primary',
    },
    secondary: {
        icon: 'fa-solid fa-circle-info',
        borderClass: 'bw-toast-border-secondary',
        iconClass: 'bw-toast-icon-secondary',
        progressClass: 'bw-toast-progress-secondary',
    },
    dark: {
        icon: 'fa-solid fa-circle-info',
        borderClass: 'bw-toast-border-dark',
        iconClass: 'bw-toast-icon-dark',
        progressClass: 'bw-toast-progress-dark',
        isDark: true
    }
};

const positionClasses: Record<string, string> = {
    'top-right': 'top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4 items-center sm:items-end',
    'top-left': 'top-4 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-4 items-center sm:items-start',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-right': 'bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4 items-center sm:items-end',
    'bottom-left': 'bottom-4 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-4 items-center sm:items-start',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center'
};

// Swipe gesture configuration
const SWIPE_THRESHOLD = 80; // Minimum distance to trigger dismiss
const SWIPE_VELOCITY_THRESHOLD = 0.3; // Minimum velocity (px/ms)

function setupSwipeGesture(toast: HTMLElement, instance: ToastInstance, position: string): void {
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
        const touch = e.touches[0];
        instance.startX = touch.clientX;
        instance.startY = touch.clientY;
        instance.currentX = touch.clientX;
        instance.isDragging = false;
        startTime = Date.now();

        // Pause timer while touching
        if (instance.timer) {
            clearTimeout(instance.timer);
        }

        // Pause progress animation
        const progress = toast.querySelector('.bw-toast-progress') as HTMLElement;
        if (progress) progress.style.animationPlayState = 'paused';
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (instance.startX === undefined || instance.startY === undefined) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - instance.startX;
        const deltaY = touch.clientY - instance.startY;

        // Only start dragging if horizontal movement is greater than vertical
        if (!instance.isDragging && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
            instance.isDragging = true;
        }

        if (instance.isDragging) {
            e.preventDefault();
            instance.currentX = touch.clientX;

            // Apply transform with resistance at edges
            const resistance = 0.5;
            let translateX = deltaX;

            // Determine swipe direction based on position
            const isLeftPosition = position.includes('left');
            const isRightPosition = position.includes('right');

            // Apply resistance when swiping in "wrong" direction
            if (isLeftPosition && deltaX > 0) {
                translateX = deltaX * resistance;
            } else if (isRightPosition && deltaX < 0) {
                translateX = deltaX * resistance;
            }

            // Calculate opacity based on swipe distance
            const absX = Math.abs(translateX);
            const opacity = Math.max(0.3, 1 - (absX / (SWIPE_THRESHOLD * 2)));

            toast.style.transform = `translateX(${translateX}px)`;
            toast.style.opacity = String(opacity);
            toast.style.transition = 'none';
        }
    };

    const handleTouchEnd = () => {
        if (!instance.isDragging || instance.startX === undefined || instance.currentX === undefined) {
            // Resume progress and timer if not dragging
            const progress = toast.querySelector('.bw-toast-progress') as HTMLElement;
            if (progress) progress.style.animationPlayState = 'running';
            if (instance.duration > 0) {
                instance.timer = window.setTimeout(() => removeToast(instance.id, position), instance.duration);
            }
            return;
        }

        const deltaX = instance.currentX - instance.startX;
        const absX = Math.abs(deltaX);
        const elapsed = Date.now() - startTime;
        const velocity = absX / elapsed;

        const isLeftPosition = position.includes('left');
        const isRightPosition = position.includes('right');
        const isCenterPosition = position.includes('center');

        // Determine if swipe should dismiss
        let shouldDismiss = false;
        let dismissDirection = 'right';

        if (isCenterPosition) {
            // Center: swipe in any direction
            shouldDismiss = absX > SWIPE_THRESHOLD || velocity > SWIPE_VELOCITY_THRESHOLD;
            dismissDirection = deltaX > 0 ? 'right' : 'left';
        } else if (isLeftPosition) {
            // Left position: swipe left to dismiss
            shouldDismiss = (deltaX < -SWIPE_THRESHOLD || (deltaX < 0 && velocity > SWIPE_VELOCITY_THRESHOLD));
            dismissDirection = 'left';
        } else if (isRightPosition) {
            // Right position: swipe right to dismiss
            shouldDismiss = (deltaX > SWIPE_THRESHOLD || (deltaX > 0 && velocity > SWIPE_VELOCITY_THRESHOLD));
            dismissDirection = 'right';
        }

        if (shouldDismiss) {
            // Animate out
            const translateX = dismissDirection === 'right' ? '100%' : '-100%';
            toast.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
            toast.style.transform = `translateX(${translateX})`;
            toast.style.opacity = '0';

            setTimeout(() => {
                removeToast(instance.id, position);
            }, 200);
        } else {
            // Snap back
            toast.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease';
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';

            // Resume progress and timer
            const progress = toast.querySelector('.bw-toast-progress') as HTMLElement;
            if (progress) progress.style.animationPlayState = 'running';
            if (instance.duration > 0) {
                instance.timer = window.setTimeout(() => removeToast(instance.id, position), instance.duration);
            }
        }

        // Reset state
        instance.isDragging = false;
        instance.startX = undefined;
        instance.startY = undefined;
        instance.currentX = undefined;
    };

    toast.addEventListener('touchstart', handleTouchStart, { passive: true });
    toast.addEventListener('touchmove', handleTouchMove, { passive: false });
    toast.addEventListener('touchend', handleTouchEnd, { passive: true });
    toast.addEventListener('touchcancel', handleTouchEnd, { passive: true });
}

function getOrCreateContainer(position: string): HTMLElement {
    if (containers.has(position)) return containers.get(position)!;

    const container = document.createElement('div');
    container.id = `bw-toast-container-${position}`;

    // Determine flex direction
    const isBottom = position.startsWith('bottom');
    const flexDir = isBottom ? 'flex-col-reverse' : 'flex-col';

    // Added pointer-events-none to container so clicks pass through empty areas
    container.className = `fixed z-[9990] flex ${flexDir} gap-3 w-[calc(100%-2rem)] max-w-sm pointer-events-none transition-all duration-300 ${positionClasses[position]}`;
    document.body.appendChild(container);
    containers.set(position, container);
    return container;
}

function generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function showToast(options: ToastOptions, dotnetRef?: any): string {
    const id = options.id || generateId();
    let variant = options.variant || 'info';
    const duration = options.duration ?? 5000;
    const showProgress = options.showProgress ?? true;
    const showClose = options.showClose ?? true;
    const position = options.position || 'top-right';

    // Fallback/Correction
    if (!variantConfig[variant]) {
        if (variant === 'error' as any) variant = 'danger';
        else variant = 'info';
    }

    const config = variantConfig[variant];
    const containerEl = getOrCreateContainer(position);

    const toast = document.createElement('div');
    toast.id = id;

    // Animation Logic
    let animateClass = 'animate-[slideIn_0.3s_cubic-bezier(0.16,1,0.3,1)]';
    if (position.includes('left')) animateClass = 'animate-[slideInLeft_0.3s_cubic-bezier(0.16,1,0.3,1)]';
    if (position.includes('center')) animateClass = 'animate-[fadeIn_0.5s_ease-out]';

    toast.className = `
        bw-toast
        pointer-events-auto
        ${config.borderClass}
        ${config.isDark ? 'bw-toast-dark' : ''}
        ${animateClass}
        group
    `.replace(/\s+/g, ' ').trim();

    // Generate Actions HTML if actions exist
    let actionsHtml = '';
    if (options.actions && options.actions.length > 0) {
        actionsHtml = `<div class="mt-2 flex items-center gap-2">`;
        options.actions.forEach(action => {
            const actionVariant = action.variant || variant;
            actionsHtml += `
                 <button type="button" class="bw-toast-action-${action.actionId} bw-toast-action bw-toast-action-${actionVariant}">
                     ${action.text}
                 </button>
             `;
        });
        actionsHtml += `</div>`;
    }

    toast.innerHTML = `
        <div class="flex-shrink-0 mt-0.5">
            <i class="${config.icon} ${config.iconClass} text-lg"></i>
        </div>
        <div class="flex-1 min-w-0">
            ${options.title ? `<h4 class="bw-toast-title">${options.title}</h4>` : ''}
            <p class="bw-toast-message">${options.message}</p>
            ${actionsHtml}
        </div>
        ${showClose ? `
            <div class="flex-shrink-0 -mr-1 -mt-1 ml-2">
                <button type="button" class="bw-toast-close" aria-label="Close">
                    <i class="fa-solid fa-xmark text-sm"></i>
                </button>
            </div>
        ` : ''}
        ${showProgress && duration > 0 ? `
            <div class="bw-toast-progress-track">
                <div class="bw-toast-progress ${config.progressClass}" style="animation: shrink ${duration}ms linear forwards;"></div>
            </div>
        ` : ''}
    `;

    containerEl.prepend(toast);

    // Bind Action Clicks
    if (options.actions && dotnetRef) {
        options.actions.forEach(action => {
            const btn = toast.querySelector(`.bw-toast-action-${action.actionId}`);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Invoke dotnet method
                    dotnetRef.invokeMethodAsync('HandleToastAction', action.actionId);
                    // Dismiss toast? Usually yes.
                    removeToast(id, position);
                });
            }
        });
    }

    const instance: ToastInstance = { id, element: toast, duration, position, timer: undefined }; // removed timer here, set below

    // Pause progress on hover logic...
    if (showProgress && duration > 0) {
        toast.addEventListener('mouseenter', () => {
            const progress = toast.querySelector('.bw-toast-progress') as HTMLElement;
            if (progress) progress.style.animationPlayState = 'paused';
            if (instance.timer) clearTimeout(instance.timer);
        });

        toast.addEventListener('mouseleave', () => {
            const progress = toast.querySelector('.bw-toast-progress') as HTMLElement;
            if (progress) progress.style.animationPlayState = 'running';
            if (instance.duration > 0) {
                instance.timer = window.setTimeout(() => removeToast(id, position), duration);
            }
        });
    }

    const closeBtn = toast.querySelector('.bw-toast-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeToast(id, position);
        });
    }

    // Swipe to dismiss (mobile)
    setupSwipeGesture(toast, instance, position);

    let timer: number | undefined;
    if (duration > 0) {
        timer = window.setTimeout(() => removeToast(id, position), duration);
    }
    instance.timer = timer;

    toasts.set(id, instance);
    return id;
}

export function removeToast(id: string, cachedPosition?: string): void {
    const instance = toasts.get(id);
    if (!instance) return;

    if (instance.timer) {
        clearTimeout(instance.timer);
    }

    const pos = cachedPosition || instance.position;

    instance.element.style.transition = 'all 0.3s ease-in';
    instance.element.style.opacity = '0';
    instance.element.style.transform = pos.includes('left') ? 'translateX(-100%)' : (pos.includes('center') ? 'translateY(-20px)' : 'translateX(100%)');

    setTimeout(() => {
        instance.element.style.maxHeight = '0';
        instance.element.style.marginBottom = '0';
        instance.element.style.marginTop = '0';
        instance.element.style.padding = '0';
        instance.element.style.border = 'none';
    }, 150);

    setTimeout(() => {
        instance.element.remove();
        toasts.delete(id);

        const container = containers.get(pos);
        if (container && container.childElementCount === 0) {
            container.remove();
            containers.delete(pos);
        }
    }, 350);
}

export function clearToasts(): void {
    toasts.forEach((_, id) => removeToast(id));
}

// Convenience methods
export function success(message: string, title?: string, duration?: number): string {
    return showToast({ message, title, variant: 'success', duration });
}

export function error(message: string, title?: string, duration?: number): string {
    return showToast({ message, title, variant: 'danger', duration });
}

export function warning(message: string, title?: string, duration?: number): string {
    return showToast({ message, title, variant: 'warning', duration });
}

export function info(message: string, title?: string, duration?: number): string {
    return showToast({ message, title, variant: 'info', duration });
}
