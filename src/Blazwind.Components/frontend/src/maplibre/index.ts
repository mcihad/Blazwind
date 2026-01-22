import maplibregl, {
    Map,
    NavigationControl,
    FullscreenControl,
    ScaleControl,
    GeolocateControl,
    AttributionControl,
    TerrainControl,
    Marker,
    Popup,
    LngLatBounds,
    GeoJSONSource,
} from 'maplibre-gl';
import type {
    MapMouseEvent,
    MapTouchEvent,
    LayerSpecification,
    SourceSpecification,
    PositionAnchor
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// ===== Type Definitions =====
interface MapInstance {
    map: Map;
    netRef: any;
    markers: { [key: string]: Marker };
    popups: { [key: string]: Popup };
    resizeObserver: ResizeObserver;
    layerClickOrders: { [layerId: string]: number };
    isFlyingTo: boolean;
}

interface MapOptions {
    style?: string;
    center?: [number, number];
    zoom?: number;
    pitch?: number;
    bearing?: number;
    minZoom?: number;
    maxZoom?: number;
    minPitch?: number;
    maxPitch?: number;
    maxBounds?: [[number, number], [number, number]];
    hash?: boolean;
    interactive?: boolean;
    bearingSnap?: number;
    pitchWithRotate?: boolean;
    clickTolerance?: number;
    attributionControl?: boolean;
    logoPosition?: string;
    failIfMajorPerformanceCaveat?: boolean;
    preserveDrawingBuffer?: boolean;
    antialias?: boolean;
    refreshExpiredTiles?: boolean;
    trackResize?: boolean;
    cooperativeGestures?: boolean;
    controls?: ControlsConfig;
}

interface ControlsConfig {
    navigation?: NavigationControlConfig;
    scale?: ScaleControlConfig;
    fullscreen?: FullscreenControlConfig;
    geolocate?: GeolocateControlConfig;
    attribution?: AttributionControlConfig;
    terrain?: TerrainControlConfig;
}

interface NavigationControlConfig {
    showCompass?: boolean;
    showZoom?: boolean;
    visualizePitch?: boolean;
    position?: string;
}

interface ScaleControlConfig {
    maxWidth?: number;
    unit?: 'imperial' | 'metric' | 'nautical';
    position?: string;
}

interface FullscreenControlConfig {
    container?: HTMLElement;
    position?: string;
}

interface GeolocateControlConfig {
    positionOptions?: PositionOptions;
    fitBoundsOptions?: object;
    trackUserLocation?: boolean;
    showAccuracyCircle?: boolean;
    showUserLocation?: boolean;
    showUserHeading?: boolean;
    position?: string;
}

interface AttributionControlConfig {
    compact?: boolean;
    customAttribution?: string | string[];
    position?: string;
}

interface TerrainControlConfig {
    source: string;
    exaggeration?: number;
    position?: string;
}

interface MarkerOptions {
    id: string;
    lngLat: [number, number];
    color?: string;
    draggable?: boolean;
    rotation?: number;
    rotationAlignment?: string;
    pitchAlignment?: string;
    scale?: number;
    anchor?: string;
    offset?: [number, number];
    element?: string;
    popupHtml?: string;
    popupOptions?: PopupOptionsConfig;
}

interface PopupOptionsConfig {
    closeButton?: boolean;
    closeOnClick?: boolean;
    closeOnMove?: boolean;
    anchor?: PositionAnchor;
    offset?: number | [number, number];
    className?: string;
    maxWidth?: string;
}

interface LayerConfig {
    id: string;
    type: string;
    source?: string;
    'source-layer'?: string;
    paint?: object;
    layout?: object;
    filter?: any[];
    minzoom?: number;
    maxzoom?: number;
    metadata?: object;
    interactive?: boolean;
    clickOrder?: number;
    beforeId?: string;
}

// ===== Global Registry =====
const instances: { [key: string]: MapInstance } = {};

// ===== Map Initialization =====
export function initMap(element: HTMLElement, options: MapOptions, netRef: any): string {
    if (!element) {
        console.error('[BwMapLibre] Element not found');
        return '';
    }

    // Debug: Log received options

    const mapId = element.id || `map-${crypto.randomUUID()}`;
    element.id = mapId;

    // Helper to cleanup undefined/null values
    const val = (v: any, def?: any) => (v === null || v === undefined) ? def : v;

    // Normalize center if present
    let initialCenter: any = options.center || [0, 0];
    if (Array.isArray(initialCenter)) {
        initialCenter = { lng: initialCenter[0], lat: initialCenter[1] };
    }

    const mapOptions: maplibregl.MapOptions = {
        container: element,
        style: options.style || 'https://demotiles.maplibre.org/style.json',
        center: initialCenter,
        zoom: val(options.zoom, 0),
        pitch: val(options.pitch, 0),
        bearing: val(options.bearing, 0),
        minZoom: val(options.minZoom),
        maxZoom: val(options.maxZoom),
        minPitch: val(options.minPitch),
        maxPitch: val(options.maxPitch),
        maxBounds: options.maxBounds ? new LngLatBounds(options.maxBounds[0], options.maxBounds[1]) : undefined,
        hash: val(options.hash, false),
        interactive: val(options.interactive, true),
        bearingSnap: options.bearingSnap,
        pitchWithRotate: val(options.pitchWithRotate, true),
        clickTolerance: val(options.clickTolerance, 3),
        attributionControl: false,
        refreshExpiredTiles: val(options.refreshExpiredTiles, true),
        trackResize: val(options.trackResize, true),
        cooperativeGestures: options.cooperativeGestures
    };

    const map = new maplibregl.Map(mapOptions);

    // Add controls
    addControls(map, options.controls);

    // Create instance
    const instance: MapInstance = {
        map,
        netRef,
        markers: {},
        popups: {},
        resizeObserver: new ResizeObserver(() => map.resize()),
        layerClickOrders: {},
        isFlyingTo: false
    };

    instance.resizeObserver.observe(element);

    // Wire up events
    wireEvents(instance);

    // Force resize and center on load
    map.on('load', () => {
        map.resize();

        if (options.center) {
            let center: any = options.center;
            if (Array.isArray(center)) {
                center = { lng: center[0], lat: center[1] };
            }
            map.setCenter(center);
        }
        if (options.zoom !== undefined) {
            map.setZoom(options.zoom);
        }
    });

    instances[mapId] = instance;
    return mapId;
}

function addControls(map: Map, controls?: ControlsConfig) {
    if (!controls) {
        // Default controls
        map.addControl(new NavigationControl(), 'top-right');
        map.addControl(new AttributionControl({ compact: true }), 'bottom-right');
        return;
    }

    if (controls.navigation) {
        map.addControl(new NavigationControl({
            showCompass: controls.navigation.showCompass ?? true,
            showZoom: controls.navigation.showZoom ?? true,
            visualizePitch: controls.navigation.visualizePitch ?? false
        }), controls.navigation.position as any || 'top-right');
    }

    if (controls.scale) {
        map.addControl(new ScaleControl({
            maxWidth: controls.scale.maxWidth,
            unit: controls.scale.unit || 'metric'
        }), controls.scale.position as any || 'bottom-left');
    }

    if (controls.fullscreen) {
        map.addControl(new FullscreenControl({
            container: controls.fullscreen.container
        }), controls.fullscreen.position as any || 'top-right');
    }

    if (controls.geolocate) {
        map.addControl(new GeolocateControl({
            positionOptions: controls.geolocate.positionOptions,
            fitBoundsOptions: controls.geolocate.fitBoundsOptions,
            trackUserLocation: controls.geolocate.trackUserLocation ?? false,
            showAccuracyCircle: controls.geolocate.showAccuracyCircle ?? true,
            showUserLocation: controls.geolocate.showUserLocation ?? true
        }), controls.geolocate.position as any || 'top-right');
    }

    if (controls.attribution) {
        map.addControl(new AttributionControl({
            compact: controls.attribution.compact ?? true,
            customAttribution: controls.attribution.customAttribution
        }), controls.attribution.position as any || 'bottom-right');
    }

    if (controls.terrain) {
        map.addControl(new TerrainControl({
            source: controls.terrain.source,
            exaggeration: controls.terrain.exaggeration ?? 1
        }), controls.terrain.position as any || 'top-right');
    }
}

function wireEvents(instance: MapInstance) {
    const map = instance.map;
    const netRef = instance.netRef;

    map.on('load', () => {
        netRef.invokeMethodAsync('HandleMapLoad');
    });

    map.on('resize', () => {
        netRef.invokeMethodAsync('HandleResize', map.getCanvas().width, map.getCanvas().height);
    });

    map.on('movestart', () => {
        netRef.invokeMethodAsync('HandleMoveStart');
    });

    map.on('move', () => {
        const center = map.getCenter();
        netRef.invokeMethodAsync('HandleMove', [center.lng, center.lat], map.getZoom(), map.getBearing(), map.getPitch());
    });

    map.on('moveend', () => {
        const center = map.getCenter();
        netRef.invokeMethodAsync('HandleMoveEnd', [center.lng, center.lat], map.getZoom(), map.getBearing(), map.getPitch());
    });

    map.on('zoomstart', () => {
        netRef.invokeMethodAsync('HandleZoomStart', map.getZoom());
    });

    map.on('zoom', () => {
        netRef.invokeMethodAsync('HandleZoom', map.getZoom());
    });

    map.on('zoomend', () => {
        netRef.invokeMethodAsync('HandleZoomEnd', map.getZoom());
    });

    map.on('rotatestart', () => {
        netRef.invokeMethodAsync('HandleRotateStart', map.getBearing());
    });

    map.on('rotate', () => {
        netRef.invokeMethodAsync('HandleRotate', map.getBearing());
    });

    map.on('rotateend', () => {
        netRef.invokeMethodAsync('HandleRotateEnd', map.getBearing());
    });

    map.on('pitchstart', () => {
        netRef.invokeMethodAsync('HandlePitchStart', map.getPitch());
    });

    map.on('pitch', () => {
        netRef.invokeMethodAsync('HandlePitch', map.getPitch());
    });

    map.on('pitchend', () => {
        netRef.invokeMethodAsync('HandlePitchEnd', map.getPitch());
    });

    map.on('click', (e: MapMouseEvent) => {
        // Priority Handling for Layer Clicks
        const interactiveLayers = Object.keys(instance.layerClickOrders);
        if (interactiveLayers.length > 0) {
            const features = map.queryRenderedFeatures(e.point, { layers: interactiveLayers });
            if (features.length > 0) {
                let bestFeature: any = null;
                let maxOrder = -Infinity;

                // Features are already sorted by render order (top to bottom)
                // We iterate and keep the first one that beats the current max priority
                for (const f of features) {
                    const order = instance.layerClickOrders[f.layer.id] ?? 0;
                    if (order > maxOrder) {
                        maxOrder = order;
                        bestFeature = f;
                    }
                }

                if (bestFeature) {
                    const layerId = bestFeature.layer.id;
                    const layerFeatures = features.filter(f => f.layer.id === layerId).map(f => ({
                        id: f.id,
                        type: f.type,
                        geometry: f.geometry,
                        properties: f.properties,
                        source: f.source,
                        sourceLayer: f.sourceLayer
                    }));

                    netRef.invokeMethodAsync('HandleLayerClick', layerId, [e.lngLat.lng, e.lngLat.lat], layerFeatures);

                    // Stop map click propagation if layer was clicked
                    return;
                }
            }
        }

        netRef.invokeMethodAsync('HandleClick', [e.lngLat.lng, e.lngLat.lat], [e.point.x, e.point.y]);
    });

    map.on('dblclick', (e: MapMouseEvent) => {
        netRef.invokeMethodAsync('HandleDoubleClick', [e.lngLat.lng, e.lngLat.lat], [e.point.x, e.point.y]);
    });

    map.on('contextmenu', (e: MapMouseEvent) => {
        netRef.invokeMethodAsync('HandleContextMenu', [e.lngLat.lng, e.lngLat.lat], [e.point.x, e.point.y], [e.originalEvent.clientX, e.originalEvent.clientY]);
    });

    map.on('mousemove', (e: MapMouseEvent) => {
        netRef.invokeMethodAsync('HandleMouseMove', [e.lngLat.lng, e.lngLat.lat], [e.point.x, e.point.y]);
    });

    map.on('mouseenter', () => {
        netRef.invokeMethodAsync('HandleMouseEnter');
    });

    map.on('mouseleave', () => {
        netRef.invokeMethodAsync('HandleMouseLeave');
    });

    map.on('touchstart', (e: MapTouchEvent) => {
        if (e.lngLat) {
            netRef.invokeMethodAsync('HandleTouchStart', [e.lngLat.lng, e.lngLat.lat]);
        }
    });

    map.on('touchend', (e: MapTouchEvent) => {
        if (e.lngLat) {
            netRef.invokeMethodAsync('HandleTouchEnd', [e.lngLat.lng, e.lngLat.lat]);
        }
    });

    map.on('error', (e) => {
        console.error('[BwMapLibre] Map error:', e.error?.message || 'Unknown error', e);
        netRef.invokeMethodAsync('HandleError', e.error?.message || 'Unknown error');
    });

    map.on('idle', () => {
        netRef.invokeMethodAsync('HandleIdle');
    });

    map.on('sourcedata', (e) => {
        if (e.isSourceLoaded && e.sourceId) {
            netRef.invokeMethodAsync('HandleSourceLoaded', e.sourceId);
        }
    });

    map.on('styleimagemissing', (e) => {
        console.warn(`[BwMapLibre] Style image missing: ${e.id}`);
        netRef.invokeMethodAsync('HandleStyleImageMissing', e.id);
    });
}

// ===== Map State Methods =====
export function getCenter(mapId: string): [number, number] | null {
    const instance = instances[mapId];
    if (!instance) return null;
    const center = instance.map.getCenter();
    return [center.lng, center.lat];
}

export function setCenter(mapId: string, center: [number, number], animate: boolean = true) {
    const instance = instances[mapId];
    if (!instance) return;
    if (animate) {
        instance.map.flyTo({ center });
    } else {
        instance.map.setCenter(center);
    }
}

export function getZoom(mapId: string): number | null {
    const instance = instances[mapId];
    if (!instance) return null;
    return instance.map.getZoom();
}

export function setZoom(mapId: string, zoom: number, animate: boolean = true) {
    const instance = instances[mapId];
    if (!instance) return;
    if (animate) {
        instance.map.flyTo({ zoom });
    } else {
        instance.map.setZoom(zoom);
    }
}

export function getBearing(mapId: string): number | null {
    const instance = instances[mapId];
    if (!instance) return null;
    return instance.map.getBearing();
}

export function setBearing(mapId: string, bearing: number, animate: boolean = true) {
    const instance = instances[mapId];
    if (!instance) return;
    if (animate) {
        instance.map.rotateTo(bearing);
    } else {
        instance.map.setBearing(bearing);
    }
}

export function getPitch(mapId: string): number | null {
    const instance = instances[mapId];
    if (!instance) return null;
    return instance.map.getPitch();
}

export function setPitch(mapId: string, pitch: number, animate: boolean = true) {
    const instance = instances[mapId];
    if (!instance) return;
    if (animate) {
        instance.map.easeTo({ pitch });
    } else {
        instance.map.setPitch(pitch);
    }
}

export function getBounds(mapId: string): [[number, number], [number, number]] | null {
    const instance = instances[mapId];
    if (!instance) return null;
    const bounds = instance.map.getBounds();
    return [
        [bounds.getSouthWest().lng, bounds.getSouthWest().lat],
        [bounds.getNorthEast().lng, bounds.getNorthEast().lat]
    ];
}

// ===== Camera Methods =====
export function flyTo(mapId: string, options: any) {
    try {
        const instance = instances[mapId];

        if (!instance) {
            console.error('[BwMapLibre JS] No instance found for mapId:', mapId);
            return;
        }

        // Normalize options
        const flyOptions = { ...options };
        if (Array.isArray(flyOptions.center)) {
            flyOptions.center = { lng: flyOptions.center[0], lat: flyOptions.center[1] };
        }
        flyOptions.essential = true; // Force animation even if user prefers reduced motion

        // Track fly animation for events
        const targetCenter = flyOptions.center ? [flyOptions.center.lng, flyOptions.center.lat] : null;
        const targetZoom = flyOptions.zoom ?? null;

        // Fire fly start event
        instance.isFlyingTo = true;
        instance.netRef.invokeMethodAsync('HandleFlyStart', targetCenter, targetZoom);

        // Listen for moveend to fire fly end event
        const onMoveEnd = () => {
            if (instance.isFlyingTo) {
                instance.isFlyingTo = false;
                const center = instance.map.getCenter();
                instance.netRef.invokeMethodAsync('HandleFlyEnd', [center.lng, center.lat], instance.map.getZoom());
                instance.map.off('moveend', onMoveEnd);
            }
        };
        instance.map.once('moveend', onMoveEnd);

        instance.map.flyTo(flyOptions);
    } catch (error) {
        console.error('[BwMapLibre JS] Error in flyTo:', error);
    }
}

export function easeTo(mapId: string, options: any) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.easeTo(options);
}

