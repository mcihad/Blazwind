// --- JS Dialog implementations ---

function createOverlay(zIndex: number = 9999, glass: boolean = true): HTMLElement {
    const overlay = document.createElement('div');
    const backdropClass = glass ? 'bg-gray-900/80 backdrop-blur-sm' : 'bg-gray-900/80';
    // z-index dynamically set
    overlay.className = `fixed inset-0 flex items-center justify-center p-4 ${backdropClass} transition-opacity duration-300 animate-fade-in`;
    overlay.style.zIndex = zIndex.toString();
    return overlay;
}

function createContainer(width: string = '400px', padding: string = 'p-0', animate: boolean = true): HTMLElement {
    const animationClass = animate ? 'animate-scale-in' : '';
    // High z-index relative to overlay
    const container = document.createElement('div');
    container.className = `bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] ${animationClass} transition-all duration-300 transform scale-100`;
    container.className += ' ' + padding;
    container.style.width = width;
    container.style.maxWidth = '90vw';

    // Stop propagation so clicking container doesn't triggers overlay clock
    container.onclick = (e) => e.stopPropagation();

    return container;
}

// Helper to create FontAwesome Icon HTML based on variant - REMOVED (Legacy)
// Helper to get header background class based on variant - REMOVED (Legacy)
// Helper to create buttons - REMOVED (Legacy)

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

// Legacy Alert/Confirm/Input functions removed as they are now Razor Components.
// Only Premium Dialogs (Progress, Loading, Busy, Countdown) remain below.

// 3. Progress (Premium)
export function showProgress(options: any): any {
    const overlay = createOverlay(10000); // Higher than others
    const container = createContainer('380px', 'p-6');

    container.innerHTML = `
        <div class="mb-4 flex justify-between items-center">
            <h4 class="font-bold text-gray-800 dark:text-gray-100" id="progress-title">${options.Title || 'İşlem Yapılıyor'}</h4>
            <span class="text-sm font-semibold text-blue-600" id="progress-percent">0%</span>
        </div>
        <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 mb-3 overflow-hidden">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out shadow-inner" style="width: 0%" id="progress-bar"></div>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 text-center font-medium" id="progress-msg">${options.Message || 'Lütfen bekleyin...'}</p>
    `;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    const bar = container.querySelector('#progress-bar') as HTMLElement;
    const txt = container.querySelector('#progress-percent') as HTMLElement;
    const msg = container.querySelector('#progress-msg') as HTMLElement;

    // Return object matching C# expectations
    return {
        update: (percent: number, message?: string) => {
            bar.style.width = `${percent}%`;
            txt.innerText = `${percent}%`;
            if (message) msg.innerText = message;
        },
        close: () => closeDialog(overlay) // Keep 'close' here for ProgressHandle
    };
}

// 4. Loading (Standard - Premium)
export function showLoading(options: any): any {
    const overlay = createOverlay(10000);
    const container = document.createElement('div');
    container.className = 'bg-white dark:bg-gray-800 rounded-2xl shadow-xl px-8 py-6 flex items-center gap-5 animate-scale-in border border-gray-200 dark:border-gray-700';

    container.innerHTML = `
        <div class="relative flex-shrink-0">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"></div>
        </div>
        <div>
            <h4 class="font-semibold text-gray-900 dark:text-gray-100 text-lg">Yükleniyor</h4>
            <p class="text-gray-500 dark:text-gray-400 text-sm">${options.Message || 'Lütfen bekleyin...'}</p>
        </div>
    `;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // FIX: Using 'call' to match C# LoadingHandle
    return {
        call: () => closeDialog(overlay)
    };
}

