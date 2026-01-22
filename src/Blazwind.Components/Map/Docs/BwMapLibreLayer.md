# Map Layer
Component for adding visual layers to a MapLibre map. Supports fill, line, symbol, circle, heatmap, and other layer types.

## Examples

### Fill Layer
Display polygons with a fill color.

```razor
<BwMapLibreLayer 
    Id="buildings-fill"
    Type="@MapLayerType.Fill"
    SourceId="buildings"
    SourceLayer="buildings"
    Paint="@(new { 
        fillColor = "#4264fb", 
        fillOpacity = 0.4 
    })" />
```

### Circle Layer with Interaction
Render point data as circles and handle click events.

```razor
<BwMapLibreLayer 
    Id="points"
    Type="@MapLayerType.Circle"
    SourceId="points-source"
    Interactive="true"
    OnClick="HandlePointClick"
    Paint="@(new { 
        circleColor = "#11b4da",
        circleRadius = 8,
        circleStrokeWidth = 2,
        circleStrokeColor = "#fff"
    })" />
```

### Symbol Layer (Icons and Text)
Display icons and text labels from properties.

```razor
<BwMapLibreLayer 
    Id="labels"
    Type="@MapLayerType.Symbol"
    SourceId="poi-source"
    Layout="@(new { 
        iconImage = "marker-15",
        textField = new object[] { "get", "name" },
        textOffset = new[] { 0, 1.2 },
        textAnchor = "top"
    })" />
```

### Layer Group
Use `BwMapLibreLayerGroup` to manage multiple related layers (e.g., fill + border) as a single unit.

```razor
<BwMapLibreLayerGroup Id="parcel-group" Visible="true" ClickOrder="10">
    @* Fill layer inherits group visibility and click priority *@
    <BwMapLibreLayer 
        Id="parcel-fill" 
        Type="@MapLayerType.Fill" 
        SourceId="parcels"
        Paint="@(new { fillColor = "#4ade80", fillOpacity = 0.5 })" />
        
    @* Outline layer *@
    <BwMapLibreLayer 
        Id="parcel-line" 
        Type="@MapLayerType.Line" 
        SourceId="parcels"
        Paint="@(new { lineColor = "#166534", lineWidth = 2 })" />
</BwMapLibreLayerGroup>
```

## API

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Id` | `string` | Auto-generated | Unique layer identifier. |
| `Type` | `string` | `fill` | Layer type (`fill`, `line`, `symbol`, `circle`, `heatmap`, etc.). |
| `SourceId` | `string?` | `null` | ID of the source this layer uses. |
| `SourceLayer` | `string?` | `null` | Layer name within a vector tile source. |
| `Paint` | `object?` | `null` | MapLibre paint properties. |
| `Layout` | `object?` | `null` | MapLibre layout properties. |
| `Filter` | `object[]?` | `null` | MapLibre filter expression. |
| `MinZoom` | `float?` | `null` | Minimum zoom level. |
| `MaxZoom` | `float?` | `null` | Maximum zoom level. |
| `Visible` | `bool` | `true` | Visibility state. |
| `Interactive` | `bool` | `false` | Whether to receive click and hover events. |
| `ClickOrder` | `int` | `0` | Click priority. Higher values are processed first. |
| `BeforeId` | `string?` | `null` | ID of an existing layer to insert this one before. |

### Events

| Event | Argument Type | Description |
| :--- | :--- | :--- |
| `OnClick` | `MapLayerClickEventArgs` | Fired when the layer is clicked. |
| `OnMouseEnter`| `MapLayerEventArgs` | Fired when the mouse enters the layer. |
| `OnMouseLeave`| `MapLayerEventArgs` | Fired when the mouse leaves the layer. |

### Methods

| Method | Description |
| :--- | :--- |
| `SetVisibilityAsync(bool)` | Toggle layer visibility. |
| `SetPaintPropertyAsync(string, object)` | Update a single paint property. |
| `SetFilterAsync(object[])` | Update the layer filter. |

## Interactivity features

### Click Order
When multiple interactive layers overlap, MapLibre normally returns all features. Blazwind uses the `ClickOrder` parameter to let you control which layer's click event is prioritized. If a user clicks on an area with multiple layers, the one with the highest `ClickOrder` will be evaluated first.

### Layer Grouping
`BwMapLibreLayerGroup` is a container that:
1.  **Syncs Visibility**: Toggling the group's `Visible` parameter affects all child layers.
2.  **Sets Default Click Order**: Child layers inherit the group's `ClickOrder` unless they specify their own.
3.  **Unified Events**: You can listen for `OnClick` on the group itself to capture clicks from any of its child layers.
