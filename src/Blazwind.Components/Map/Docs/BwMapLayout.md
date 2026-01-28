# Map Layout

A container component designed to wrap `BwMapLibre`. It provides easy configuration for fullscreen maps or fixed-size
map containers.

## Usage

### Fullscreen Map

The default mode. It fills the entire viewport and positions itself fixed at the top of the page.

```razor
<BwMapLayout Fullscreen="true">
    <BwMapLibre StyleUrl="osm_style.json" />
</BwMapLayout>
```

### Fixed Size Container

Disable fullscreen and provide specific height/width.

```razor
<BwMapLayout Fullscreen="false" Height="600px" Width="100%" Class="rounded-xl overflow-hidden shadow-lg">
    <BwMapLibre StyleUrl="osm_style.json" Center="@(new[] { 37.0156, 39.7477 })" Zoom="12" />
</BwMapLayout>
```

## API

### Parameters

| Parameter      | Type              | Default | Description                                                           |
|:---------------|:------------------|:--------|:----------------------------------------------------------------------|
| `Fullscreen`   | `bool`            | `true`  | If true, fills the screen with `fixed` positioning and `z-index: 50`. |
| `Height`       | `string?`         | `500px` | Height in CSS units (used only when `Fullscreen="false"`).            |
| `Width`        | `string?`         | `100%`  | Width in CSS units (used only when `Fullscreen="false"`).             |
| `Class`        | `string?`         | `null`  | Additional CSS classes for the container.                             |
| `Style`        | `string?`         | `null`  | Inline styles for the container.                                      |
| `ChildContent` | `RenderFragment?` | `null`  | Content (typically `BwMapLibre`).                                     |

## Implementation Details

Under the hood, `BwMapLayout` applies the following styles when `Fullscreen` is `true`:

- `position: fixed`
- `inset: 0`
- `width: 100vw`
- `height: 100vh`
- `z-index: 50`

When `Fullscreen` is `false`:

- `position: relative`
- Dynamic `width` and `height` based on parameters.
