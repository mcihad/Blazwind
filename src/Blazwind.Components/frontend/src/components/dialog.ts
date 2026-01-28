/* ========================================
   Blazwind Dialog JS Interop
   ======================================== */

// Ensure the namespace exists
(window as any).Blazwind = (window as any).Blazwind || {};
(window as any).Blazwind.Dialog = (window as any).Blazwind.Dialog || {};

// Helper: Create overlay
// Helper: Create overlay (renamed to avoid conflicts)
function createDialogOverlay(zIndex: number = 9999, glass: boolean = true): HTMLElement {
    const overlay = document.createElement('div');
    overlay.className = 'bw-dialog-overlay animate-fade-in';
    if (glass) overlay.className += ' bw-dialog-glass';
    overlay.style.zIndex = zIndex.toString();
    return overlay;
}

// Helper: Create container
function createContainer(width: string = '400px', padding: string = 'p-0', animate: boolean = true): HTMLElement {
    const animationClass = animate ? 'animate-scale-in' : '';
    const container = document.createElement('div');
    container.className = `bw-dialog-container ${animationClass}`;
    container.className += ' ' + padding;
    container.style.width = width;
    container.style.maxWidth = '90vw';

    // Stop propagation so clicking container doesn't triggers overlay clock
    container.onclick = (e) => e.stopPropagation();

    return container;
}

// Helper: Close dialog
function closeDialog(overlay: HTMLElement) {
    overlay.classList.add('opacity-0');
    overlay.classList.remove('animate-fade-in');

    const container = overlay.firstElementChild as HTMLElement;
    if (container) {
        container.classList.remove('scale-100', 'animate-scale-in');
        container.classList.add('scale-95', 'opacity-0');
    }

    setTimeout(() => {
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
    }, 200);
}

// 3. Progress (Premium)
export function showProgress(options: any): any {
    const overlay = createDialogOverlay(10000, false);
    const container = createContainer('380px', 'p-6');

    container.innerHTML = `
        <div class="mb-4 flex justify-between items-center">
            <h4 class="bw-dialog-progress-title" id="progress-title">${options.Title || 'Processing'}</h4>
            <span class="bw-dialog-progress-percent" id="progress-percent">0%</span>
        </div>
        <div class="bw-dialog-progress-track">
            <div class="bw-dialog-progress-fill" style="width: 0%" id="progress-bar"></div>
        </div>
        <p class="bw-dialog-progress-message" id="progress-msg">${options.Message || 'Please wait...'}</p>
    `;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    const bar = container.querySelector('#progress-bar') as HTMLElement;
    const txt = container.querySelector('#progress-percent') as HTMLElement;
    const msg = container.querySelector('#progress-msg') as HTMLElement;

    return {
        update: (percent: number, message?: string) => {
            bar.style.width = `${percent}%`;
            txt.innerText = `${percent}%`;
            if (message) msg.innerText = message;
        },
        close: () => closeDialog(overlay)
    };
}

// 4. Loading (Standard - Premium)
export function showLoading(options: any): any {
    const overlay = createDialogOverlay(10000, false);
    const container = document.createElement('div');
    container.className = 'bw-dialog-container px-8 py-6 flex items-center gap-5 animate-scale-in w-auto inline-flex';

    container.innerHTML = `
        <div class="bw-dialog-loading">
            <div class="bw-dialog-spinner"></div>
            <div>
                <h4 class="bw-dialog-title">Loading</h4>
                <p class="bw-dialog-message text-sm text-[var(--bw-color-text-secondary)]">${options.Message || 'Please wait...'}</p>
            </div>
        </div>
    `;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    return {
        call: () => closeDialog(overlay)
    };
}

// 5. Loading (Square - Premium)
export function showSquareLoading(options: any): any {
    const overlay = createDialogOverlay(10000, false);

    const size = '140px';
    const container = document.createElement('div');
    container.className = 'bw-dialog-container flex flex-col items-center justify-center animate-scale-in';
    container.style.width = size;
    container.style.height = size;

    container.innerHTML = `
        <div class="bw-dialog-loading-square">
            <i class="fa-solid fa-circle-notch bw-dialog-icon-loading"></i>
            <span class="text-xs font-semibold tracking-wide opacity-90 text-center px-2 text-[var(--bw-color-text)]">${options.Message || 'Loading'}</span>
        </div>
    `;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    return {
        call: () => closeDialog(overlay)
    };
}

// 6. Busy (Blocking - Premium)
export function showBusy(options: any): any {
    const overlay = createDialogOverlay(11000, false);

    overlay.innerHTML = `
        <div class="bw-dialog-pulse animate-fade-in text-center max-w-md p-6">
            <div class="relative mb-6">
                 <div class="bw-dialog-pulse-icon-bg"></div>
                 <div class="bw-dialog-pulse-icon-wrapper bg-transparent shadow-none">
                    <i class="fa-solid fa-arrows-rotate fa-spin text-5xl text-white relative z-10"></i>
                 </div>
            </div>
            <h2 class="text-2xl font-bold mb-2 tracking-tight text-white">Operation in Progress</h2>
            <p class="bw-dialog-pulse-message opacity-80 font-light">${options.Message || 'Please wait, do not close the page until the operation is complete.'}</p>
        </div>
    `;

    document.body.appendChild(overlay);
    return {
        call: () => closeDialog(overlay)
    };
}

