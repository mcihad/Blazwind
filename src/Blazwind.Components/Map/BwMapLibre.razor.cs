using System.Text.Json;
using Blazwind.Components.Map.Models;
using Blazwind.Components.Services;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Blazwind.Components.Map;

public partial class BwMapLibre : IAsyncDisposable
{
    private const string MapLibreScriptPath = "_content/Blazwind.Components/blazwind.maplibre.js";
    private const string MapLibreStylePath = "_content/Blazwind.Components/blazwind.maplibre.css";

    private readonly Dictionary<string, LayerEventHandler> _layerEventHandlers = new();
    private readonly Queue<MapLayer> _layerQueue = new();
    private readonly Queue<MapMarker> _markerQueue = new();

    private readonly Queue<MapSource> _sourceQueue = new();

    private ElementReference _mapContainer;
    private DotNetObjectReference<BwMapLibre>? _netRef;

    [Inject]
    private IJSRuntime JS { get; set; } = default!;

    [Inject]
    private ScriptLoaderService ScriptLoader { get; set; } = default!;

    /// <summary>
    ///     Whether the map is loaded and ready
    /// </summary>
    public bool IsLoaded { get; private set; }

    /// <summary>
    ///     The map ID assigned to this instance
    /// </summary>
    public string? MapId { get; private set; }

    public async ValueTask DisposeAsync()
    {
        try
        {
            if (MapId != null) await JS.InvokeVoidAsync("BwMapLibre.disposeMap", MapId);

            _netRef?.Dispose();
        }
        catch
        {
        }
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            try
            {
                // Lazy load MapLibre JS and CSS
                await ScriptLoader.LoadScriptAndStyleAsync(MapLibreScriptPath, MapLibreStylePath);

                _netRef = DotNetObjectReference.Create(this);

                var options = BuildMapOptions();
                var centerLog = Center != null ? $"[{Center[0]}, {Center[1]}]" : "null";
                MapId = await JS.InvokeAsync<string>("BwMapLibre.initMap", _mapContainer, options, _netRef);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[BwMapLibre] Error initializing map: {ex.Message}");
            }
    }

    private object BuildMapOptions()
    {
        var controls = Controls ?? BuildLegacyControls();

        var controlsObj = new Dictionary<string, object?>();

        // Navigation control
        if (controls.Navigation != null)
            controlsObj["navigation"] = new
            {
                showCompass = controls.Navigation.ShowCompass,
                showZoom = controls.Navigation.ShowZoom,
                visualizePitch = controls.Navigation.VisualizePitch,
                position = controls.Navigation.Position ?? "top-right"
            };
        else if (NavigationControl)
            controlsObj["navigation"] = new
            {
                showCompass = true,
                showZoom = true,
                visualizePitch = false,
                position = "top-right"
            };

        // Scale control
        if (controls.Scale != null)
            controlsObj["scale"] = new
            {
                maxWidth = controls.Scale.MaxWidth ?? 100,
                unit = controls.Scale.Unit ?? "metric",
                position = controls.Scale.Position ?? "bottom-left"
            };
        else if (ScaleControl)
            controlsObj["scale"] = new
            {
                maxWidth = 100,
                unit = "metric",
                position = "bottom-left"
            };

        // Fullscreen control
        if (controls.Fullscreen != null)
            controlsObj["fullscreen"] = new
            {
                position = controls.Fullscreen.Position ?? "top-right"
            };
        else if (FullscreenControl) controlsObj["fullscreen"] = new { position = "top-right" };

        // Geolocate control
        if (controls.Geolocate != null)
            controlsObj["geolocate"] = new
            {
                trackUserLocation = controls.Geolocate.TrackUserLocation,
                showAccuracyCircle = controls.Geolocate.ShowAccuracyCircle,
                showUserLocation = controls.Geolocate.ShowUserLocation,
                showUserHeading = controls.Geolocate.ShowUserHeading,
                position = controls.Geolocate.Position ?? "top-right"
            };
        else if (GeolocateControl)
            controlsObj["geolocate"] = new
            {
                trackUserLocation = false,
                showAccuracyCircle = true,
                showUserLocation = true,
                showUserHeading = false,
                position = "top-right"
            };

        // Attribution control
        if (controls.Attribution != null)
            controlsObj["attribution"] = new
            {
                compact = controls.Attribution.Compact,
                customAttribution = controls.Attribution.CustomAttribution,
                position = controls.Attribution.Position ?? "bottom-right"
            };
        else if (AttributionControl)
            controlsObj["attribution"] = new
            {
                compact = true,
                customAttribution = (string?)null,
                position = "bottom-right"
            };

        // Terrain control
        if (controls.Terrain != null)
            controlsObj["terrain"] = new
            {
                source = controls.Terrain.Source,
                exaggeration = controls.Terrain.Exaggeration,
                position = controls.Terrain.Position ?? "top-right"
            };

