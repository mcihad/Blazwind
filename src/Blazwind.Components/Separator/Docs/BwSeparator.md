# BwSeparator

A flexible separator component to divide content horizontally or vertically.

## Usage

### Basic Usage
The default separator is a horizontal line with a gray color.

```razor
<BwSeparator />
```

### With Text
You can add text in the middle of a horizontal separator using the `Text` parameter.

```razor
<BwSeparator Text="OR" />
<BwSeparator Text="Section 1" Color="BwColor.Primary" />
```

### Variants
Supports different border styles via the `Variant` parameter: `Solid` (default), `Dashed`, `Dotted`, `Double`.

```razor
<BwSeparator Variant="BwBorderStyle.Dashed" />
<BwSeparator Variant="BwBorderStyle.Dotted" />
```

### Vertical
Use `Orientation="BwOrientation.Vertical"` for vertical separators. Ensure the parent container has a defined height.

```razor
<div class="flex h-20 items-center">
    <div>Left</div>
    <BwSeparator Orientation="BwOrientation.Vertical" />
    <div>Right</div>
</div>
```

## API

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| Orientation | `BwOrientation` | `Horizontal` | Sets the separator direction (Horizontal/Vertical). |
| Variant | `BwBorderStyle` | `Solid` | Sets the border style (Solid, Dashed, Dotted, Double). |
| Text | `string?` | `null` | Optional text to display in the middle (Horizontal only). |
| TextAlignment | `BwAlignment` | `Center` | Sets the text alignment (Left, Center, Right). |
| Color | `BwColor` | `Gray` | Sets the separator color theme. |
| Class | `string?` | `null` | Custom CSS classes. |
| Style | `string?` | `null` | Custom inline styles. |