// 7. Countdown (Premium)
export function showCountdown(options: any): any {
    const overlay = createDialogOverlay(1050, false);
    const container = createContainer('360px', 'p-8 text-center');

    let seconds = options.Seconds || 5;

    container.innerHTML = `
        <div class="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
             <svg class="w-full h-full transform -rotate-90 drop-shadow-lg">
                <circle cx="64" cy="64" r="56" stroke="CurrentColor" stroke-width="8" fill="transparent" class="bw-dialog-countdown-circle-track" />
                <circle cx="64" cy="64" r="56" stroke="CurrentColor" stroke-width="8" fill="transparent" class="bw-dialog-countdown-circle-fill" stroke-linecap="round" stroke-dasharray="351.8" stroke-dashoffset="0" id="countdown-circle" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center flex-col">
                <span class="bw-dialog-countdown-text" id="countdown-text">${seconds}</span>
                <span class="bw-dialog-countdown-subtext">Seconds</span>
            </div>
        </div>
        <h3 class="bw-dialog-title mb-2 text-xl font-bold">${options.Title || 'Auto Close'}</h3>
        <p class="text-sm leading-relaxed text-[var(--bw-color-text-secondary)]">${options.Message || 'The window will close automatically...'}</p>
    `;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    const circle = container.querySelector('#countdown-circle') as SVGCircleElement;
    const text = container.querySelector('#countdown-text') as HTMLElement;
    const radius = 56;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = `${circumference}`;

    const interval = setInterval(() => {
        seconds--;
        text.innerText = seconds.toString();
        const offset = circumference - (seconds / (options.Seconds || 5)) * circumference;
        circle.style.strokeDashoffset = offset.toString();

        if (seconds <= 0) {
            clearInterval(interval);
            closeDialog(overlay);
        }
    }, 1000);
}

// 8. Success Animation Dialog (Premium) 
export function showSuccess(options: any): any {
    const overlay = createDialogOverlay(10000, false);
    const container = createContainer('320px', 'p-8 text-center');

    const autoClose = options.AutoClose ?? true;
    const duration = options.Duration || 2000;

    container.innerHTML = `
        <div class="relative w-24 h-24 mx-auto mb-6">
            <svg class="w-full h-full" viewBox="0 0 52 52">
                <circle class="text-[var(--bw-success-100)] dark:text-[var(--bw-success-900)]" cx="26" cy="26" r="25" fill="none" stroke="currentColor" stroke-width="2"/>
                <circle class="text-[var(--bw-color-success)] animate-[dash_0.6s_ease-in-out_forwards]" cx="26" cy="26" r="25" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="157" stroke-dashoffset="157" stroke-linecap="round" style="animation: dash 0.6s ease-in-out forwards;"/>
                <path class="text-[var(--bw-color-success)]" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="32" stroke-dashoffset="32" d="M14 27l7 7 16-16" style="animation: checkmark 0.4s 0.4s ease-in-out forwards;"/>
            </svg>
        </div>
        <h3 class="bw-dialog-title mb-2 text-xl font-bold">${options.Title || 'Success!'}</h3>
        <p class="text-sm text-[var(--bw-color-text-secondary)]">${options.Message || 'Operation completed successfully.'}</p>
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes dash { to { stroke-dashoffset: 0; } }
        @keyframes checkmark { to { stroke-dashoffset: 0; } }
    `;
    container.appendChild(style);

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    if (autoClose) {
        setTimeout(() => closeDialog(overlay), duration);
    }

    return {
        call: () => closeDialog(overlay)
    };
}

// 10. Error Animation Dialog
export function showError(options: any): any {
    const overlay = createDialogOverlay(10000, false);
    const container = createContainer('320px', 'p-8 text-center');

    const autoClose = options.AutoClose ?? true;
    const duration = options.Duration || 2500;

    container.innerHTML = `
        <div class="relative w-24 h-24 mx-auto mb-6">
            <svg class="w-full h-full" viewBox="0 0 52 52">
                <circle class="text-[var(--bw-danger-100)] dark:text-[var(--bw-danger-900)]" cx="26" cy="26" r="25" fill="none" stroke="currentColor" stroke-width="2"/>
                <circle class="text-[var(--bw-color-danger)] animate-[dash_0.6s_ease-in-out_forwards]" cx="26" cy="26" r="25" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="157" stroke-dashoffset="157" stroke-linecap="round" style="animation: dash 0.6s ease-in-out forwards;"/>
                <path class="text-[var(--bw-color-danger)]" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="32" stroke-dashoffset="32" d="M16 16 36 36 M36 16 16 36" style="animation: checkmark 0.4s 0.4s ease-in-out forwards;"/>
            </svg>
        </div>
        <h3 class="bw-dialog-title mb-2 text-xl font-bold">${options.Title || 'Error!'}</h3>
        <p class="text-sm text-[var(--bw-color-text-secondary)]">${options.Message || 'An error occurred.'}</p>
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes dash { to { stroke-dashoffset: 0; } }
        @keyframes checkmark { to { stroke-dashoffset: 0; } }
    `;
    container.appendChild(style);

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    if (autoClose) {
        setTimeout(() => closeDialog(overlay), duration);
    }

    return {
        call: () => closeDialog(overlay)
    };
}