// 5. Loading (Square - Premium)
export function showSquareLoading(options: any): any {
    const overlay = createOverlay(10000, false); // No blur initially? Let's add slight blur

    const size = '140px';
    const container = document.createElement('div');
    // Adaptive theme for square loading
    container.className = 'bg-white/90 dark:bg-gray-900/95 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-gray-800 dark:text-white backdrop-blur-md animate-scale-in border border-gray-200 dark:border-gray-700/50';
    container.style.width = size;
    container.style.height = size;

    container.innerHTML = `
        <i class="fa-solid fa-circle-notch fa-spin text-4xl mb-4 text-blue-600 dark:text-blue-400"></i>
        <span class="text-xs font-semibold tracking-wide opacity-90 text-center px-2">${options.Message || 'Yükleniyor'}</span>
    `;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    return {
        call: () => closeDialog(overlay)
    };
}

// 6. Busy (Blocking - Premium)
export function showBusy(options: any): any {
    const overlay = createOverlay(11000, true);

    // Minimalist centered content
    overlay.innerHTML = `
        <div class="flex flex-col items-center justify-center text-white animate-fade-in text-center max-w-md p-6">
            <div class="relative mb-6">
                 <div class="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                 <i class="fa-solid fa-arrows-rotate fa-spin text-5xl relative z-10"></i>
            </div>
            <h2 class="text-2xl font-bold mb-2 tracking-tight">İşlem Sürüyor</h2>
            <p class="text-gray-300 font-light text-lg">${options.Message || 'Lütfen bekleyiniz, işlem tamamlanana kadar sayfayı kapatmayınız.'}</p>
        </div>
    `;

    document.body.appendChild(overlay);
    return {
        call: () => closeDialog(overlay)
    };
}