        return new
        {
            style = StyleUrl,
            center = Center,
            zoom = Zoom,
            pitch = Pitch,
            bearing = Bearing,
            minZoom = MinZoom,
            maxZoom = MaxZoom,
            minPitch = MinPitch,
            maxPitch = MaxPitch,
            maxBounds = MaxBounds,
            hash = Hash,
            interactive = Interactive,
            pitchWithRotate = PitchWithRotate,
            cooperativeGestures = CooperativeGestures,
            preserveDrawingBuffer = PreserveDrawingBuffer,
            controls = controlsObj
        };
    }

    private MapControlsConfig BuildLegacyControls()
    {
        return new MapControlsConfig
        {
            Navigation = NavigationControl ? new NavigationControlOptions() : null,
            Scale = ScaleControl ? new ScaleControlOptions() : null,
            Fullscreen = FullscreenControl ? new FullscreenControlOptions() : null,
            Geolocate = GeolocateControl ? new GeolocateControlOptions() : null,
            Attribution = AttributionControl ? new AttributionControlOptions() : null
        };
    }

    #region Export Methods

    /// <summary>
    ///     Export map to data URL (requires preserveDrawingBuffer)
    /// </summary>
    public async Task<string?> ToDataUrlAsync()
    {
        if (MapId == null) return null;
        return await JS.InvokeAsync<string?>("BwMapLibre.toDataURL", MapId);
    }

    #endregion

    // Layer event registry for click order handling
    private record LayerEventHandler(
        int ClickOrder,
        Func<MapLayerClickEventArgs, Task>? OnClick,
        Func<MapLayerEventArgs, Task>? OnMouseEnter,
        Func<MapLayerEventArgs, Task>? OnMouseLeave
    );

    #region Parameters

    /// <summary>
    ///     Map style URL (MapLibre style JSON)
    /// </summary>
    [Parameter]
    public string StyleUrl { get; set; } = "https://demotiles.maplibre.org/style.json";

    /// <summary>
    ///     Initial map center [longitude, latitude]
    /// </summary>
    [Parameter]
    public double[]? Center { get; set; }

    /// <summary>
    ///     Initial zoom level
    /// </summary>
    [Parameter]
    public double? Zoom { get; set; }

    /// <summary>
    ///     Initial pitch (tilt) in degrees
    /// </summary>
    [Parameter]
    public double? Pitch { get; set; }

    /// <summary>
    ///     Initial bearing (rotation) in degrees
    /// </summary>
    [Parameter]
    public double? Bearing { get; set; }

    /// <summary>
    ///     Minimum zoom level
    /// </summary>
    [Parameter]
    public double? MinZoom { get; set; }

    /// <summary>
    ///     Maximum zoom level
    /// </summary>
    [Parameter]
    public double? MaxZoom { get; set; }

    /// <summary>
    ///     Minimum pitch in degrees
    /// </summary>
    [Parameter]
    public double? MinPitch { get; set; }

    /// <summary>
    ///     Maximum pitch in degrees
    /// </summary>
    [Parameter]
    public double? MaxPitch { get; set; }

    /// <summary>
    ///     Maximum bounds [[west, south], [east, north]]
    /// </summary>
    [Parameter]
    public double[][]? MaxBounds { get; set; }

    /// <summary>
    ///     Whether to add hash to URL
    /// </summary>
    [Parameter]
    public bool Hash { get; set; }

    /// <summary>
    ///     Whether map is interactive
    /// </summary>
    [Parameter]
    public bool Interactive { get; set; } = true;

    /// <summary>
    ///     Whether to enable pitch with rotate gesture
    /// </summary>
    [Parameter]
    public bool PitchWithRotate { get; set; } = true;

    /// <summary>
    ///     Cooperative gestures for mobile
    /// </summary>
    [Parameter]
    public bool? CooperativeGestures { get; set; }

    /// <summary>
    ///     Preserve drawing buffer for screenshots
    /// </summary>
    [Parameter]
    public bool PreserveDrawingBuffer { get; set; }

    /// <summary>
    ///     Controls configuration
    /// </summary>
    [Parameter]
    public MapControlsConfig? Controls { get; set; }

    // Legacy control parameters (for backward compatibility)
    [Parameter]
    public bool NavigationControl { get; set; } = true;

    [Parameter]
    public bool FullscreenControl { get; set; }

    [Parameter]
    public bool ScaleControl { get; set; }

    [Parameter]
    public bool GeolocateControl { get; set; }

    [Parameter]
    public bool AttributionControl { get; set; } = true;

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    #endregion

    #region Events

    /// <summary>
    ///     Fired when map is loaded and ready
    /// </summary>
    [Parameter]
    public EventCallback OnLoad { get; set; }

    /// <summary>
    ///     Fired when map starts moving
    /// </summary>
    [Parameter]
    public EventCallback OnMoveStart { get; set; }

    /// <summary>
    ///     Fired during map movement
    /// </summary>
    [Parameter]
    public EventCallback<MapMoveEventArgs> OnMove { get; set; }

    /// <summary>
    ///     Fired when map stops moving
    /// </summary>
    [Parameter]
    public EventCallback<MapMoveEventArgs> OnMoveEnd { get; set; }