export function jumpTo(mapId: string, options: any) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.jumpTo(options);
}

export function fitBounds(mapId: string, bounds: [[number, number], [number, number]], options?: any) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.fitBounds(new LngLatBounds(bounds[0], bounds[1]), options);
}

export function panTo(mapId: string, lngLat: [number, number], options?: any) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.panTo(lngLat, options);
}

export function panBy(mapId: string, offset: [number, number], options?: any) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.panBy(offset, options);
}

export function zoomIn(mapId: string, options?: any) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.zoomIn(options);
}

export function zoomOut(mapId: string, options?: any) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.zoomOut(options);
}

export function zoomTo(mapId: string, zoom: number, options?: any) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.zoomTo(zoom, options);
}

export function rotateTo(mapId: string, bearing: number, options?: any) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.rotateTo(bearing, options);
}

export function resetNorth(mapId: string, options?: any) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.resetNorth(options);
}

export function resetNorthPitch(mapId: string, options?: any) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.resetNorthPitch(options);
}

// ===== Source Methods =====
export function addSource(mapId: string, sourceId: string, source: any) {

    const instance = instances[mapId];
    if (!instance) {
        console.error(`[BwMapLibre] addSource: No map instance found for mapId=${mapId}`);
        console.error(`[BwMapLibre] Available instances:`, Object.keys(instances));
        return;
    }

    if (instance.map.getSource(sourceId)) {
        console.warn(`[BwMapLibre] Source '${sourceId}' already exists`);
        return;
    }

    try {
        instance.map.addSource(sourceId, source as SourceSpecification);

        // Verify source was added
        const addedSource = instance.map.getSource(sourceId);
        if (addedSource) {
        } else {
            console.error(`[BwMapLibre] Source '${sourceId}' was NOT added (getSource returned null)`);
        }
    } catch (error) {
        console.error(`[BwMapLibre] Error adding source '${sourceId}':`, error);
    }
}

