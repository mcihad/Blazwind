# MapLibre

A comprehensive Blazor wrapper for MapLibre GL JS, supporting vector and raster maps, WMS/WMTS, GeoJSON, markers,
popups, and highly interactive layers with custom click priorities.

## Usage

### Basic Setup

Initialize a map with a default style.

```razor
@using Blazwind.Components.Map

<BwMapLibre 
    StyleUrl="https://demotiles.maplibre.org/style.json"
    Center="@(new[] { 37.0156, 39.7477 })"
    Zoom="12" />
```

### Advanced Camera Control

Programmatically control the map's camera using `FlyToAsync` or `EaseToAsync`.

```razor
<BwMapLibre @ref="_map" 
            Center="@(new[] { 37.0156, 39.7477 })" 
            Zoom="10" />

<BwButton Text="Fly to City Center" OnClick="FlyToCenter" />

@code {
    private BwMapLibre? _map;

    private async Task FlyToCenter()
    {
        if (_map == null) return;
        
        await _map.FlyToAsync(new FlyToOptions
        {
            Center = new LngLat(37.0156, 39.7477),
            Zoom = 15,
            Duration = 2000 // ms
        });
    }
}
```

### Fullscreen Layout with Controls

Use `BwMapLayout` and built-in controls for a full-featured map interface.

```razor
<BwMapLayout Fullscreen="true">
    <BwMapLibre 
        StyleUrl="osm_style.json"
        Center="@(new[] { 37.0156, 39.7477 })"
        Zoom="13"
        NavigationControl="true"
        GeolocateControl="true"
        ScaleControl="true"
        FullscreenControl="true" />
</BwMapLayout>
```

## API

### Parameters

| Parameter            | Type                 | Default  | Description                                        |
|:---------------------|:---------------------|:---------|:---------------------------------------------------|
| `StyleUrl`           | `string`             | OSM Demo | URL to the MapLibre style JSON.                    |
| `Center`             | `double[]?`          | `null`   | Initial center point `[longitude, latitude]`.      |
| `Zoom`               | `double?`            | `null`   | Initial zoom level.                                |
| `Pitch`              | `double?`            | `null`   | Initial tilt in degrees.                           |
| `Bearing`            | `double?`            | `null`   | Initial rotation in degrees.                       |
| `MinZoom`            | `double?`            | `null`   | Minimum allowed zoom level.                        |
| `MaxZoom`            | `double?`            | `null`   | Maximum allowed zoom level.                        |
| `Interactive`        | `bool`               | `true`   | Whether the user can interact with the map.        |
| `Hash`               | `bool`               | `false`  | Sync map state with the URL hash.                  |
| `Controls`           | `MapControlsConfig?` | `null`   | Detailed configuration for map controls.           |
| `NavigationControl`  | `bool`               | `true`   | Quickly toggle navigation controls (zoom/compass). |
| `FullscreenControl`  | `bool`               | `false`  | Enable the fullscreen toggle button.               |
| `ScaleControl`       | `bool`               | `false`  | Show the map scale.                                |
| `GeolocateControl`   | `bool`               | `false`  | Show the user location button.                     |
| `AttributionControl` | `bool`               | `true`   | Show attribution information.                      |

### Events

| Event           | Argument Type       | Description                                   |
|:----------------|:--------------------|:----------------------------------------------|
| `OnLoad`        | `EventCallback`     | Fired when the map is fully loaded and ready. |
| `OnMove`        | `MapMoveEventArgs`  | Fired during map movement.                    |
| `OnMoveEnd`     | `MapMoveEventArgs`  | Fired when the map stops moving.              |
| `OnZoom`        | `double`            | Fired during zoom level changes.              |
| `OnClick`       | `MapMouseEventArgs` | Fired when the map is clicked.                |
| `OnContextMenu` | `MapMouseEventArgs` | Fired on right-click.                         |
| `OnLayerClick`  | `MapLayerEventArgs` | Fired when an interactive layer is clicked.   |
| `OnError`       | `string`            | Fired on map errors.                          |

### Methods

| Method                             | Description                                                      |
|:-----------------------------------|:-----------------------------------------------------------------|
| `AddSourceAsync(MapSource)`        | Add a data source (GeoJSON, Raster, Vector).                     |
| `AddLayerAsync(MapLayer, string?)` | Add a visual layer based on a source.                            |
| `AddMarkerAsync(MapMarker)`        | Add a marker with optional popup.                                |
| `FlyToAsync(FlyToOptions)`         | Smoothly fly to a specific camera state.                         |
| `FitBoundsAsync(LngLatBounds)`     | Zoom/Pan to fit a specific bounding box.                         |
| `ToDataUrlAsync()`                 | Take a screenshot of the map (requires `PreserveDrawingBuffer`). |
| `GetCenterAsync()`                 | Get the current map center coordinates.                          |
| `GetZoomAsync()`                   | Get the current zoom level.                                      |
