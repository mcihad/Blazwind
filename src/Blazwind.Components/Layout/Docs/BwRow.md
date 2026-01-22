# Row

A flexbox-based container component used as a horizontal wrapper in the Blazwind grid system. Supports both Flexbox and CSS Grid layouts.

## Usage

### Grid Logic
Combine `BwRow` with `BwColumn` to create responsive layouts.

```razor
@using Blazwind.Components.Layout

<BwRow Spacing="BwSpacing.Md">
    <BwColumn Span="12" Md="6">Column A</BwColumn>
    <BwColumn Span="12" Md="6">Column B</BwColumn>
</BwRow>
```

### Alignment & Spacing
Control internal alignment and gaps easily using enums.

```razor
<BwRow MainAxisAlignment="BwMainAxisAlignment.Center" 
       CrossAxisAlignment="BwCrossAxisAlignment.Center"
       Spacing="BwSpacing.Lg">
    <!-- Centered content with large gaps -->
</BwRow>
```

### CSS Grid Mode
Use responsive column parameters to switch to CSS Grid layout automatically.

```razor
<BwRow Cols="1" SmCols="2" MdCols="3" LgCols="4" Spacing="BwSpacing.Md">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
    <div>Item 4</div>
</BwRow>
```

This automatically generates: `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`

## Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `MainAxisAlignment` | `BwMainAxisAlignment` | `Start` | Horizontal alignment of children (Start, Center, End, SpaceBetween, etc.). |
| `CrossAxisAlignment` | `BwCrossAxisAlignment` | `Stretch` | Vertical alignment of children (Start, Center, End, Stretch, Baseline). |
| `Spacing` | `BwSpacing` | `Md` | Standard gap between items using theme scale. |
| `GutterX` | `int?` | `null` | Manual horizontal gap (Tailwind scale 0-12). Overrides `Spacing`. |
| `GutterY` | `int?` | `null` | Manual vertical gap (Tailwind scale 0-12). Overrides `Spacing`. |
| `Wrap` | `bool` | `true` | Whether items should wrap to the next line. |
| `Class` | `string?` | `null` | Custom CSS classes. |

### Responsive Grid Columns

When any column parameter is set, the component switches from Flexbox to CSS Grid.

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Cols` | `int?` | `null` | Base column count (1-8). |
| `SmCols` | `int?` | `null` | Column count for `sm:` breakpoint (640px+). |
| `MdCols` | `int?` | `null` | Column count for `md:` breakpoint (768px+). |
| `LgCols` | `int?` | `null` | Column count for `lg:` breakpoint (1024px+). |
| `XlCols` | `int?` | `null` | Column count for `xl:` breakpoint (1280px+). |

## Enums

### BwMainAxisAlignment
- `Start`, `Center`, `End`, `SpaceBetween`, `SpaceAround`, `SpaceEvenly`

### BwCrossAxisAlignment
- `Start`, `Center`, `End`, `Stretch`, `Baseline`

