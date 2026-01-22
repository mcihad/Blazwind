# Watermark

A component used to add a watermark (text or image) over content.

## Features

- Text or Image watermark
- Configurable angle and opacity
- Repeating pattern
- Customizable gap and size

## Usage

```razor
<BwWatermark Text="CONFIDENTIAL">
    <div class="p-8 bg-white">
        Watermarked content
    </div>
</BwWatermark>
```

## Parameters

| Name | Type | Default | Description |
|------|-----|------------|----------|
| `Text` | `string` | - | Watermark text. |
| `ImageUrl` | `string` | - | URL of the image to use as watermark. |
| `Rotate` | `int` | `-22` | Rotation angle (degrees). |
| `Opacity` | `double` | `0.15` | Opacity (0-1). |
| `FontSize` | `int` | `16` | Text size (px). |
| `GapX` | `int` | `100` | Horizontal gap distance (px). |
| `GapY` | `int` | `100` | Vertical gap distance (px). |
| `Color` | `string` | `"#000"` | Text color. |
| `ChildContent` | `RenderFragment` | - | The content to be watermarked. |

## Examples

### Text Watermark

```razor
<BwWatermark Text="DRAFT" 
             Rotate="-30" 
             Opacity="0.1"
             FontSize="20">
    <div class="p-8">
        Draft document content...
    </div>
</BwWatermark>
```

### Image Watermark

```razor
<BwWatermark ImageUrl="/images/logo.png" 
             Opacity="0.08"
             GapX="150" 
             GapY="150">
    <div class="p-8">
        Content protected by logo watermark
    </div>
</BwWatermark>
```

### Dense Pattern

```razor
<BwWatermark Text="©2024" 
             GapX="50" 
             GapY="50"
             FontSize="12"
             Opacity="0.2">
    <img src="photo.jpg" />
</BwWatermark>
```
