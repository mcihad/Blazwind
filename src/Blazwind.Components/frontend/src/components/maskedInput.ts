/**
 * Blazwind MaskedInput Module
 * Advanced input masking with TypeScript
 */

export interface MaskConfig {
    mask: string;
    maskChar: string;
    showMaskOnFocus: boolean;
    showMaskOnHover: boolean;
    returnMasked: boolean;
}

export interface MaskPreset {
    mask: string;
    returnMasked: boolean;
}

interface MaskInstance {
    element: HTMLInputElement;
    config: MaskConfig;
    dotNetRef: any;
    rawValue: string;
    cursorPosition: number;
}

// Mask character definitions
const MASK_CHARS: Record<string, RegExp> = {
    '#': /\d/,           // Digit
    'A': /[a-zA-Z]/,     // Letter
    '*': /[a-zA-Z0-9]/,  // Alphanumeric
    'X': /[a-zA-Z0-9]/,  // Alphanumeric (alias)
};

// Preset configurations
const PRESETS: Record<string, MaskPreset> = {
    'phone': { mask: '(###) ### ## ##', returnMasked: false },
    'phone-us': { mask: '(###) ###-####', returnMasked: false },
    'phone-intl': { mask: '+## ### ### ## ##', returnMasked: false },
    'creditcard': { mask: '#### #### #### ####', returnMasked: false },
    'date': { mask: '##/##/####', returnMasked: true },
    'date-us': { mask: '##/##/####', returnMasked: true },
    'date-iso': { mask: '####-##-##', returnMasked: true },
    'time': { mask: '##:##', returnMasked: true },
    'time-seconds': { mask: '##:##:##', returnMasked: true },
    'iban-tr': { mask: 'TR## #### #### #### #### #### ##', returnMasked: false },
    'zipcode': { mask: '#####', returnMasked: false },
    'zipcode-ext': { mask: '#####-####', returnMasked: false },
    'ssn': { mask: '###-##-####', returnMasked: false },
    'currency': { mask: '###,###,###.##', returnMasked: true },
};

const instances = new Map<string, MaskInstance>();

/**
 * Check if a character is a mask placeholder
 */
function isMaskPlaceholder(char: string): boolean {
    return char in MASK_CHARS;
}

/**
 * Check if a character matches the mask placeholder
 */
function matchesMask(char: string, maskChar: string): boolean {
    const pattern = MASK_CHARS[maskChar];
    return pattern ? pattern.test(char) : false;
}

/**
 * Get the raw value length (number of placeholder positions in mask)
 */
function getMaxRawLength(mask: string): number {
    return mask.split('').filter(c => isMaskPlaceholder(c)).length;
}

/**
 * Convert raw value to display value with mask
 */
function formatValue(rawValue: string, mask: string, _maskChar: string): string {
    if (!mask || !rawValue) return rawValue;

    let result = '';
    let rawIndex = 0;

    for (let i = 0; i < mask.length; i++) {
        const m = mask[i];

        if (isMaskPlaceholder(m)) {
            if (rawIndex < rawValue.length) {
                result += rawValue[rawIndex];
                rawIndex++;
            } else {
                break; // Stop when raw value is exhausted
            }
        } else {
            // Add literal character only if we have more raw value or already started
            if (rawIndex > 0 || rawIndex < rawValue.length) {
                result += m;
            }
        }
    }

    return result;
}

/**
 * Extract raw value from formatted display value
 */
function extractRawValue(displayValue: string, mask: string): string {
    if (!mask || !displayValue) return displayValue;

    let raw = '';
    let displayIndex = 0;

    for (let i = 0; i < mask.length && displayIndex < displayValue.length; i++) {
        const m = mask[i];
        const d = displayValue[displayIndex];

        if (isMaskPlaceholder(m)) {
            if (matchesMask(d, m)) {
                raw += m === 'A' ? d.toUpperCase() : d;
                displayIndex++;
            } else if (d === mask[i]) {
                // User typed a literal, skip
                displayIndex++;
                i--; // Retry same mask position
            } else {
                displayIndex++;
                i--; // Skip invalid char, retry mask position
            }
        } else {
            // Literal in mask - skip in display if matches
            if (d === m) {
                displayIndex++;
            }
            // If doesn't match, we might be at end or invalid input
        }
    }

    return raw;
}

