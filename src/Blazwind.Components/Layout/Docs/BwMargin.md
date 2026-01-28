# Margin

A utility component that applies consistent external spacing (margin) to its children using the Blazwind spacing system.

## Usage

Use `BwMargin` to separate components or add space around elements without custom CSS.

```razor
@using Blazwind.Components.Layout

<BwMargin Bottom="BwSpacing.Lg">
    <div>This div has a large bottom margin.</div>
</BwMargin>

<BwMargin All="BwSpacing.Sm">
    <BwButton Text="Spaced Button" />
</BwMargin>
```

## Parameters

The spacing system follows a priority order: **Specific** (Top/Left/etc.) > **Symmetric** (Horizontal/Vertical) > **All
**.

| Parameter    | Type         | Default | Description                             |
|:-------------|:-------------|:--------|:----------------------------------------|
| `All`        | `BwSpacing?` | `null`  | Applies margin to all four sides.       |
| `Horizontal` | `BwSpacing?` | `null`  | Applies margin to left and right sides. |
| `Vertical`   | `BwSpacing?` | `null`  | Applies margin to top and bottom sides. |
| `Top`        | `BwSpacing?` | `null`  | Applies margin to the top side.         |
| `Bottom`     | `BwSpacing?` | `null`  | Applies margin to the bottom side.      |
| `Left`       | `BwSpacing?` | `null`  | Applies margin to the left side.        |
| `Right`      | `BwSpacing?` | `null`  | Applies margin to the right side.       |
| `TagName`    | `string`     | `"div"` | The HTML tag used for the wrapper.      |
| `Class`      | `string?`    | `null`  | Custom CSS classes.                     |
| `Style`      | `string?`    | `null`  | Custom inline CSS styles.               |
