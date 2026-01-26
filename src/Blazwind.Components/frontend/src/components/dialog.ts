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

    const titleEl = document.createElement('h4');
    titleEl.className = 'font-bold text-gray-800 dark:text-gray-100';
    titleEl.id = 'progress-title';
    titleEl.textContent = options.Title || 'İşlem Yapılıyor';

    const percentEl = document.createElement('span');
    percentEl.className = 'text-sm font-semibold text-blue-600';
    percentEl.id = 'progress-percent';
    percentEl.textContent = '0%';

    const headerEl = document.createElement('div');
    headerEl.className = 'mb-4 flex justify-between items-center';
    headerEl.appendChild(titleEl);
    headerEl.appendChild(percentEl);

    const barWrapper = document.createElement('div');
    barWrapper.className = 'w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 mb-3 overflow-hidden';

    const barEl = document.createElement('div');
    barEl.className = 'bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out shadow-inner';
    barEl.style.width = '0%';
    barEl.id = 'progress-bar';
    barWrapper.appendChild(barEl);

    const messageEl = document.createElement('p');
    messageEl.className = 'text-xs text-gray-500 dark:text-gray-400 text-center font-medium';
    messageEl.id = 'progress-msg';
    messageEl.textContent = options.Message || 'Lütfen bekleyin...';

    container.appendChild(headerEl);
    container.appendChild(barWrapper);
    container.appendChild(messageEl);

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    const bar = barEl;
    const txt = percentEl;
    const msg = messageEl;

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

    const spinnerWrap = document.createElement('div');
    spinnerWrap.className = 'relative flex-shrink-0';
    const spinner = document.createElement('div');
    spinner.className = 'animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400';
    spinnerWrap.appendChild(spinner);

    const textWrap = document.createElement('div');
    const title = document.createElement('h4');
    title.className = 'font-semibold text-gray-900 dark:text-gray-100 text-lg';
    title.textContent = 'Yükleniyor';
    const message = document.createElement('p');
    message.className = 'text-gray-500 dark:text-gray-400 text-sm';
    message.textContent = options.Message || 'Lütfen bekleyin...';
    textWrap.appendChild(title);
    textWrap.appendChild(message);

    container.appendChild(spinnerWrap);
    container.appendChild(textWrap);

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

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-circle-notch fa-spin text-4xl mb-4 text-blue-600 dark:text-blue-400';
    const label = document.createElement('span');
    label.className = 'text-xs font-semibold tracking-wide opacity-90 text-center px-2';
    label.textContent = options.Message || 'Yükleniyor';
    container.appendChild(icon);
    container.appendChild(label);

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
    const busyWrap = document.createElement('div');
    busyWrap.className = 'flex flex-col items-center justify-center text-white animate-fade-in text-center max-w-md p-6';

    const busyIconWrap = document.createElement('div');
    busyIconWrap.className = 'relative mb-6';
    const busyPulse = document.createElement('div');
    busyPulse.className = 'absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse';
    const busyIcon = document.createElement('i');
    busyIcon.className = 'fa-solid fa-arrows-rotate fa-spin text-5xl relative z-10';
    busyIconWrap.appendChild(busyPulse);
    busyIconWrap.appendChild(busyIcon);

    const busyTitle = document.createElement('h2');
    busyTitle.className = 'text-2xl font-bold mb-2 tracking-tight';
    busyTitle.textContent = 'İşlem Sürüyor';

    const busyMessage = document.createElement('p');
    busyMessage.className = 'text-gray-300 font-light text-lg';
    busyMessage.textContent = options.Message || 'Lütfen bekleyiniz, işlem tamamlanana kadar sayfayı kapatmayınız.';

    busyWrap.appendChild(busyIconWrap);
    busyWrap.appendChild(busyTitle);
    busyWrap.appendChild(busyMessage);
    overlay.appendChild(busyWrap);

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

    const countdownWrap = document.createElement('div');
    countdownWrap.className = 'relative w-32 h-32 mx-auto mb-6 flex items-center justify-center';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'w-full h-full transform -rotate-90 drop-shadow-lg');
    const circleBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleBg.setAttribute('cx', '64');
    circleBg.setAttribute('cy', '64');
    circleBg.setAttribute('r', '56');
    circleBg.setAttribute('stroke', 'CurrentColor');
    circleBg.setAttribute('stroke-width', '8');
    circleBg.setAttribute('fill', 'transparent');
    circleBg.setAttribute('class', 'text-gray-100 dark:text-gray-700');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '64');
    circle.setAttribute('cy', '64');
    circle.setAttribute('r', '56');
    circle.setAttribute('stroke', 'CurrentColor');
    circle.setAttribute('stroke-width', '8');
    circle.setAttribute('fill', 'transparent');
    circle.setAttribute('class', 'text-blue-500 transition-all duration-1000 ease-linear');
    circle.setAttribute('stroke-linecap', 'round');
    circle.setAttribute('stroke-dasharray', '351.8');
    circle.setAttribute('stroke-dashoffset', '0');
    circle.id = 'countdown-circle';
    svg.appendChild(circleBg);
    svg.appendChild(circle);

    const countdownInner = document.createElement('div');
    countdownInner.className = 'absolute inset-0 flex items-center justify-center flex-col';
    const countdownText = document.createElement('span');
    countdownText.className = 'text-4xl font-black text-gray-800 dark:text-gray-100';
    countdownText.id = 'countdown-text';
    countdownText.textContent = seconds.toString();
    const countdownLabel = document.createElement('span');
    countdownLabel.className = 'text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1';
    countdownLabel.textContent = 'Saniye';
    countdownInner.appendChild(countdownText);
    countdownInner.appendChild(countdownLabel);

    countdownWrap.appendChild(svg);
    countdownWrap.appendChild(countdownInner);

    const countdownTitle = document.createElement('h3');
    countdownTitle.className = 'text-xl font-bold text-gray-900 dark:text-gray-100 mb-2';
    countdownTitle.textContent = options.Title || 'Otomatik Kapanış';

    const countdownMessage = document.createElement('p');
    countdownMessage.className = 'text-gray-500 dark:text-gray-400 text-sm leading-relaxed';
    countdownMessage.textContent = options.Message || 'Pencere otomatik olarak kapanacak...';

    container.appendChild(countdownWrap);
    container.appendChild(countdownTitle);
    container.appendChild(countdownMessage);

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

    const successIconWrap = document.createElement('div');
    successIconWrap.className = 'relative w-24 h-24 mx-auto mb-6';
    const successSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    successSvg.setAttribute('class', 'w-full h-full');
    successSvg.setAttribute('viewBox', '0 0 52 52');
    const successCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    successCircle.setAttribute('class', 'text-emerald-100 dark:text-emerald-900');
    successCircle.setAttribute('cx', '26');
    successCircle.setAttribute('cy', '26');
    successCircle.setAttribute('r', '25');
    successCircle.setAttribute('fill', 'none');
    successCircle.setAttribute('stroke', 'currentColor');
    successCircle.setAttribute('stroke-width', '2');
    const successCircleAnim = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    successCircleAnim.setAttribute('class', 'text-emerald-500 animate-[dash_0.6s_ease-in-out_forwards]');
    successCircleAnim.setAttribute('cx', '26');
    successCircleAnim.setAttribute('cy', '26');
    successCircleAnim.setAttribute('r', '25');
    successCircleAnim.setAttribute('fill', 'none');
    successCircleAnim.setAttribute('stroke', 'currentColor');
    successCircleAnim.setAttribute('stroke-width', '2');
    successCircleAnim.setAttribute('stroke-dasharray', '157');
    successCircleAnim.setAttribute('stroke-dashoffset', '157');
    successCircleAnim.setAttribute('stroke-linecap', 'round');
    successCircleAnim.setAttribute('style', 'animation: dash 0.6s ease-in-out forwards;');
    const successPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    successPath.setAttribute('class', 'text-emerald-500');
    successPath.setAttribute('fill', 'none');
    successPath.setAttribute('stroke', 'currentColor');
    successPath.setAttribute('stroke-width', '3');
    successPath.setAttribute('stroke-linecap', 'round');
    successPath.setAttribute('stroke-linejoin', 'round');
    successPath.setAttribute('stroke-dasharray', '32');
    successPath.setAttribute('stroke-dashoffset', '32');
    successPath.setAttribute('d', 'M14 27l7 7 16-16');
    successPath.setAttribute('style', 'animation: checkmark 0.4s 0.4s ease-in-out forwards;');
    successSvg.appendChild(successCircle);
    successSvg.appendChild(successCircleAnim);
    successSvg.appendChild(successPath);
    successIconWrap.appendChild(successSvg);

    const successTitle = document.createElement('h3');
    successTitle.className = 'text-xl font-bold text-gray-900 dark:text-gray-100 mb-2';
    successTitle.textContent = options.Title || 'Başarılı!';
    const successMessage = document.createElement('p');
    successMessage.className = 'text-gray-500 dark:text-gray-400 text-sm';
    successMessage.textContent = options.Message || 'İşlem başarıyla tamamlandı.';

    container.appendChild(successIconWrap);
    container.appendChild(successTitle);
    container.appendChild(successMessage);

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

    const errorIconWrap = document.createElement('div');
    errorIconWrap.className = 'relative w-24 h-24 mx-auto mb-6';
    const errorSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    errorSvg.setAttribute('class', 'w-full h-full');
    errorSvg.setAttribute('viewBox', '0 0 52 52');
    const errorCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    errorCircle.setAttribute('class', 'text-red-100 dark:text-red-900');
    errorCircle.setAttribute('cx', '26');
    errorCircle.setAttribute('cy', '26');
    errorCircle.setAttribute('r', '25');
    errorCircle.setAttribute('fill', 'none');
    errorCircle.setAttribute('stroke', 'currentColor');
    errorCircle.setAttribute('stroke-width', '2');
    const errorCircleAnim = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    errorCircleAnim.setAttribute('class', 'text-red-500 animate-[dash_0.6s_ease-in-out_forwards]');
    errorCircleAnim.setAttribute('cx', '26');
    errorCircleAnim.setAttribute('cy', '26');
    errorCircleAnim.setAttribute('r', '25');
    errorCircleAnim.setAttribute('fill', 'none');
    errorCircleAnim.setAttribute('stroke', 'currentColor');
    errorCircleAnim.setAttribute('stroke-width', '2');
    errorCircleAnim.setAttribute('stroke-dasharray', '157');
    errorCircleAnim.setAttribute('stroke-dashoffset', '157');
    errorCircleAnim.setAttribute('stroke-linecap', 'round');
    errorCircleAnim.setAttribute('style', 'animation: dash 0.6s ease-in-out forwards;');
    const errorPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    errorPath.setAttribute('class', 'text-red-500');
    errorPath.setAttribute('fill', 'none');
    errorPath.setAttribute('stroke', 'currentColor');
    errorPath.setAttribute('stroke-width', '3');
    errorPath.setAttribute('stroke-linecap', 'round');
    errorPath.setAttribute('stroke-linejoin', 'round');
    errorPath.setAttribute('stroke-dasharray', '32');
    errorPath.setAttribute('stroke-dashoffset', '32');
    errorPath.setAttribute('d', 'M16 16 36 36 M36 16 16 36');
    errorPath.setAttribute('style', 'animation: checkmark 0.4s 0.4s ease-in-out forwards;');
    errorSvg.appendChild(errorCircle);
    errorSvg.appendChild(errorCircleAnim);
    errorSvg.appendChild(errorPath);
    errorIconWrap.appendChild(errorSvg);

    const errorTitle = document.createElement('h3');
    errorTitle.className = 'text-xl font-bold text-gray-900 dark:text-gray-100 mb-2';
    errorTitle.textContent = options.Title || 'Hata!';
    const errorMessage = document.createElement('p');
    errorMessage.className = 'text-gray-500 dark:text-gray-400 text-sm';
    errorMessage.textContent = options.Message || 'Bir hata oluştu.';

    container.appendChild(errorIconWrap);
    container.appendChild(errorTitle);
    container.appendChild(errorMessage);

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

    const image = document.createElement('img');
    image.src = options.Src;
    image.alt = options.Alt || 'Görsel';
    image.className = 'max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain';

    const closeButton = document.createElement('button');
    closeButton.className = 'absolute -top-3 -right-3 w-8 h-8 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';
    closeButton.type = 'button';
    closeButton.addEventListener('click', () => {
        const overlayEl = closeButton.closest('.fixed');
        if (overlayEl) {
            overlayEl.remove();
        }
    });
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fa-solid fa-xmark';
    closeButton.appendChild(closeIcon);

    container.appendChild(image);
    if (options.Caption) {
        const caption = document.createElement('p');
        caption.className = 'text-white text-center mt-4 text-sm font-medium drop-shadow-lg';
        caption.textContent = options.Caption;
        container.appendChild(caption);
    }
    container.appendChild(closeButton);

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

    const pulseWrap = document.createElement('div');
    pulseWrap.className = 'relative mb-4';
    const pulseOuter = document.createElement('div');
    pulseOuter.className = 'w-16 h-16 bg-blue-500 rounded-full animate-ping opacity-75';
    const pulseInner = document.createElement('div');
    pulseInner.className = 'absolute inset-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center';
    const pulseIcon = document.createElement('i');
    const iconName = options.Icon || 'sync';
    pulseIcon.className = `fa-solid fa-${iconName} text-white text-xl`;
    pulseInner.appendChild(pulseIcon);
    pulseWrap.appendChild(pulseOuter);
    pulseWrap.appendChild(pulseInner);

    const pulseText = document.createElement('p');
    pulseText.className = 'text-white font-medium text-lg drop-shadow-lg';
    pulseText.textContent = options.Message || 'İşlem devam ediyor...';

    container.appendChild(pulseWrap);
    container.appendChild(pulseText);

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