export function removeSource(mapId: string, sourceId: string) {
    const instance = instances[mapId];
    if (!instance) return;

    // Remove all layers using this source first
    const style = instance.map.getStyle();
    if (style?.layers) {
        style.layers
            .filter((layer: any) => layer.source === sourceId)
            .forEach((layer: any) => {
                if (instance.map.getLayer(layer.id)) {
                    instance.map.removeLayer(layer.id);
                }
            });
    }

    if (instance.map.getSource(sourceId)) {
        instance.map.removeSource(sourceId);
    }
}

export function getSource(mapId: string, sourceId: string): any {
    const instance = instances[mapId];
    if (!instance) return null;
    return instance.map.getSource(sourceId);
}

export function setGeoJsonData(mapId: string, sourceId: string, data: any) {
    const instance = instances[mapId];
    if (!instance) return;

    const source = instance.map.getSource(sourceId) as GeoJSONSource;
    if (source) {
        source.setData(data);
    }
}

export function updateGeoJsonData(mapId: string, sourceId: string, data: any) {
    setGeoJsonData(mapId, sourceId, data);
}

// ===== Layer Methods =====
export function addLayer(mapId: string, layer: LayerConfig, beforeId?: string) {

    const instance = instances[mapId];
    if (!instance) {
        console.error(`[BwMapLibre] addLayer: No map instance found for mapId=${mapId}`);
        return;
    }

    // Check if source exists
    const sourceId = layer.source;
    if (sourceId && !instance.map.getSource(sourceId)) {
        console.error(`[BwMapLibre] addLayer: Source '${sourceId}' not found for layer '${layer.id}'`);
        return;
    }

    if (instance.map.getLayer(layer.id)) {
        instance.map.removeLayer(layer.id);
    }

    // Build layerSpec without undefined values - MapLibre doesn't accept undefined
    const layerSpec: any = {
        id: layer.id,
        type: layer.type
    };

    // Only add properties that are defined
    if (layer.source !== undefined) layerSpec.source = layer.source;
    if (layer.paint !== undefined) layerSpec.paint = layer.paint;
    if (layer.layout !== undefined) layerSpec.layout = layer.layout;
    if (layer.filter !== undefined) layerSpec.filter = layer.filter;
    if (layer.minzoom !== undefined) layerSpec.minzoom = layer.minzoom;
    if (layer.maxzoom !== undefined) layerSpec.maxzoom = layer.maxzoom;
    if (layer.metadata !== undefined) layerSpec.metadata = layer.metadata;
    if (layer['source-layer']) layerSpec['source-layer'] = layer['source-layer'];

    try {
        instance.map.addLayer(layerSpec as LayerSpecification, beforeId || layer.beforeId);

        // Verify layer was added
        const addedLayer = instance.map.getLayer(layer.id);
        if (addedLayer) {
        } else {
            console.error(`[BwMapLibre] Layer '${layer.id}' was NOT added (getLayer returned null)`);
        }
    } catch (error) {
        console.error(`[BwMapLibre] Error adding layer '${layer.id}':`, error);
    }

    // Store click order for priority handling
    if (layer.clickOrder !== undefined) {
        instance.layerClickOrders[layer.id] = layer.clickOrder;
    }

    // Wire up layer events if interactive
    if (layer.interactive) {
        wireLayerEvents(instance, layer.id);
    }
}

