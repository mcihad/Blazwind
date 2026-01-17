/**
 * Blazwind Alert Module
 * Dismissible alerts
 */

export function dismiss(alertId: string): void {
    const alert = document.getElementById(alertId);
    if (alert) {
        alert.style.display = 'none';
    }
}
