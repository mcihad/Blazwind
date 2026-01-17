
export interface TourStep {
    targetSelector: string;
    title?: string;
    content: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
}

export interface TourOptions {
    smoothScroll?: boolean;
    overlayColor?: string; // e.g. "rgba(0,0,0,0.5)"
    allowInteraction?: boolean;
}

// Singleton state
let steps: TourStep[] = [];
let currentStepIndex = 0;
let options: TourOptions = {};
let overlay: HTMLElement | null = null;
let tooltip: HTMLElement | null = null;
let active = false;

export function start(tourSteps: TourStep[], tourOptions: TourOptions = {}) {
    if (active) end();

    steps = tourSteps;
    options = tourOptions;
    currentStepIndex = 0;
    active = true;

    if (steps.length === 0) return;

    createDOM();
    showStep(0);

    // Global key listener
    document.addEventListener('keydown', handleKey);
    // Resize listener
    window.addEventListener('resize', handleResize);
}

export function end() {
    active = false;
    currentStepIndex = 0;
    steps = [];

    if (overlay) overlay.remove();
    if (tooltip) tooltip.remove();

    overlay = null;
    tooltip = null;

    document.removeEventListener('keydown', handleKey);
    window.removeEventListener('resize', handleResize);
}

export function next() {
    if (currentStepIndex < steps.length - 1) {
        showStep(currentStepIndex + 1);
    } else {
        end();
    }
}

export function prev() {
    if (currentStepIndex > 0) {
        showStep(currentStepIndex - 1);
    }
}

function createDOM() {
    // 1. Overlay (The Spotlight)
    overlay = document.createElement('div');
    overlay.className = 'bw-tour-overlay fixed z-[9998] transition-all duration-300 ease-in-out pointer-events-none';
    // Box shadow style for dimming
    overlay.style.boxShadow = `0 0 0 9999px ${options.overlayColor || 'rgba(0,0,0,0.5)'}`;
    overlay.style.borderRadius = '4px'; // Default
    document.body.appendChild(overlay);

    // 2. Tooltip
    tooltip = document.createElement('div');
    tooltip.className = 'bw-tour-tooltip fixed z-[9999] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded shadow-xl border border-gray-200 dark:border-gray-700 w-[300px] max-w-[90vw] transition-all duration-300';
    document.body.appendChild(tooltip);
}

function showStep(index: number) {
    currentStepIndex = index;
    const step = steps[index];

    // Find target (Visible only)
    const targets = document.querySelectorAll(step.targetSelector);
    let target: HTMLElement | null = null;

    for (let i = 0; i < targets.length; i++) {
        const el = targets[i] as HTMLElement;
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none') {
            target = el;
            break;
        }
    }

    if (!target) {
        console.warn(`Tour target not found or invisible: ${step.targetSelector}`);
        // Auto skip or end?
        // Let's try next step if possible, recursively? 
        // Or just end to avoid infinite loops if all missing.
        // Better: stay on current or end.
        end();
        return;
    }

    // Smooth scroll
    if (options.smoothScroll !== false) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Update Layout
    updateLayout(target, step);

    // Render Tooltip Content
    renderTooltip(step, index);
}

function updateLayout(target: HTMLElement, step: TourStep) {
    if (!overlay || !tooltip) return;

    const rect = target.getBoundingClientRect();
    const padding = 4;

    // Set Overlay (Spotlight) position to match target
    overlay.style.width = `${rect.width + (padding * 2)}px`;
    overlay.style.height = `${rect.height + (padding * 2)}px`;
    overlay.style.top = `${rect.top - padding}px`;
    overlay.style.left = `${rect.left - padding}px`;

    // Calculate Tooltip position (simple placement logic)
    const tooltipRect = tooltip.getBoundingClientRect();
    const placement = step.placement || 'bottom';

    let top = 0;
    let left = 0;
    const margin = 12;

    const targetCenterX = rect.left + rect.width / 2;
    const targetCenterY = rect.top + rect.height / 2;

    if (placement === 'top') {
        top = rect.top - tooltipRect.height - margin;
        left = targetCenterX - tooltipRect.width / 2;
    } else if (placement === 'bottom') {
        top = rect.bottom + margin;
        left = targetCenterX - tooltipRect.width / 2;
    } else if (placement === 'left') {
        top = targetCenterY - tooltipRect.height / 2;
        left = rect.left - tooltipRect.width - margin;
    } else if (placement === 'right') {
        top = targetCenterY - tooltipRect.height / 2;
        left = rect.right + margin;
    }

    // Boundary checks (basic)
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) left = window.innerWidth - tooltipRect.width - 10;
    if (top < 10) top = 10;
    if (top + tooltipRect.height > window.innerHeight - 10) top = window.innerHeight - tooltipRect.height - 10;

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
}

function renderTooltip(step: TourStep, index: number) {
    if (!tooltip) return;

    const isFirst = index === 0;
    const isLast = index === steps.length - 1;

    let html = '';

    // Header
    if (step.title) {
        html += `<h3 class="font-bold text-lg mb-2">${step.title}</h3>`;
    }

    // Body
    html += `<div class="text-sm text-gray-600 dark:text-gray-300 mb-4">${step.content}</div>`;

    // Footer (Progress + Buttons)
    html += `<div class="flex items-center justify-between mt-4">`;

    // Progress
    html += `<div class="text-xs text-gray-400 dark:text-gray-500">${index + 1} / ${steps.length}</div>`;

    // Buttons
    html += `<div class="flex gap-2">`;

    if (!isFirst) {
        html += `<button class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-200 transition" onclick="window.Blazwind.Tour.prev()">Geri</button>`;
    }

    if (isLast) {
        html += `<button class="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition" onclick="window.Blazwind.Tour.end()">Bitir</button>`;
    } else {
        html += `<button class="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition" onclick="window.Blazwind.Tour.next()">İleri</button>`;
    }

    html += `</div></div>`; // End buttons, footer

    // Close button (X)
    html += `<button class="absolute top-2 right-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" onclick="window.Blazwind.Tour.end()">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>`;

    tooltip.innerHTML = html;
}

function handleKey(e: KeyboardEvent) {
    if (!active) return;
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'Escape') end();
}

function handleResize() {
    if (active && steps[currentStepIndex]) {
        // Find visible target again
        const targets = document.querySelectorAll(steps[currentStepIndex].targetSelector);
        let target: HTMLElement | null = null;
        for (let i = 0; i < targets.length; i++) {
            const el = targets[i] as HTMLElement;
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none') {
                target = el;
                break;
            }
        }
        if (target) updateLayout(target, steps[currentStepIndex]);
    }
}