function wireLayerEvents(instance: MapInstance, layerId: string) {
    // Click events are now handled globally in wireEvents to support priority

    instance.map.on('mouseenter', layerId, () => {
        instance.map.getCanvas().style.cursor = 'pointer';
        instance.netRef.invokeMethodAsync('HandleLayerMouseEnter', layerId);
    });

    instance.map.on('mouseleave', layerId, () => {
        instance.map.getCanvas().style.cursor = '';
        instance.netRef.invokeMethodAsync('HandleLayerMouseLeave', layerId);
    });

    instance.map.on('mousemove', layerId, (e) => {
        const features = e.features?.map(f => ({
            id: f.id,
            type: f.type,
            geometry: f.geometry,
            properties: f.properties,
            source: f.source,
            sourceLayer: f.sourceLayer
        })) || [];
        instance.netRef.invokeMethodAsync('HandleLayerMouseMove', layerId, [e.lngLat.lng, e.lngLat.lat], features);
    });
}

export function removeLayer(mapId: string, layerId: string) {
    const instance = instances[mapId];
    if (!instance) return;

    // Clean up click order
    delete instance.layerClickOrders[layerId];

    if (instance.map.getLayer(layerId)) {
        instance.map.removeLayer(layerId);
    }
}

export function updateLayerClickOrder(mapId: string, layerId: string, order: number) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.layerClickOrders[layerId] = order;
}