    /// <summary>
    ///     Fired when zoom starts
    /// </summary>
    [Parameter]
    public EventCallback<double> OnZoomStart { get; set; }

    /// <summary>
    ///     Fired during zoom
    /// </summary>
    [Parameter]
    public EventCallback<double> OnZoom { get; set; }

    /// <summary>
    ///     Fired when zoom ends
    /// </summary>
    [Parameter]
    public EventCallback<double> OnZoomEnd { get; set; }

    /// <summary>
    ///     Fired when rotation starts
    /// </summary>
    [Parameter]
    public EventCallback<double> OnRotateStart { get; set; }

    /// <summary>
    ///     Fired during rotation
    /// </summary>
    [Parameter]
    public EventCallback<double> OnRotate { get; set; }

    /// <summary>
    ///     Fired when rotation ends
    /// </summary>
    [Parameter]
    public EventCallback<double> OnRotateEnd { get; set; }

    /// <summary>
    ///     Fired when pitch starts
    /// </summary>
    [Parameter]
    public EventCallback<double> OnPitchStart { get; set; }

    /// <summary>
    ///     Fired during pitch
    /// </summary>
    [Parameter]
    public EventCallback<double> OnPitch { get; set; }

    /// <summary>
    ///     Fired when pitch ends
    /// </summary>
    [Parameter]
    public EventCallback<double> OnPitchEnd { get; set; }

    /// <summary>
    ///     Fired on map click
    /// </summary>
    [Parameter]
    public EventCallback<MapMouseEventArgs> OnClick { get; set; }

    /// <summary>
    ///     Fired on map double click
    /// </summary>
    [Parameter]
    public EventCallback<MapMouseEventArgs> OnDoubleClick { get; set; }

    /// <summary>
    ///     Fired on map right click
    /// </summary>
    [Parameter]
    public EventCallback<MapMouseEventArgs> OnContextMenu { get; set; }

    /// <summary>
    ///     Fired on mouse move
    /// </summary>
    [Parameter]
    public EventCallback<MapMouseEventArgs> OnMouseMove { get; set; }

    /// <summary>
    ///     Fired when mouse enters map
    /// </summary>
    [Parameter]
    public EventCallback OnMouseEnter { get; set; }

    /// <summary>
    ///     Fired when mouse leaves map
    /// </summary>
    [Parameter]
    public EventCallback OnMouseLeave { get; set; }

    /// <summary>
    ///     Fired on touch start
    /// </summary>
    [Parameter]
    public EventCallback<double[]> OnTouchStart { get; set; }

    /// <summary>
    ///     Fired on touch end
    /// </summary>
    [Parameter]
    public EventCallback<double[]> OnTouchEnd { get; set; }

    /// <summary>
    ///     Fired on map error
    /// </summary>
    [Parameter]
    public EventCallback<string> OnError { get; set; }

    /// <summary>
    ///     Fired when map is idle
    /// </summary>
    [Parameter]
    public EventCallback OnIdle { get; set; }

    /// <summary>
    ///     Fired when a source is loaded
    /// </summary>
    [Parameter]
    public EventCallback<string> OnSourceLoaded { get; set; }

    /// <summary>
    ///     Fired when a style image is missing
    /// </summary>
    [Parameter]
    public EventCallback<string> OnStyleImageMissing { get; set; }

    /// <summary>
    ///     Fired on layer click
    /// </summary>
    [Parameter]
    public EventCallback<MapLayerEventArgs> OnLayerClick { get; set; }

    /// <summary>
    ///     Fired when mouse enters a layer
    /// </summary>
    [Parameter]
    public EventCallback<string> OnLayerMouseEnter { get; set; }

    /// <summary>
    ///     Fired when mouse leaves a layer
    /// </summary>
    [Parameter]
    public EventCallback<string> OnLayerMouseLeave { get; set; }

    /// <summary>
    ///     Fired on layer mouse move
    /// </summary>
    [Parameter]
    public EventCallback<MapLayerEventArgs> OnLayerMouseMove { get; set; }

    /// <summary>
    ///     Fired on marker drag start
    /// </summary>
    [Parameter]
    public EventCallback<MapMarkerEventArgs> OnMarkerDragStart { get; set; }

    /// <summary>
    ///     Fired during marker drag
    /// </summary>
    [Parameter]
    public EventCallback<MapMarkerEventArgs> OnMarkerDrag { get; set; }

    /// <summary>
    ///     Fired on marker drag end
    /// </summary>
    [Parameter]
    public EventCallback<MapMarkerEventArgs> OnMarkerDragEnd { get; set; }

    /// <summary>
    ///     Fired when popup is closed
    /// </summary>
    [Parameter]
    public EventCallback<string> OnPopupClose { get; set; }

    /// <summary>
    ///     Fired when fly animation starts
    /// </summary>
    [Parameter]
    public EventCallback<MapFlyEventArgs> OnFlyStart { get; set; }

    /// <summary>
    ///     Fired when fly animation ends
    /// </summary>
    [Parameter]
    public EventCallback<MapFlyEventArgs> OnFlyEnd { get; set; }

