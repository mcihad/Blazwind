# Map Marker

Component for showing pointers (markers) on a MapLibre map. Supports custom icons, dragging, and popups.

## Examples

### Basic Marker

Place a simple marker at a specific coordinate.

```razor
<BwMapLibre Center="@(new[] { 37.0156, 39.7477 })" Zoom="13">
    <BwMapLibreMarker 
        Id="center"
        LngLat="@(new[] { 37.0156, 39.7477 })" />
</BwMapLibre>
```

### Colored Marker with Popup

Customize the marker color and add an informational popup.

```razor
<BwMapLibreMarker 
    Id="poi-1"
    LngLat="@(new[] { 37.0156, 39.7477 })"
    Color="#ef4444" 
    PopupHtml="<strong>City Center</strong><p>Informational message here.</p>" />
```

### Draggable Marker

Allow users to reposition the marker and capture the new coordinates.

```razor
<BwMapLibre 
    Center="@(new[] { 37.0156, 39.7477 })" 
    Zoom="13">
    
    <BwMapLibreMarker 
        Id="draggable-marker"
        LngLat="@_pos"
        Color="#3b82f6"
        Draggable="true"
        OnDragEnd="HandleDragEnd" />
</BwMapLibre>

@code {
    private double[] _pos = { 37.0156, 39.7477 };
    
    private void HandleDragEnd(double[] newLngLat)
    {
        _pos = newLngLat;
    }
}
```

### Custom HTML Marker

Use a custom HTML string to render a unique marker icon.

```razor
<BwMapLibreMarker 
    Id="custom-icon"
    LngLat="@(new[] { 37.0156, 39.7477 })"
    Element="@("<div class='custom-marker-class'><i class='fa-solid fa-home text-blue-500 text-2xl'></i></div>")" />
```

## API

### Parameters

| Parameter      | Type               | Default        | Description                                                                      |
|:---------------|:-------------------|:---------------|:---------------------------------------------------------------------------------|
| `Id`           | `string`           | Auto-generated | Unique marker identifier.                                                        |
| `LngLat`       | `double[]`         | `[0, 0]`       | Position `[longitude, latitude]`.                                                |
| `Longitude`    | `double?`          | `null`         | Alternative to `LngLat`.                                                         |
| `Latitude`     | `double?`          | `null`         | Alternative to `LngLat`.                                                         |
| `Color`        | `string?`          | `null`         | CSS color for the default marker.                                                |
| `Scale`        | `double?`          | `1`            | Scaling factor for the marker.                                                   |
| `Rotation`     | `double?`          | `0`            | Rotation in degrees.                                                             |
| `Element`      | `string?`          | `null`         | Custom HTML element string for the marker.                                       |
| `Anchor`       | `string?`          | `center`       | Part of the marker that is at the coordinate (`top`, `bottom`, `left`, `right`). |
| `Offset`       | `double[]?`        | `null`         | Pixel offset `[x, y]` from the anchor.                                           |
| `Draggable`    | `bool`             | `false`        | Whether the user can drag the marker.                                            |
| `PopupHtml`    | `string?`          | `null`         | HTML content for the attached popup.                                             |
| `PopupOptions` | `MapPopupOptions?` | `null`         | Detailed options for the popup.                                                  |

### Events

| Event         | Argument Type             | Description                       |
|:--------------|:--------------------------|:----------------------------------|
| `OnDragStart` | `EventCallback<double[]>` | Fired when dragging begins.       |
| `OnDrag`      | `EventCallback<double[]>` | Fired continuously during drag.   |
| `OnDragEnd`   | `EventCallback<double[]>` | Fired when the marker is dropped. |

### Methods

| Method                                    | Description                                  |
|:------------------------------------------|:---------------------------------------------|
| `SetLngLatAsync(double[])`                | Programmatically update the marker position. |
| `SetPopupAsync(string, MapPopupOptions?)` | Add or update the marker's popup.            |
| `TogglePopupAsync()`                      | Open or close the attached popup.            |
