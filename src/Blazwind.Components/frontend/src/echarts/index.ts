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

    const chart = echarts.init(container, theme || undefined, {
        renderer: 'canvas'
    });

    chart.setOption(options);

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

        instance.chart.setOption(options, notMerge);
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
export function showLoading(id: string, text: string = 'Yükleniyor...'): void {
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