    #endregion

    #region JS Invokable Handlers

    [JSInvokable]
    public async Task HandleMapLoad()
    {
        IsLoaded = true;

        // Process queued sources
        while (_sourceQueue.TryDequeue(out var source)) await AddSourceInternalAsync(source);

        // Process queued layers
        while (_layerQueue.TryDequeue(out var layer)) await AddLayerInternalAsync(layer);

        // Process queued markers
        while (_markerQueue.TryDequeue(out var marker)) await AddMarkerInternalAsync(marker);

        await OnLoad.InvokeAsync();
    }

    [JSInvokable]
    public async Task HandleMoveStart()
    {
        await OnMoveStart.InvokeAsync();
    }

    [JSInvokable]
    public async Task HandleMove(double[] center, double zoom, double bearing, double pitch)
    {
        await OnMove.InvokeAsync(new MapMoveEventArgs
        {
            Center = new LngLat(center[0], center[1]),
            Zoom = zoom,
            Bearing = bearing,
            Pitch = pitch
        });
    }

    [JSInvokable]
    public async Task HandleMoveEnd(double[] center, double zoom, double bearing, double pitch)
    {
        await OnMoveEnd.InvokeAsync(new MapMoveEventArgs
        {
            Center = new LngLat(center[0], center[1]),
            Zoom = zoom,
            Bearing = bearing,
            Pitch = pitch
        });
    }

    [JSInvokable]
    public async Task HandleZoomStart(double zoom)
    {
        await OnZoomStart.InvokeAsync(zoom);
    }

    [JSInvokable]
    public async Task HandleZoom(double zoom)
    {
        await OnZoom.InvokeAsync(zoom);
    }

    [JSInvokable]
    public async Task HandleZoomEnd(double zoom)
    {
        await OnZoomEnd.InvokeAsync(zoom);
    }

    [JSInvokable]
    public async Task HandleRotateStart(double bearing)
    {
        await OnRotateStart.InvokeAsync(bearing);
    }

    [JSInvokable]
    public async Task HandleRotate(double bearing)
    {
        await OnRotate.InvokeAsync(bearing);
    }

    [JSInvokable]
    public async Task HandleRotateEnd(double bearing)
    {
        await OnRotateEnd.InvokeAsync(bearing);
    }

    [JSInvokable]
    public async Task HandlePitchStart(double pitch)
    {
        await OnPitchStart.InvokeAsync(pitch);
    }

    [JSInvokable]
    public async Task HandlePitch(double pitch)
    {
        await OnPitch.InvokeAsync(pitch);
    }

    [JSInvokable]
    public async Task HandlePitchEnd(double pitch)
    {
        await OnPitchEnd.InvokeAsync(pitch);
    }

    [JSInvokable]
    public async Task HandleClick(double[] lngLat, double[] point)
    {
        await OnClick.InvokeAsync(new MapMouseEventArgs
        {
            LngLat = new LngLat(lngLat[0], lngLat[1]),
            Point = point
        });
    }

    [JSInvokable]
    public async Task HandleDoubleClick(double[] lngLat, double[] point)
    {
        await OnDoubleClick.InvokeAsync(new MapMouseEventArgs
        {
            LngLat = new LngLat(lngLat[0], lngLat[1]),
            Point = point
        });
    }

    [JSInvokable]
    public async Task HandleContextMenu(double[] lngLat, double[] point, double[] clientPoint)
    {
        await OnContextMenu.InvokeAsync(new MapMouseEventArgs
        {
            LngLat = new LngLat(lngLat[0], lngLat[1]),
            Point = point,
            ClientPoint = clientPoint
        });
    }

    [JSInvokable]
    public async Task HandleMouseMove(double[] lngLat, double[] point)
    {
        await OnMouseMove.InvokeAsync(new MapMouseEventArgs
        {
            LngLat = new LngLat(lngLat[0], lngLat[1]),
            Point = point
        });
    }

    [JSInvokable]
    public async Task HandleMouseEnter()
    {
        await OnMouseEnter.InvokeAsync();
    }

    [JSInvokable]
    public async Task HandleMouseLeave()
    {
        await OnMouseLeave.InvokeAsync();
    }

    [JSInvokable]
    public async Task HandleTouchStart(double[] lngLat)
    {
        await OnTouchStart.InvokeAsync(lngLat);
    }

    [JSInvokable]
    public async Task HandleTouchEnd(double[] lngLat)
    {
        await OnTouchEnd.InvokeAsync(lngLat);
    }

    [JSInvokable]
    public async Task HandleError(string message)
    {
        await OnError.InvokeAsync(message);
    }

    [JSInvokable]
    public async Task HandleIdle()
    {
        await OnIdle.InvokeAsync();
    }

    [JSInvokable]
    public async Task HandleSourceLoaded(string sourceId)
    {
        await OnSourceLoaded.InvokeAsync(sourceId);
    }

    [JSInvokable]
    public async Task HandleStyleImageMissing(string imageId)
    {
        await OnStyleImageMissing.InvokeAsync(imageId);
    }