/**
 * Calculate cursor position after formatting
 */
function calculateCursorPosition(_rawValue: string, mask: string, rawCursorPos: number): number {
    let displayPos = 0;
    let rawCount = 0;

    for (let i = 0; i < mask.length; i++) {
        if (rawCount >= rawCursorPos) break;

        if (isMaskPlaceholder(mask[i])) {
            rawCount++;
        }
        displayPos++;
    }

    return displayPos;
}

/**
 * Process input and return filtered raw value
 */
function processInput(input: string, mask: string, maxLength: number): string {
    let raw = '';
    let maskIndex = 0;

    for (const char of input) {
        if (raw.length >= maxLength) break;

        // Find next placeholder position in mask
        while (maskIndex < mask.length && !isMaskPlaceholder(mask[maskIndex])) {
            maskIndex++;
        }

        if (maskIndex >= mask.length) break;

        const maskChar = mask[maskIndex];

        if (matchesMask(char, maskChar)) {
            raw += maskChar === 'A' ? char.toUpperCase() : char;
            maskIndex++;
        }
        // Skip characters that don't match
    }

    return raw;
}

export interface InitializeOptions {
    mask?: string;
    placeholder?: string;
    preset?: string;
    returnMasked?: boolean;
    initialValue?: string;
}

/**
 * Initialize masked input
 */
export function initialize(
    elementId: string,
    dotNetRef: any,
    options: InitializeOptions = {}
): void {
    const {
        mask = '',
        placeholder: maskChar = '_',
        preset = null,
        returnMasked = null,
        initialValue = ''
    } = options;

    const element = document.getElementById(elementId) as HTMLInputElement;
    if (!element || element.tagName !== 'INPUT') return;

    // Apply preset if provided
    let finalMask = mask;
    let finalReturnMasked = returnMasked ?? false;

    if (preset && PRESETS[preset.toLowerCase()]) {
        const p = PRESETS[preset.toLowerCase()];
        finalMask = p.mask;
        finalReturnMasked = returnMasked ?? p.returnMasked;
    }

    const config: MaskConfig = {
        mask: finalMask,
        maskChar,
        showMaskOnFocus: true,
        showMaskOnHover: false,
        returnMasked: finalReturnMasked,
    };

    const instance: MaskInstance = {
        element,
        config,
        dotNetRef,
        rawValue: initialValue,
        cursorPosition: 0,
    };

    instances.set(elementId, instance);

    // Set initial display value
    updateDisplay(instance);

    // Event listeners
    element.addEventListener('input', (e) => handleInput(e as InputEvent, instance));
    element.addEventListener('keydown', (e) => handleKeyDown(e, instance));
    element.addEventListener('focus', () => handleFocus(instance));
    element.addEventListener('blur', () => handleBlur(instance));
    element.addEventListener('paste', (e) => handlePaste(e, instance));
    element.addEventListener('click', () => handleClick(instance));
}

/**
 * Update display value
 */
function updateDisplay(instance: MaskInstance): void {
    const { element, config, rawValue } = instance;
    const displayValue = formatValue(rawValue, config.mask, config.maskChar);
    element.value = displayValue;
}

/**
 * Handle input event
 */