export function getLayer(mapId: string, layerId: string): any {
    const instance = instances[mapId];
    if (!instance) return null;
    return instance.map.getLayer(layerId);
}

export function setLayoutProperty(mapId: string, layerId: string, name: string, value: any) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.setLayoutProperty(layerId, name, value);
}

export function setPaintProperty(mapId: string, layerId: string, name: string, value: any) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.setPaintProperty(layerId, name, value);
}

export function setFilter(mapId: string, layerId: string, filter: any) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.setFilter(layerId, filter);
}

export function setLayerVisibility(mapId: string, layerId: string, visible: boolean) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
}

export function moveLayer(mapId: string, layerId: string, beforeId?: string) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.moveLayer(layerId, beforeId);
}

export function setLayerZoomRange(mapId: string, layerId: string, minZoom: number, maxZoom: number) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.setLayerZoomRange(layerId, minZoom, maxZoom);
}

// ===== Feature Query Methods =====
export function queryRenderedFeatures(mapId: string, geometry?: any, options?: any): any[] {
    const instance = instances[mapId];
    if (!instance) return [];

    const features = instance.map.queryRenderedFeatures(geometry, options);
    return features.map(f => ({
        id: f.id,
        type: f.type,
        geometry: f.geometry,
        properties: f.properties,
        source: f.source,
        sourceLayer: f.sourceLayer,
        layer: { id: f.layer?.id, type: f.layer?.type }
    }));
}