// 7. Countdown (Premium)
export function showCountdown(options: any): any {
    // FIX: Return a manual close capability just in case
    // C# side InvokeVoidAsync means we might not get the handle back easily unless we change signature
    // But mostly we fire and forget.

    const overlay = createOverlay(1050);
    const container = createContainer('360px', 'p-8 text-center');

    let seconds = options.Seconds || 5;

    container.innerHTML = `
        <div class="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
             <svg class="w-full h-full transform -rotate-90 drop-shadow-lg">
                <circle cx="64" cy="64" r="56" stroke="CurrentColor" stroke-width="8" fill="transparent" class="text-gray-100 dark:text-gray-700" />
                <circle cx="64" cy="64" r="56" stroke="CurrentColor" stroke-width="8" fill="transparent" class="text-blue-500 transition-all duration-1000 ease-linear" stroke-linecap="round" stroke-dasharray="351.8" stroke-dashoffset="0" id="countdown-circle" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center flex-col">
                <span class="text-4xl font-black text-gray-800 dark:text-gray-100" id="countdown-text">${seconds}</span>
                <span class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Saniye</span>
            </div>
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">${options.Title || 'Otomatik Kapanış'}</h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">${options.Message || 'Pencere otomatik olarak kapanacak...'}</p>
    `;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    const circle = container.querySelector('#countdown-circle') as SVGCircleElement;
    const text = container.querySelector('#countdown-text') as HTMLElement;
    const radius = 56;
    const circumference = 2 * Math.PI * radius;

    // Initial State
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

// 8. Success Animation Dialog (Premium) - Shows animated checkmark
export function showSuccess(options: any): any {
    const overlay = createOverlay(10000);
    const container = createContainer('320px', 'p-8 text-center');

    const autoClose = options.AutoClose ?? true;
    const duration = options.Duration || 2000;

    container.innerHTML = `
        <div class="relative w-24 h-24 mx-auto mb-6">
            <svg class="w-full h-full" viewBox="0 0 52 52">
                <circle class="text-emerald-100 dark:text-emerald-900" cx="26" cy="26" r="25" fill="none" stroke="currentColor" stroke-width="2"/>
                <circle class="text-emerald-500 animate-[dash_0.6s_ease-in-out_forwards]" cx="26" cy="26" r="25" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="157" stroke-dashoffset="157" stroke-linecap="round" style="animation: dash 0.6s ease-in-out forwards;"/>
                <path class="text-emerald-500" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="32" stroke-dashoffset="32" d="M14 27l7 7 16-16" style="animation: checkmark 0.4s 0.4s ease-in-out forwards;"/>
            </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">${options.Title || 'Başarılı!'}</h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm">${options.Message || 'İşlem başarıyla tamamlandı.'}</p>
    `;

    // Add keyframes
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

// 10. Error Animation Dialog (Premium) - Shows animated X
export function showError(options: any): any {
    const overlay = createOverlay(10000);
    const container = createContainer('320px', 'p-8 text-center');

    const autoClose = options.AutoClose ?? true;
    const duration = options.Duration || 2500;

    container.innerHTML = `
        <div class="relative w-24 h-24 mx-auto mb-6">
            <svg class="w-full h-full" viewBox="0 0 52 52">
                <circle class="text-red-100 dark:text-red-900" cx="26" cy="26" r="25" fill="none" stroke="currentColor" stroke-width="2"/>
                <circle class="text-red-500 animate-[dash_0.6s_ease-in-out_forwards]" cx="26" cy="26" r="25" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="157" stroke-dashoffset="157" stroke-linecap="round" style="animation: dash 0.6s ease-in-out forwards;"/>
                <path class="text-red-500" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="32" stroke-dashoffset="32" d="M16 16 36 36 M36 16 16 36" style="animation: checkmark 0.4s 0.4s ease-in-out forwards;"/>
            </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">${options.Title || 'Hata!'}</h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm">${options.Message || 'Bir hata oluştu.'}</p>
    `;

    // Add keyframes regarding if they don't exist, but they likely exist from success. 
    // Safest is to add them again scoped or check. 
    // Actually dash and checkmark animations are generic. We can reuse them.
    // reuse dash. reuse checkmark (used for X drawing too).
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

// 9. Image Preview Dialog (Premium)
export function showImagePreview(options: any): any {
    const overlay = createOverlay(10000, true);
    overlay.className += ' cursor-zoom-out';
    overlay.onclick = () => closeDialog(overlay);

    const container = document.createElement('div');
    container.className = 'relative max-w-[90vw] max-h-[90vh] animate-scale-in';
    container.onclick = (e) => e.stopPropagation();

    container.innerHTML = `
        <img src="${options.Src}" alt="${options.Alt || 'Görsel'}" class="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain" />
        ${options.Caption ? `<p class="text-white text-center mt-4 text-sm font-medium drop-shadow-lg">${options.Caption}</p>` : ''}
        <button class="absolute -top-3 -right-3 w-8 h-8 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onclick="this.closest('.fixed').remove()">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    return {
        call: () => closeDialog(overlay)
    };
}

// 10. Pulse Loading (Premium) - Minimal pulse animation
export function showPulseLoading(options: any): any {
    const overlay = createOverlay(10000);
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center justify-center animate-scale-in';

    container.innerHTML = `
        <div class="relative mb-4">
            <div class="w-16 h-16 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            <div class="absolute inset-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <i class="fa-solid fa-${options.Icon || 'sync'} text-white text-xl"></i>
            </div>
        </div>
        <p class="text-white font-medium text-lg drop-shadow-lg">${options.Message || 'İşlem devam ediyor...'}</p>
    `;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    return {
        call: () => closeDialog(overlay)
    };
}




// --- Draggable/Resizable Logic ---
// ... (Keeping same draggable logic but ensuring it handles z-index if needed) ...

export function makeDraggable(dialogId: string, handleId: string): void {
    const dialog = document.getElementById(dialogId);
    const handle = document.getElementById(handleId);
    if (!dialog || !handle) return;

    let isDragging = false;
    let startX = 0, startY = 0, currentX = 0, currentY = 0;

    handle.style.cursor = 'move';
    // Ensure position is relative
    if (getComputedStyle(dialog).position === 'static') dialog.style.position = 'relative';

    handle.addEventListener('mousedown', (e: MouseEvent) => {
        if (e.button !== 0) return; // Only left click
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
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
        isResizing = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}
