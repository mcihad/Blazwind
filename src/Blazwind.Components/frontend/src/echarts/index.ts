/**
 * BwChart - Apache ECharts integration for Blazor
 * Lazy-loaded separately from main bundle for performance
 */

import * as echarts from 'echarts';
import type { EChartsOption, ECharts as EChartsInstance } from 'echarts';

// Re-export for type access
export type { EChartsOption };

interface ChartInstance {
    chart: EChartsInstance;
    container: HTMLElement;
    resizeObserver: ResizeObserver;
    netRef: any;
}

const instances: Map<string, ChartInstance> = new Map();

/**
 * Get computed CSS variable value
 */
function getCSSVariable(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Get theme-aware colors from CSS variables
 */
function getThemeColors() {
    return {
        textColor: getCSSVariable('--bw-color-text') || '#111827',
        textColorSecondary: getCSSVariable('--bw-color-text-secondary') || '#6b7280',
        textColorMuted: getCSSVariable('--bw-color-text-muted') || '#9ca3af',
        backgroundColor: getCSSVariable('--bw-color-surface') || '#ffffff',
        borderColor: getCSSVariable('--bw-color-border') || '#e5e7eb',
        primaryColor: getCSSVariable('--bw-color-primary') || '#2563eb',
        successColor: getCSSVariable('--bw-color-success') || '#059669',
        dangerColor: getCSSVariable('--bw-color-danger') || '#dc2626',
        warningColor: getCSSVariable('--bw-color-warning') || '#f59e0b',
        infoColor: getCSSVariable('--bw-color-info') || '#0284c7',
    };
}

/**
 * Apply theme colors to options
 */
function applyThemeToOptions(options: any): any {
    const colors = getThemeColors();

    // Deep clone to avoid mutating original
    const themedOptions = JSON.parse(JSON.stringify(options));

    // Apply text colors to title
    if (themedOptions.title) {
        if (!themedOptions.title.textStyle) themedOptions.title.textStyle = {};
        if (!themedOptions.title.textStyle.color) themedOptions.title.textStyle.color = colors.textColor;

        if (!themedOptions.title.subtextStyle) themedOptions.title.subtextStyle = {};
        if (!themedOptions.title.subtextStyle.color) themedOptions.title.subtextStyle.color = colors.textColorSecondary;
    }

    // Apply text colors to legend
    if (themedOptions.legend) {
        if (!themedOptions.legend.textStyle) themedOptions.legend.textStyle = {};
        if (!themedOptions.legend.textStyle.color) themedOptions.legend.textStyle.color = colors.textColorSecondary;
    }

    // Apply text colors to axes
    const applyAxisStyle = (axis: any) => {
        if (!axis) return;
        const axes = Array.isArray(axis) ? axis : [axis];
        axes.forEach((ax: any) => {
            if (!ax.axisLabel) ax.axisLabel = {};
            if (!ax.axisLabel.color) ax.axisLabel.color = colors.textColorSecondary;

            if (!ax.axisLine) ax.axisLine = {};
            if (!ax.axisLine.lineStyle) ax.axisLine.lineStyle = {};
            if (!ax.axisLine.lineStyle.color) ax.axisLine.lineStyle.color = colors.borderColor;

            if (!ax.splitLine) ax.splitLine = {};
            if (!ax.splitLine.lineStyle) ax.splitLine.lineStyle = {};
            if (!ax.splitLine.lineStyle.color) ax.splitLine.lineStyle.color = colors.borderColor;
        });
    };

    applyAxisStyle(themedOptions.xAxis);
    applyAxisStyle(themedOptions.yAxis);

    // Apply tooltip styles
    if (themedOptions.tooltip) {
        if (!themedOptions.tooltip.backgroundColor) themedOptions.tooltip.backgroundColor = colors.backgroundColor;
        if (!themedOptions.tooltip.borderColor) themedOptions.tooltip.borderColor = colors.borderColor;
        if (!themedOptions.tooltip.textStyle) themedOptions.tooltip.textStyle = {};
        if (!themedOptions.tooltip.textStyle.color) themedOptions.tooltip.textStyle.color = colors.textColor;
    }

    return themedOptions;
}

/**
 * Initialize a chart
 */
export function init(
    container: HTMLElement,
    options: any,
    theme: string | null,
    netRef: any
): string {
    const id = `chart-${crypto.randomUUID()}`;

    // Handle registerMap before chart initialization
    if (options.registerMap) {
        const mapData = options.registerMap;
        const mapName = mapData.name;
        let geoJson = mapData.geoJSON || mapData.geoJson || mapData.geojson;

        // Parse if string
        if (typeof geoJson === 'string') {
            try {
                geoJson = JSON.parse(geoJson);
            } catch (e) {
                console.error('Failed to parse GeoJSON:', e);
            }
        }

        // Register the map
        if (mapName && geoJson) {
            echarts.registerMap(mapName, geoJson);
        }

        // Remove registerMap from options to avoid ECharts errors
        delete options.registerMap;
    }

    // Apply theme colors from CSS variables
    const themedOptions = applyThemeToOptions(options);

    const chart = echarts.init(container, theme || undefined, {
        renderer: 'canvas'
    });

    chart.setOption(themedOptions);

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
        chart.resize();
    });
    resizeObserver.observe(container);

    // Handle click events
    chart.on('click', (params) => {
        netRef?.invokeMethodAsync('HandleChartClick', JSON.stringify({
            componentType: params.componentType,
            seriesType: params.seriesType,
            seriesIndex: params.seriesIndex,
            seriesName: params.seriesName,
            name: params.name,
            dataIndex: params.dataIndex,
            value: params.value
        }));
    });

    instances.set(id, { chart, container, resizeObserver, netRef });
    return id;
}