export function querySourceFeatures(mapId: string, sourceId: string, options?: any): any[] {
    const instance = instances[mapId];
    if (!instance) return [];

    const features = instance.map.querySourceFeatures(sourceId, options);
    return features.map(f => ({
        id: f.id,
        type: f.type,
        geometry: f.geometry,
        properties: f.properties,
        source: sourceId,
        sourceLayer: (f as any).sourceLayer
    }));
}

export function setFeatureState(mapId: string, feature: { source: string; sourceLayer?: string; id: any }, state: any) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.setFeatureState(feature, state);
}

export function getFeatureState(mapId: string, feature: { source: string; sourceLayer?: string; id: any }): any {
    const instance = instances[mapId];
    if (!instance) return null;
    return instance.map.getFeatureState(feature);
}

export function removeFeatureState(mapId: string, feature: { source: string; sourceLayer?: string; id?: any }, key?: string) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.removeFeatureState(feature, key);
}

// ===== Marker Methods =====
export function addMarker(mapId: string, options: MarkerOptions) {
    const instance = instances[mapId];
    if (!instance) return;

    let markerOptions: maplibregl.MarkerOptions = {
        color: options.color,
        draggable: options.draggable,
        rotation: options.rotation,
        rotationAlignment: options.rotationAlignment as any,
        pitchAlignment: options.pitchAlignment as any,
        scale: options.scale,
        anchor: options.anchor as any,
        offset: options.offset
    };

    // Custom element
    if (options.element) {
        const el = document.createElement('div');
        el.innerHTML = options.element;
        markerOptions.element = el.firstElementChild as HTMLElement || el;
    }

    const marker = new Marker(markerOptions)
        .setLngLat(options.lngLat)
        .addTo(instance.map);

    // Popup
    if (options.popupHtml) {
        const popup = new Popup(options.popupOptions || {})
            .setHTML(options.popupHtml);
        marker.setPopup(popup);
    }

    // Drag events
    if (options.draggable) {
        marker.on('dragstart', () => {
            const lngLat = marker.getLngLat();
            instance.netRef.invokeMethodAsync('HandleMarkerDragStart', options.id, [lngLat.lng, lngLat.lat]);
        });
        marker.on('drag', () => {
            const lngLat = marker.getLngLat();
            instance.netRef.invokeMethodAsync('HandleMarkerDrag', options.id, [lngLat.lng, lngLat.lat]);
        });
        marker.on('dragend', () => {
            const lngLat = marker.getLngLat();
            instance.netRef.invokeMethodAsync('HandleMarkerDragEnd', options.id, [lngLat.lng, lngLat.lat]);
        });
    }

    instance.markers[options.id] = marker;
}