function handleInput(_e: InputEvent, instance: MaskInstance): void {
    const { element, config } = instance;
    const maxLength = getMaxRawLength(config.mask);

    // Get current input value
    const currentValue = element.value;

    // Process the entire input to extract raw value
    const newRaw = processInput(currentValue, config.mask, maxLength);

    instance.rawValue = newRaw;
    instance.cursorPosition = newRaw.length;

    // Update display
    updateDisplay(instance);

    // Calculate and set cursor position
    const cursorPos = calculateCursorPosition(newRaw, config.mask, newRaw.length);
    element.setSelectionRange(cursorPos, cursorPos);

    // Notify .NET
    notifyValueChange(instance);
}

/**
 * Handle keydown event
 */
function handleKeyDown(e: KeyboardEvent, instance: MaskInstance): void {
    const { element, config, dotNetRef } = instance;

    if (e.key === 'Enter') {
        // Notify .NET about Enter key
        if (dotNetRef) {
            dotNetRef.invokeMethodAsync('OnEnterPressed');
        }
        return;
    }

    if (e.key === 'Backspace') {
        e.preventDefault();
        const selStart = element.selectionStart || 0;
        const selEnd = element.selectionEnd || 0;

        if (selStart !== selEnd) {
            // Delete selection
            const displayValue = element.value;
            const before = displayValue.substring(0, selStart);
            const after = displayValue.substring(selEnd);

            const rawBefore = extractRawValue(before, config.mask.substring(0, selStart));
            const rawAfter = extractRawValue(after, config.mask.substring(selEnd));

            instance.rawValue = rawBefore + rawAfter;
        } else if (selStart > 0) {
            // Delete single character - find previous raw character position
            let newRaw = instance.rawValue;
            if (newRaw.length > 0) {
                // Find how many raw chars are before cursor
                let rawCount = 0;
                for (let i = 0; i < selStart && i < config.mask.length; i++) {
                    if (isMaskPlaceholder(config.mask[i])) {
                        rawCount++;
                    }
                }
                // Remove character at rawCount - 1
                if (rawCount > 0) {
                    newRaw = newRaw.substring(0, rawCount - 1) + newRaw.substring(rawCount);
                    instance.rawValue = newRaw;
                }
            }
        }

        updateDisplay(instance);
        const cursorPos = calculateCursorPosition(instance.rawValue, config.mask, instance.rawValue.length);
        element.setSelectionRange(cursorPos, cursorPos);
        notifyValueChange(instance);
    } else if (e.key === 'Delete') {
        e.preventDefault();
        const selStart = element.selectionStart || 0;
        const selEnd = element.selectionEnd || 0;

        if (selStart !== selEnd) {
            // Delete selection - same as backspace
            const displayValue = element.value;
            const before = displayValue.substring(0, selStart);
            const after = displayValue.substring(selEnd);

            const rawBefore = extractRawValue(before, config.mask.substring(0, selStart));
            const rawAfter = extractRawValue(after, config.mask.substring(selEnd));

            instance.rawValue = rawBefore + rawAfter;
        } else {
            // Delete character after cursor
            let rawCount = 0;
            for (let i = 0; i < selStart && i < config.mask.length; i++) {
                if (isMaskPlaceholder(config.mask[i])) {
                    rawCount++;
                }
            }
            const newRaw = instance.rawValue.substring(0, rawCount) + instance.rawValue.substring(rawCount + 1);
            instance.rawValue = newRaw;
        }

        updateDisplay(instance);
        const cursorPos = calculateCursorPosition(instance.rawValue, config.mask, instance.rawValue.length);
        element.setSelectionRange(cursorPos, cursorPos);
        notifyValueChange(instance);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') {
        // Allow navigation keys
    } else if (e.ctrlKey || e.metaKey) {
        // Allow ctrl/cmd combinations (copy, paste, select all, etc.)
    }
}

/**
 * Handle paste event
 */