    [JSInvokable]
    public async Task HandleLayerClick(string layerId, double[] lngLat, object[] features)
    {
        var eventArgs = new MapLayerClickEventArgs
        {
            LayerId = layerId,
            LngLat = new LngLat(lngLat[0], lngLat[1]),
            Features = ParseFeatures(features),
            ClickOrder = _layerEventHandlers.TryGetValue(layerId, out var handler) ? handler.ClickOrder : 0
        };

        // Invoke map-level OnLayerClick event
        await OnLayerClick.InvokeAsync(eventArgs);

        // Invoke individual layer's OnClick callback if registered
        if (handler?.OnClick != null) await handler.OnClick(eventArgs);
    }

    [JSInvokable]
    public async Task HandleLayerMouseEnter(string layerId)
    {
        await OnLayerMouseEnter.InvokeAsync(layerId);

        // Invoke individual layer's OnMouseEnter callback if registered
        if (_layerEventHandlers.TryGetValue(layerId, out var handler) && handler.OnMouseEnter != null)
            await handler.OnMouseEnter(new MapLayerEventArgs { LayerId = layerId });
    }

    [JSInvokable]
    public async Task HandleLayerMouseLeave(string layerId)
    {
        await OnLayerMouseLeave.InvokeAsync(layerId);

        // Invoke individual layer's OnMouseLeave callback if registered
        if (_layerEventHandlers.TryGetValue(layerId, out var handler) && handler.OnMouseLeave != null)
            await handler.OnMouseLeave(new MapLayerEventArgs { LayerId = layerId });
    }

    [JSInvokable]
    public async Task HandleLayerMouseMove(string layerId, double[] lngLat, object[] features)
    {
        await OnLayerMouseMove.InvokeAsync(new MapLayerEventArgs
        {
            LayerId = layerId,
            LngLat = new LngLat(lngLat[0], lngLat[1]),
            Features = ParseFeatures(features)
        });
    }

    [JSInvokable]
    public async Task HandleFlyStart(double[]? targetCenter, double? targetZoom)
    {
        await OnFlyStart.InvokeAsync(new MapFlyEventArgs
        {
            TargetCenter = targetCenter != null ? new LngLat(targetCenter[0], targetCenter[1]) : null,
            TargetZoom = targetZoom
        });
    }

    [JSInvokable]
    public async Task HandleFlyEnd(double[]? center, double? zoom)
    {
        await OnFlyEnd.InvokeAsync(new MapFlyEventArgs
        {
            TargetCenter = center != null ? new LngLat(center[0], center[1]) : null,
            TargetZoom = zoom
        });
    }

    [JSInvokable]
    public async Task HandleMarkerDragStart(string markerId, double[] lngLat)
    {
        await OnMarkerDragStart.InvokeAsync(new MapMarkerEventArgs
        {
            MarkerId = markerId,
            LngLat = new LngLat(lngLat[0], lngLat[1])
        });
    }

    [JSInvokable]
    public async Task HandleMarkerDrag(string markerId, double[] lngLat)
    {
        await OnMarkerDrag.InvokeAsync(new MapMarkerEventArgs
        {
            MarkerId = markerId,
            LngLat = new LngLat(lngLat[0], lngLat[1])
        });
    }

    [JSInvokable]
    public async Task HandleMarkerDragEnd(string markerId, double[] lngLat)
    {
        await OnMarkerDragEnd.InvokeAsync(new MapMarkerEventArgs
        {
            MarkerId = markerId,
            LngLat = new LngLat(lngLat[0], lngLat[1])
        });
    }

    [JSInvokable]
    public async Task HandlePopupClose(string popupId)
    {
        await OnPopupClose.InvokeAsync(popupId);
    }

    /// <summary>
    ///     Register layer event handlers for click order handling
    /// </summary>
    public void RegisterLayerEvents(
        string layerId,
        int clickOrder,
        Func<MapLayerClickEventArgs, Task>? onClick,
        Func<MapLayerEventArgs, Task>? onMouseEnter,
        Func<MapLayerEventArgs, Task>? onMouseLeave)
    {
        _layerEventHandlers[layerId] = new LayerEventHandler(clickOrder, onClick, onMouseEnter, onMouseLeave);
    }

    /// <summary>
    ///     Update layer click order
    /// </summary>
    public async Task UpdateLayerClickOrderAsync(string layerId, int clickOrder)
    {
        if (_layerEventHandlers.TryGetValue(layerId, out var handler))
            _layerEventHandlers[layerId] = handler with { ClickOrder = clickOrder };

        if (MapId != null) await JS.InvokeVoidAsync("BwMapLibre.updateLayerClickOrder", MapId, layerId, clickOrder);
    }

    /// <summary>
    ///     Unregister layer event handlers
    /// </summary>
    public void UnregisterLayerEvents(string layerId)
    {
        _layerEventHandlers.Remove(layerId);
    }