export function removeMarker(mapId: string, markerId: string) {
    const instance = instances[mapId];
    if (!instance || !instance.markers[markerId]) return;

    instance.markers[markerId].remove();
    delete instance.markers[markerId];
}

export function setMarkerLngLat(mapId: string, markerId: string, lngLat: [number, number]) {
    const instance = instances[mapId];
    if (!instance || !instance.markers[markerId]) return;

    instance.markers[markerId].setLngLat(lngLat);
}

export function setMarkerPopup(mapId: string, markerId: string, html: string, options?: PopupOptionsConfig) {
    const instance = instances[mapId];
    if (!instance || !instance.markers[markerId]) return;

    const popup = new Popup(options || {}).setHTML(html);
    instance.markers[markerId].setPopup(popup);
}

export function toggleMarkerPopup(mapId: string, markerId: string) {
    const instance = instances[mapId];
    if (!instance || !instance.markers[markerId]) return;

    instance.markers[markerId].togglePopup();
}

// ===== Popup Methods =====
export function addPopup(mapId: string, id: string, lngLat: [number, number], html: string, options?: PopupOptionsConfig) {
    const instance = instances[mapId];
    if (!instance) return;

    const popup = new Popup(options || {})
        .setLngLat(lngLat)
        .setHTML(html)
        .addTo(instance.map);

    popup.on('close', () => {
        instance.netRef.invokeMethodAsync('HandlePopupClose', id);
        delete instance.popups[id];
    });

    instance.popups[id] = popup;
}

export function removePopup(mapId: string, popupId: string) {
    const instance = instances[mapId];
    if (!instance || !instance.popups[popupId]) return;

    instance.popups[popupId].remove();
    delete instance.popups[popupId];
}

export function setPopupLngLat(mapId: string, popupId: string, lngLat: [number, number]) {
    const instance = instances[mapId];
    if (!instance || !instance.popups[popupId]) return;

    instance.popups[popupId].setLngLat(lngLat);
}

export function setPopupHTML(mapId: string, popupId: string, html: string) {
    const instance = instances[mapId];
    if (!instance || !instance.popups[popupId]) return;

    instance.popups[popupId].setHTML(html);
}

// ===== Style Methods =====
export function setStyle(mapId: string, style: string | object) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.setStyle(style as any);
}

export function getStyle(mapId: string): any {
    const instance = instances[mapId];
    if (!instance) return null;
    return instance.map.getStyle();
}

export async function addImage(mapId: string, id: string, url: string, options?: { pixelRatio?: number; sdf?: boolean }): Promise<void> {
    const instance = instances[mapId];
    if (!instance) {
        throw new Error('Map not found');
    }

    const image = await instance.map.loadImage(url);
    if (image && image.data) {
        instance.map.addImage(id, image.data, options);
    }
}

export function hasImage(mapId: string, id: string): boolean {
    const instance = instances[mapId];
    if (!instance) return false;
    return instance.map.hasImage(id);
}

export function removeImage(mapId: string, id: string) {
    const instance = instances[mapId];
    if (!instance) return;
    if (instance.map.hasImage(id)) {
        instance.map.removeImage(id);
    }
}

// ===== Map State Methods =====
export function resize(mapId: string) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.resize();
}

export function triggerRepaint(mapId: string) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.triggerRepaint();
}

export function isMoving(mapId: string): boolean {
    const instance = instances[mapId];
    if (!instance) return false;
    return instance.map.isMoving();
}

export function isZooming(mapId: string): boolean {
    const instance = instances[mapId];
    if (!instance) return false;
    return instance.map.isZooming();
}

export function isRotating(mapId: string): boolean {
    const instance = instances[mapId];
    if (!instance) return false;
    return instance.map.isRotating();
}

export function isStyleLoaded(mapId: string): boolean {
    const instance = instances[mapId];
    if (!instance) return false;
    return instance.map.isStyleLoaded() ?? false;
}

export function isSourceLoaded(mapId: string, sourceId: string): boolean {
    const instance = instances[mapId];
    if (!instance) return false;
    return instance.map.isSourceLoaded(sourceId);
}

