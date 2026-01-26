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
}

const toasts: Map<string, ToastInstance> = new Map();
const containers: Map<string, HTMLElement> = new Map();

function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (char) => {
        switch (char) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            case "'":
                return '&#39;';
            default:
                return char;
        }
    });
}

const variantConfig: any = {
    success: {
        icon: 'fa-solid fa-circle-check',
        borderColor: 'border-l-emerald-500',
        contentTitle: 'text-gray-900 dark:text-gray-100',
        contentMessage: 'text-gray-600 dark:text-gray-300',
        iconClass: 'text-emerald-500',
        progressClass: 'bg-emerald-500',
        closeClass: 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
        btnClass: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
    },
    danger: {
        icon: 'fa-solid fa-circle-xmark',
        borderColor: 'border-l-red-500',
        contentTitle: 'text-gray-900 dark:text-gray-100',
        contentMessage: 'text-gray-600 dark:text-gray-300',
        iconClass: 'text-red-500',
        progressClass: 'bg-red-500',
        closeClass: 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
        btnClass: 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
    },
    warning: {
        icon: 'fa-solid fa-triangle-exclamation',
        borderColor: 'border-l-amber-500',
        contentTitle: 'text-gray-900 dark:text-gray-100',
        contentMessage: 'text-gray-600 dark:text-gray-300',
        iconClass: 'text-amber-500',
        progressClass: 'bg-amber-500',
        closeClass: 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
        btnClass: 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
    },
    info: {
        icon: 'fa-solid fa-circle-info',
        borderColor: 'border-l-blue-500',
        contentTitle: 'text-gray-900 dark:text-gray-100',
        contentMessage: 'text-gray-600 dark:text-gray-300',
        iconClass: 'text-blue-500',
        progressClass: 'bg-blue-500',
        closeClass: 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
        btnClass: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
    },
    primary: {
        icon: 'fa-solid fa-bell',
        borderColor: 'border-l-indigo-500',
        contentTitle: 'text-gray-900 dark:text-gray-100',
        contentMessage: 'text-gray-600 dark:text-gray-300',
        iconClass: 'text-indigo-500',
        progressClass: 'bg-indigo-500',
        closeClass: 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
        btnClass: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
    },
    secondary: {
        icon: 'fa-solid fa-circle-info',
        borderColor: 'border-l-gray-500',
        contentTitle: 'text-gray-900 dark:text-gray-100',
        contentMessage: 'text-gray-600 dark:text-gray-300',
        iconClass: 'text-gray-500',
        progressClass: 'bg-gray-500',
        closeClass: 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
        btnClass: 'bg-gray-600 text-white hover:bg-gray-700 shadow-sm'
    },
    dark: {
        icon: 'fa-solid fa-circle-info',
        borderColor: 'border-l-gray-800',
        contentTitle: 'text-gray-100',
        contentMessage: 'text-gray-300',
        iconClass: 'text-gray-100',
        progressClass: 'bg-gray-400',
        closeClass: 'text-gray-400 hover:text-white hover:bg-gray-700',
        btnClass: 'bg-gray-700 text-white hover:bg-gray-600 shadow-sm',
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

    const bgClass = config.isDark ? 'bg-gray-900 shadow-gray-900/20' : 'bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10';

    toast.className = `
        pointer-events-auto
        flex items-start gap-3 p-4
        ${bgClass}
        border-l-4 ${config.borderColor}
        rounded-sm
        ${animateClass}
        relative overflow-hidden
        w-full transition-all duration-300
        group
    `.replace(/\s+/g, ' ').trim();

    // Generate Actions HTML if actions exist
    let actionsHtml = '';
    if (options.actions && options.actions.length > 0) {
        actionsHtml = `<div class="mt-2 flex items-center gap-2">`;
        options.actions.forEach(action => {
            // Determine button style based on action variant, fallback to current config btnClass if not specified
            // Assuming action.variant maps to config keys
            let btnClass = config.btnClass;
            if (action.variant && variantConfig[action.variant]) {
                btnClass = variantConfig[action.variant].btnClass;
            }

            actionsHtml += `
                 <button type="button" class="bw-toast-action-${action.actionId} text-xs font-semibold px-2 py-1 rounded transition-colors ${btnClass}">
                     ${escapeHtml(action.text)}
                 </button>
             `;
        });
        actionsHtml += `</div>`;
    }

    const safeTitle = options.title ? escapeHtml(options.title) : '';
    const safeMessage = escapeHtml(options.message);

    toast.innerHTML = `
        <div class="flex-shrink-0 mt-0.5">
            <i class="${config.icon} ${config.iconClass} text-lg"></i>
        </div>
        <div class="flex-1 min-w-0">
            ${options.title ? `<h4 class="font-semibold text-sm mb-0.5 leading-5 ${config.contentTitle}">${safeTitle}</h4>` : ''}
            <p class="text-sm leading-5 font-normal ${config.contentMessage}">${safeMessage}</p>
            ${actionsHtml}
        </div>
        ${showClose ? `
            <div class="flex-shrink-0 -mr-1 -mt-1 ml-2">
                <button type="button" class="bw-toast-close ${config.closeClass} rounded p-1 inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300" aria-label="Kapat">
                    <i class="fa-solid fa-xmark text-sm"></i>
                </button>
            </div>
        ` : ''}
        ${showProgress && duration > 0 ? `
            <div class="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-100/50 dark:bg-gray-700/50">
                <div class="bw-toast-progress h-full ${config.progressClass}" style="width: 100%; animation: shrink ${duration}ms linear forwards;"></div>
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