    private List<MapFeature> ParseFeatures(object[] features)
    {
        var result = new List<MapFeature>();
        foreach (var feature in features)
            try
            {
                var json = JsonSerializer.Serialize(feature);
                var parsed = JsonSerializer.Deserialize<MapFeature>(json);
                if (parsed != null) result.Add(parsed);
            }
            catch
            {
            }

        return result;
    }

    #endregion

    #region Source Methods

    /// <summary>
    ///     Add a source to the map
    /// </summary>
    public async Task AddSourceAsync(MapSource source)
    {
        if (IsLoaded)
            await AddSourceInternalAsync(source);
        else
            _sourceQueue.Enqueue(source);
    }

    private async Task AddSourceInternalAsync(MapSource source)
    {
        if (MapId == null) return;

        var sourceSpec = source.ToJsObject();
        await JS.InvokeVoidAsync("BwMapLibre.addSource", MapId, source.Id, sourceSpec);
    }

    /// <summary>
    ///     Remove a source from the map
    /// </summary>
    public async Task RemoveSourceAsync(string sourceId)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.removeSource", MapId, sourceId);
    }

    /// <summary>
    ///     Update GeoJSON source data
    /// </summary>
    public async Task SetGeoJsonDataAsync(string sourceId, object data)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setGeoJsonData", MapId, sourceId, data);
    }

    #endregion

    #region Layer Methods

    /// <summary>
    ///     Add a layer to the map
    /// </summary>
    public async Task AddLayerAsync(MapLayer layer, string? beforeId = null)
    {
        if (IsLoaded)
        {
            await AddLayerInternalAsync(layer, beforeId);
        }
        else
        {
            layer.BeforeId = beforeId;
            _layerQueue.Enqueue(layer);
        }
    }

    private async Task AddLayerInternalAsync(MapLayer layer, string? beforeId = null)
    {
        if (MapId == null) return;

        var layerSpec = layer.ToJsObject();
        await JS.InvokeVoidAsync("BwMapLibre.addLayer", MapId, layerSpec, beforeId ?? layer.BeforeId);
    }

    /// <summary>
    ///     Remove a layer from the map
    /// </summary>
    public async Task RemoveLayerAsync(string layerId)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.removeLayer", MapId, layerId);
    }

    /// <summary>
    ///     Set layer visibility
    /// </summary>
    public async Task SetLayerVisibilityAsync(string layerId, bool visible)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setLayerVisibility", MapId, layerId, visible);
    }

    /// <summary>
    ///     Set layer paint property
    /// </summary>
    public async Task SetPaintPropertyAsync(string layerId, string name, object value)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setPaintProperty", MapId, layerId, name, value);
    }

    /// <summary>
    ///     Set layer layout property
    /// </summary>
    public async Task SetLayoutPropertyAsync(string layerId, string name, object value)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setLayoutProperty", MapId, layerId, name, value);
    }

    /// <summary>
    ///     Set layer filter
    /// </summary>
    public async Task SetFilterAsync(string layerId, object[] filter)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setFilter", MapId, layerId, filter);
    }

    /// <summary>
    ///     Move layer to a different position
    /// </summary>
    public async Task MoveLayerAsync(string layerId, string? beforeId = null)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.moveLayer", MapId, layerId, beforeId);
    }

    /// <summary>
    ///     Set layer zoom range
    /// </summary>
    public async Task SetLayerZoomRangeAsync(string layerId, double minZoom, double maxZoom)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setLayerZoomRange", MapId, layerId, minZoom, maxZoom);
    }

    #endregion

    #region Camera Methods

    /// <summary>
    ///     Fly to a location
    /// </summary>
    public async Task FlyToAsync(FlyToOptions options)
    {
        if (MapId == null) return;

        var jsObj = options.ToJsObject();
        await JS.InvokeVoidAsync("BwMapLibre.flyTo", MapId, jsObj);
    }

    /// <summary>
    ///     Fly to a location (simple overload)
    /// </summary>
    public async Task FlyToAsync(double[] center, double? zoom = null)
    {
        await FlyToAsync(new FlyToOptions { Center = new LngLat(center[0], center[1]), Zoom = zoom });
    }

    /// <summary>
    ///     Ease to a location
    /// </summary>
    public async Task EaseToAsync(EaseToOptions options)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.easeTo", MapId, options.ToJsObject());
    }

    /// <summary>
    ///     Jump to a location (no animation)
    /// </summary>
    public async Task JumpToAsync(CameraOptions options)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.jumpTo", MapId, options.ToJsObject());
    }

    /// <summary>
    ///     Fit bounds to show all features
    /// </summary>
    public async Task FitBoundsAsync(LngLatBounds bounds, FitBoundsOptions? options = null)
    {
        if (MapId == null) return;
        var boundsArray = new[]
        {
            new[] { bounds.Southwest.Lng, bounds.Southwest.Lat }, new[] { bounds.Northeast.Lng, bounds.Northeast.Lat }
        };
        await JS.InvokeVoidAsync("BwMapLibre.fitBounds", MapId, boundsArray, options?.ToJsObject());
    }

    /// <summary>
    ///     Pan to a location
    /// </summary>
    public async Task PanToAsync(double[] lngLat)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.panTo", MapId, lngLat);
    }

    /// <summary>
    ///     Pan by pixel offset
    /// </summary>
    public async Task PanByAsync(double[] offset)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.panBy", MapId, offset);
    }

    /// <summary>
    ///     Zoom in
    /// </summary>
    public async Task ZoomInAsync()
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.zoomIn", MapId);
    }

    /// <summary>
    ///     Zoom out
    /// </summary>
    public async Task ZoomOutAsync()
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.zoomOut", MapId);
    }

    /// <summary>
    ///     Zoom to a specific level
    /// </summary>
    public async Task ZoomToAsync(double zoom)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.zoomTo", MapId, zoom);
    }

    /// <summary>
    ///     Rotate to a bearing
    /// </summary>
    public async Task RotateToAsync(double bearing)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.rotateTo", MapId, bearing);
    }

    /// <summary>
    ///     Reset north
    /// </summary>
    public async Task ResetNorthAsync()
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.resetNorth", MapId);
    }

    /// <summary>
    ///     Reset north and pitch
    /// </summary>
    public async Task ResetNorthPitchAsync()
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.resetNorthPitch", MapId);
    }

    #endregion

    #region Map State

    /// <summary>
    ///     Get current center
    /// </summary>
    public async Task<LngLat?> GetCenterAsync()
    {
        if (MapId == null) return null;
        var result = await JS.InvokeAsync<double[]?>("BwMapLibre.getCenter", MapId);
        return result != null ? new LngLat(result[0], result[1]) : null;
    }

    /// <summary>
    ///     Set center
    /// </summary>
    public async Task SetCenterAsync(double[] center, bool animate = true)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setCenter", MapId, center, animate);
    }

    /// <summary>
    ///     Get current zoom
    /// </summary>
    public async Task<double?> GetZoomAsync()
    {
        if (MapId == null) return null;
        return await JS.InvokeAsync<double?>("BwMapLibre.getZoom", MapId);
    }

    /// <summary>
    ///     Set zoom
    /// </summary>
    public async Task SetZoomAsync(double zoom, bool animate = true)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setZoom", MapId, zoom, animate);
    }

    /// <summary>
    ///     Get current bearing
    /// </summary>
    public async Task<double?> GetBearingAsync()
    {
        if (MapId == null) return null;
        return await JS.InvokeAsync<double?>("BwMapLibre.getBearing", MapId);
    }

    /// <summary>
    ///     Set bearing
    /// </summary>
    public async Task SetBearingAsync(double bearing, bool animate = true)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setBearing", MapId, bearing, animate);
    }

    /// <summary>
    ///     Get current pitch
    /// </summary>
    public async Task<double?> GetPitchAsync()
    {
        if (MapId == null) return null;
        return await JS.InvokeAsync<double?>("BwMapLibre.getPitch", MapId);
    }

    /// <summary>
    ///     Set pitch
    /// </summary>
    public async Task SetPitchAsync(double pitch, bool animate = true)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setPitch", MapId, pitch, animate);
    }

    /// <summary>
    ///     Get current bounds
    /// </summary>
    public async Task<LngLatBounds?> GetBoundsAsync()
    {
        if (MapId == null) return null;
        var result = await JS.InvokeAsync<double[][]?>("BwMapLibre.getBounds", MapId);
        if (result == null) return null;
        return new LngLatBounds(new LngLat(result[0][0], result[0][1]), new LngLat(result[1][0], result[1][1]));
    }

    /// <summary>
    ///     Resize the map
    /// </summary>
    public async Task ResizeAsync()
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.resize", MapId);
    }

    #endregion

    #region Marker Methods

    /// <summary>
    ///     Add a marker to the map
    /// </summary>
    public async Task AddMarkerAsync(MapMarker marker)
    {
        if (IsLoaded)
            await AddMarkerInternalAsync(marker);
        else
            _markerQueue.Enqueue(marker);
    }

    private async Task AddMarkerInternalAsync(MapMarker marker)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.addMarker", MapId, marker.ToJsObject());
    }

    /// <summary>
    ///     Remove a marker from the map
    /// </summary>
    public async Task RemoveMarkerAsync(string markerId)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.removeMarker", MapId, markerId);
    }

    /// <summary>
    ///     Set marker position
    /// </summary>
    public async Task SetMarkerLngLatAsync(string markerId, double[] lngLat)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setMarkerLngLat", MapId, markerId, lngLat);
    }

    /// <summary>
    ///     Set marker popup
    /// </summary>
    public async Task SetMarkerPopupAsync(string markerId, string html, MapPopupOptions? options = null)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setMarkerPopup", MapId, markerId, html, options?.ToJsObject());
    }

    /// <summary>
    ///     Toggle marker popup
    /// </summary>
    public async Task ToggleMarkerPopupAsync(string markerId)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.toggleMarkerPopup", MapId, markerId);
    }

    #endregion

    #region Popup Methods

    /// <summary>
    ///     Add a popup to the map
    /// </summary>
    public async Task AddPopupAsync(MapPopup popup)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.addPopup", MapId, popup.Id,
            new[] { popup.LngLat.Lng, popup.LngLat.Lat }, popup.Html, popup.Options?.ToJsObject());
    }

    /// <summary>
    ///     Remove a popup from the map
    /// </summary>
    public async Task RemovePopupAsync(string popupId)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.removePopup", MapId, popupId);
    }

    /// <summary>
    ///     Set popup position
    /// </summary>
    public async Task SetPopupLngLatAsync(string popupId, double[] lngLat)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setPopupLngLat", MapId, popupId, lngLat);
    }

    /// <summary>
    ///     Set popup HTML content
    /// </summary>
    public async Task SetPopupHtmlAsync(string popupId, string html)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setPopupHTML", MapId, popupId, html);
    }

    #endregion

    #region Feature Query Methods

    /// <summary>
    ///     Query rendered features at a point or within bounds
    /// </summary>
    public async Task<List<MapFeature>> QueryRenderedFeaturesAsync(double[]? point = null, string[]? layers = null)
    {
        if (MapId == null) return new List<MapFeature>();
        var options = layers != null ? new { layers } : null;
        var features = await JS.InvokeAsync<object[]>("BwMapLibre.queryRenderedFeatures", MapId, point, options);
        return ParseFeatures(features);
    }

    /// <summary>
    ///     Query source features
    /// </summary>
    public async Task<List<MapFeature>> QuerySourceFeaturesAsync(string sourceId, string? sourceLayer = null)
    {
        if (MapId == null) return new List<MapFeature>();
        var options = sourceLayer != null ? new { sourceLayer } : null;
        var features = await JS.InvokeAsync<object[]>("BwMapLibre.querySourceFeatures", MapId, sourceId, options);
        return ParseFeatures(features);
    }

    /// <summary>
    ///     Set feature state
    /// </summary>
    public async Task SetFeatureStateAsync(string source, object id, object state, string? sourceLayer = null)
    {
        if (MapId == null) return;
        var feature = sourceLayer != null
            ? new { source, sourceLayer, id }
            : (object)new { source, id };
        await JS.InvokeVoidAsync("BwMapLibre.setFeatureState", MapId, feature, state);
    }

    /// <summary>
    ///     Remove feature state
    /// </summary>
    public async Task RemoveFeatureStateAsync(string source, object? id = null, string? key = null,
        string? sourceLayer = null)
    {
        if (MapId == null) return;
        var feature = sourceLayer != null
            ? new { source, sourceLayer, id }
            : (object)new { source, id };
        await JS.InvokeVoidAsync("BwMapLibre.removeFeatureState", MapId, feature, key);
    }

    #endregion

    #region Style Methods

    /// <summary>
    ///     Set map style
    /// </summary>
    public async Task SetStyleAsync(string styleUrl)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setStyle", MapId, styleUrl);
    }

    /// <summary>
    ///     Add an image to the map
    /// </summary>
    public async Task AddImageAsync(string id, string url, bool sdf = false)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.addImage", MapId, id, url, new { sdf });
    }

    /// <summary>
    ///     Check if image exists
    /// </summary>
    public async Task<bool> HasImageAsync(string id)
    {
        if (MapId == null) return false;
        return await JS.InvokeAsync<bool>("BwMapLibre.hasImage", MapId, id);
    }

    /// <summary>
    ///     Remove an image from the map
    /// </summary>
    public async Task RemoveImageAsync(string id)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.removeImage", MapId, id);
    }

    #endregion

    #region Terrain/Light/Sky/Fog Methods

    /// <summary>
    ///     Set terrain
    /// </summary>
    public async Task SetTerrainAsync(string source, double exaggeration = 1)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setTerrain", MapId, new { source, exaggeration });
    }

    /// <summary>
    ///     Set light
    /// </summary>
    public async Task SetLightAsync(object light)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setLight", MapId, light);
    }

    /// <summary>
    ///     Set sky
    /// </summary>
    public async Task SetSkyAsync(object sky)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setSky", MapId, sky);
    }

    /// <summary>
    ///     Set fog
    /// </summary>
    public async Task SetFogAsync(object fog)
    {
        if (MapId == null) return;
        await JS.InvokeVoidAsync("BwMapLibre.setFog", MapId, fog);
    }

    #endregion

    #region Coordinate Methods

    /// <summary>
    ///     Project lng/lat to pixel coordinates
    /// </summary>
    public async Task<double[]?> ProjectAsync(double[] lngLat)
    {
        if (MapId == null) return null;
        return await JS.InvokeAsync<double[]?>("BwMapLibre.project", MapId, lngLat);
    }

    /// <summary>
    ///     Unproject pixel coordinates to lng/lat
    /// </summary>
    public async Task<double[]?> UnprojectAsync(double[] point)
    {
        if (MapId == null) return null;
        return await JS.InvokeAsync<double[]?>("BwMapLibre.unproject", MapId, point);
    }

    #endregion
}