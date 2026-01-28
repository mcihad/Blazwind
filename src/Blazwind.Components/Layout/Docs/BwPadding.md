# Padding

A utility component that applies consistent internal spacing (padding) to its children using the Blazwind spacing
system.

## Usage

Use `BwPadding` to wrap content and apply spacing without writing custom CSS classes.

```razor
@using Blazwind.Components.Layout

<BwPadding All="BwSpacing.Md">
    <div class="bg-gray-100">Content with uniform padding.</div>
</BwPadding>

@* Symmetric and specific padding *@
<BwPadding Horizontal="BwSpacing.Lg" Top="BwSpacing.Xs">
    <span>Specific padding applied.</span>
</BwPadding>
```

## Parameters

The spacing system follows a priority order: **Specific** (Top/Left/etc.) > **Symmetric** (Horizontal/Vertical) > **All
**.

| Parameter    | Type         | Default | Description                              |
|:-------------|:-------------|:--------|:-----------------------------------------|
| `All`        | `BwSpacing?` | `null`  | Applies padding to all four sides.       |
| `Horizontal` | `BwSpacing?` | `null`  | Applies padding to left and right sides. |
| `Vertical`   | `BwSpacing?` | `null`  | Applies padding to top and bottom sides. |
| `Top`        | `BwSpacing?` | `null`  | Applies padding to the top side.         |
| `Bottom`     | `BwSpacing?` | `null`  | Applies padding to the bottom side.      |
| `Left`       | `BwSpacing?` | `null`  | Applies padding to the left side.        |
| `Right`      | `BwSpacing?` | `null`  | Applies padding to the right side.       |
| `TagName`    | `string`     | `"div"` | The HTML tag used for the wrapper.       |
| `Class`      | `string?`    | `null`  | Custom CSS classes.                      |
| `Style`      | `string?`    | `null`  | Custom inline CSS styles.                |

..) > Symmetric (Horizontal/Vertical) > All.

```razor
<BwPadding Top="BwSpacing.Xl" Bottom="BwSpacing.Md">
    <!-- İçerik -->
</BwPadding>
{{ ... }}