// 9. Image Preview Dialog
export function showImagePreview(options: any): any {
    const overlay = createDialogOverlay(10000, true);
    overlay.className += ' cursor-zoom-out';
    overlay.onclick = () => closeDialog(overlay);

    const container = document.createElement('div');
    container.className = 'relative max-w-[90vw] max-h-[90vh] animate-scale-in';
    container.onclick = (e) => e.stopPropagation();

    container.innerHTML = `
        <img src="${options.Src}" alt="${options.Alt || 'Image'}" class="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain" />
        ${options.Caption ? `<p class="text-white text-center mt-4 text-sm font-medium drop-shadow-lg">${options.Caption}</p>` : ''}
        <button class="bw-dialog-close absolute -top-3 -right-3 !bg-white !text-gray-800 shadow-lg !w-8 !h-8" onclick="this.closest('.fixed').remove()">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    return {
        call: () => closeDialog(overlay)
    };
}

// 10. Pulse Loading (Premium)
export function showPulseLoading(options: any): any {
    const overlay = createDialogOverlay(10000, false);
    const container = document.createElement('div');
    container.className = 'bw-dialog-pulse animate-scale-in';

    container.innerHTML = `
        <div class="relative mb-4">
            <div class="bw-dialog-pulse-icon-bg"></div>
            <div class="bw-dialog-pulse-icon-wrapper">
                <i class="fa-solid fa-${options.Icon || 'sync'} bw-dialog-pulse-icon"></i>
            </div>
        </div>
        <p class="bw-dialog-pulse-message">${options.Message || 'Operation in progress...'}</p>
    `;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    return {
        call: () => closeDialog(overlay)
    };
}



// --- Draggable/Resizable Logic ---

export function makeDraggable(dialogId: string, handleId: string): void {
    const dialog = document.getElementById(dialogId);
    const handle = document.getElementById(handleId);
    if (!dialog || !handle) return;

    let isDragging = false;
    let startX = 0, startY = 0, currentX = 0, currentY = 0;

    handle.style.cursor = 'move';
    if (getComputedStyle(dialog).position === 'static') dialog.style.position = 'relative';

    handle.addEventListener('mousedown', (e: MouseEvent) => {
        if (e.button !== 0) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        // Disable transitions for performance
        dialog!.classList.add('bw-no-transition');

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
    });

    function onMouseMove(event: MouseEvent) {
        if (!isDragging) return;
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        const nextX = currentX + dx;
        const nextY = currentY + dy;
        dialog!.style.left = `${nextX}px`;
        dialog!.style.top = `${nextY}px`;
    }

    function onMouseUp(event: MouseEvent) {
        if (!isDragging) return;

        // Re-enable transitions
        dialog!.classList.remove('bw-no-transition');

        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        currentX += dx;
        currentY += dy;
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}

export function makeResizable(dialogId: string): void {
    const dialog = document.getElementById(dialogId);
    if (!dialog) return;

    const validHandleId = `${dialogId}-resize-handle`;
    let handle = document.getElementById(validHandleId);
    if (!handle) return;

    let isResizing = false;
    let startWidth = 0, startHeight = 0, startX = 0, startY = 0;

    handle.addEventListener('mousedown', (e: MouseEvent) => {
        if (e.button !== 0) return;
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;

        // Disable transitions
        dialog!.classList.add('bw-no-transition');

        const rect = dialog.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
    });

    function onMouseMove(event: MouseEvent) {
        if (!isResizing) return;
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        dialog!.style.width = `${Math.max(startWidth + dx * 2, 200)}px`;
        dialog!.style.height = `${Math.max(startHeight + dy * 2, 150)}px`;
        dialog!.style.maxWidth = 'none';
        dialog!.style.maxHeight = 'none';
    }

    function onMouseUp() {
        if (!isResizing) return;
        isResizing = false;

        // Re-enable transitions
        dialog!.classList.remove('bw-no-transition');

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}

// ---------------------------
// Export global functions
// ---------------------------
const functions = {
    showProgress,
    showLoading,
    showSquareLoading,
    showBusy,
    showCountdown,
    showSuccess,
    showError,
    showImagePreview,
    showPulseLoading,
    makeDraggable,
    enableResize: makeResizable
};

// Expose under Blazwind.Dialog
(window as any).Blazwind.Dialog = {
    ...(window as any).Blazwind.Dialog,
    ...functions
};

// Also expose as window.BlazwindDialog for backward compatibility if needed
(window as any).BlazwindDialog = {
    ...functions
};