/**
 * Update chart options
 */
export function setOption(id: string, options: any, notMerge: boolean = false): void {
    const instance = instances.get(id);
    if (instance) {
        // Handle registerMap if present
        if (options.registerMap) {
            const mapData = options.registerMap;
            const mapName = mapData.name;
            let geoJson = mapData.geoJSON || mapData.geoJson || mapData.geojson;

            if (typeof geoJson === 'string') {
                try {
                    geoJson = JSON.parse(geoJson);
                } catch (e) {
                    console.error('Failed to parse GeoJSON:', e);
                }
            }

            if (mapName && geoJson) {
                echarts.registerMap(mapName, geoJson);
            }

            delete options.registerMap;
        }

        // Apply theme colors from CSS variables
        const themedOptions = applyThemeToOptions(options);
        instance.chart.setOption(themedOptions, notMerge);
    }
}

/**
 * Resize chart
 */
export function resize(id: string): void {
    const instance = instances.get(id);
    if (instance) {
        instance.chart.resize();
    }
}

/**
 * Get data URL of chart
 */
export function getDataURL(id: string, type: string = 'png'): string {
    const instance = instances.get(id);
    if (instance) {
        return instance.chart.getDataURL({
            type: type as 'png' | 'jpeg' | 'svg',
            backgroundColor: '#fff'
        });
    }
    return '';
}

/**
 * Show loading
 */
export function showLoading(id: string, text: string = 'Loading...'): void {
    const instance = instances.get(id);
    if (instance) {
        instance.chart.showLoading({ text });
    }
}

/**
 * Hide loading
 */
export function hideLoading(id: string): void {
    const instance = instances.get(id);
    if (instance) {
        instance.chart.hideLoading();
    }
}

/**
 * Clear chart
 */
export function clear(id: string): void {
    const instance = instances.get(id);
    if (instance) {
        instance.chart.clear();
    }
}

/**
 * Register a map for geo charts
 */
export function registerMap(mapName: string, geoJson: object | string): void {
    const geoData = typeof geoJson === 'string' ? JSON.parse(geoJson) : geoJson;
    echarts.registerMap(mapName, geoData as any);
}

/**
 * Check if a map is registered
 */
export function hasMap(mapName: string): boolean {
    return echarts.getMap(mapName) !== undefined;
}

/**
 * Dispose chart
 */
export function dispose(id: string): void {
    const instance = instances.get(id);
    if (instance) {
        instance.resizeObserver.disconnect();
        instance.chart.dispose();
        instances.delete(id);
    }
}