function handlePaste(e: ClipboardEvent, instance: MaskInstance): void {
    e.preventDefault();

    const pastedText = e.clipboardData?.getData('text') || '';
    const { config } = instance;
    const maxLength = getMaxRawLength(config.mask);

    // Process pasted text
    const newRaw = processInput(pastedText, config.mask, maxLength);
    instance.rawValue = newRaw;

    updateDisplay(instance);
    const cursorPos = calculateCursorPosition(newRaw, config.mask, newRaw.length);
    instance.element.setSelectionRange(cursorPos, cursorPos);
    notifyValueChange(instance);
}

/**
 * Handle focus event
 */
function handleFocus(instance: MaskInstance): void {
    // Position cursor at end of value
    const { element, config, rawValue } = instance;
    const cursorPos = calculateCursorPosition(rawValue, config.mask, rawValue.length);
    setTimeout(() => {
        element.setSelectionRange(cursorPos, cursorPos);
    }, 0);
}

/**
 * Handle blur event
 */
function handleBlur(_instance: MaskInstance): void {
    // Could add validation here
}

/**
 * Handle click event
 */
function handleClick(instance: MaskInstance): void {
    const { element, config, rawValue } = instance;
    const clickPos = element.selectionStart || 0;

    // Count raw characters up to click position
    let rawCount = 0;
    for (let i = 0; i < clickPos && i < config.mask.length; i++) {
        if (isMaskPlaceholder(config.mask[i])) {
            rawCount++;
        }
    }

    // If clicked beyond the value, move to end
    if (rawCount > rawValue.length) {
        const cursorPos = calculateCursorPosition(rawValue, config.mask, rawValue.length);
        element.setSelectionRange(cursorPos, cursorPos);
    }
}

/**
 * Notify .NET of value change
 */
function notifyValueChange(instance: MaskInstance): void {
    const { config, dotNetRef, rawValue } = instance;

    const value = config.returnMasked
        ? formatValue(rawValue, config.mask, config.maskChar)
        : rawValue;

    if (dotNetRef) {
        dotNetRef.invokeMethodAsync('OnValueChanged', value, rawValue);
    }
}

/**
 * Set value from .NET
 */
export function setValue(elementId: string, value: string): void {
    const instance = instances.get(elementId);
    if (!instance) return;

    const { config } = instance;

    // Check if value is already formatted
    const rawValue = extractRawValue(value, config.mask) || processInput(value, config.mask, getMaxRawLength(config.mask));
    instance.rawValue = rawValue;

    updateDisplay(instance);
}

/**
 * Get current raw value
 */
export function getRawValue(elementId: string): string {
    const instance = instances.get(elementId);
    return instance?.rawValue || '';
}

/**
 * Get current formatted value
 */
export function getFormattedValue(elementId: string): string {
    const instance = instances.get(elementId);
    if (!instance) return '';

    return formatValue(instance.rawValue, instance.config.mask, instance.config.maskChar);
}

/**
 * Update mask dynamically
 */
export function updateMask(elementId: string, newMask: string, returnMasked: boolean): void {
    const instance = instances.get(elementId);
    if (!instance) return;

    instance.config.mask = newMask;
    instance.config.returnMasked = returnMasked;

    // Re-process current raw value with new mask
    const maxLength = getMaxRawLength(newMask);
    instance.rawValue = instance.rawValue.substring(0, maxLength);

    updateDisplay(instance);
    notifyValueChange(instance);
}

/**
 * Destroy instance
 */
export function destroy(elementId: string): void {
    const instance = instances.get(elementId);
    if (!instance) return;

    instances.delete(elementId);
}

/**
 * Check if value is complete (all placeholders filled)
 */
export function isComplete(elementId: string): boolean {
    const instance = instances.get(elementId);
    if (!instance) return false;

    const maxLength = getMaxRawLength(instance.config.mask);
    return instance.rawValue.length === maxLength;
}

/**
 * Get available presets
 */
export function getPresets(): string[] {
    return Object.keys(PRESETS);
}

/**
 * Get mask for a preset
 */
export function getPresetMask(preset: string): string | null {
    return PRESETS[preset.toLowerCase()]?.mask || null;
}