export function areTilesLoaded(mapId: string): boolean {
    const instance = instances[mapId];
    if (!instance) return false;
    return instance.map.areTilesLoaded();
}

// ===== Coordinate Methods =====
export function project(mapId: string, lngLat: [number, number]): [number, number] | null {
    const instance = instances[mapId];
    if (!instance) return null;
    const point = instance.map.project(lngLat);
    return [point.x, point.y];
}

export function unproject(mapId: string, point: [number, number]): [number, number] | null {
    const instance = instances[mapId];
    if (!instance) return null;
    const lngLat = instance.map.unproject(point);
    return [lngLat.lng, lngLat.lat];
}

// ===== Terrain Methods =====
export function setTerrain(mapId: string, options: { source: string; exaggeration?: number }) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.setTerrain(options);
}

export function getTerrain(mapId: string): any {
    const instance = instances[mapId];
    if (!instance) return null;
    return instance.map.getTerrain();
}

// ===== Light Methods =====
export function setLight(mapId: string, light: any, options?: any) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.setLight(light, options);
}

export function getLight(mapId: string): any {
    const instance = instances[mapId];
    if (!instance) return null;
    return instance.map.getLight();
}

// ===== Sky Methods =====
export function setSky(mapId: string, sky: any) {
    const instance = instances[mapId];
    if (!instance) return;
    instance.map.setSky(sky);
}

export function getSky(mapId: string): any {
    const instance = instances[mapId];
    if (!instance) return null;
    return instance.map.getSky();
}

// ===== Fog Methods (not available in MapLibre GL) =====
// Note: Fog is a Mapbox GL feature, not available in MapLibre GL
// Use Sky instead for atmospheric effects

// ===== Canvas/Export Methods =====
export function getCanvas(mapId: string): HTMLCanvasElement | null {
    const instance = instances[mapId];
    if (!instance) return null;
    return instance.map.getCanvas();
}

export function getCanvasContainer(mapId: string): HTMLElement | null {
    const instance = instances[mapId];
    if (!instance) return null;
    return instance.map.getCanvasContainer();
}

export function getContainer(mapId: string): HTMLElement | null {
    const instance = instances[mapId];
    if (!instance) return null;
    return instance.map.getContainer();
}

export function toDataURL(mapId: string): string | null {
    const instance = instances[mapId];
    if (!instance) return null;
    return instance.map.getCanvas().toDataURL();
}

// ===== Cleanup =====
export function disposeMap(mapId: string) {
    const instance = instances[mapId];
    if (!instance) return;

    // Clean up markers
    Object.values(instance.markers).forEach(marker => marker.remove());

    // Clean up popups
    Object.values(instance.popups).forEach(popup => popup.remove());

    // Disconnect resize observer
    instance.resizeObserver.disconnect();

    // Remove map
    try {
        instance.map.remove();
    } catch (e) {
        console.warn('[BwMapLibre] Error disposing map:', e);
    }

    delete instances[mapId];
}

// ===== Utilities =====
export function getMapInstance(mapId: string): Map | null {
    const instance = instances[mapId];
    return instance?.map || null;
}

// ===== Export for window access =====
const BwMapLibre = {
    initMap,
    getCenter, setCenter,
    getZoom, setZoom,
    getBearing, setBearing,
    getPitch, setPitch,
    getBounds,
    flyTo, easeTo, jumpTo,
    fitBounds, panTo, panBy,
    zoomIn, zoomOut, zoomTo,
    rotateTo, resetNorth, resetNorthPitch,
    addSource, removeSource, getSource,
    setGeoJsonData, updateGeoJsonData,
    addLayer, removeLayer, getLayer,
    setLayoutProperty, setPaintProperty, setFilter,
    setLayerVisibility, moveLayer, setLayerZoomRange,
    queryRenderedFeatures, querySourceFeatures,
    setFeatureState, getFeatureState, removeFeatureState,
    addMarker, removeMarker, setMarkerLngLat, setMarkerPopup, toggleMarkerPopup,
    addPopup, removePopup, setPopupLngLat, setPopupHTML,
    setStyle, getStyle,
    addImage, hasImage, removeImage,
    resize, triggerRepaint,
    isMoving, isZooming, isRotating,
    isStyleLoaded, isSourceLoaded, areTilesLoaded,
    project, unproject,
    setTerrain, getTerrain,
    setLight, getLight,
    setSky, getSky,
    getCanvas, getCanvasContainer, getContainer,
    toDataURL,
    disposeMap,
    getMapInstance
};

// @ts-ignore
window.BwMapLibre = BwMapLibre;

export default BwMapLibre;
