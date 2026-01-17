# Row

A flexbox-based container component used as a horizontal wrapper in the Blazwind grid system.

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

## Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `MainAxisAlignment` | `BwMainAxisAlignment` | `Start` | Horizontal alignment of children (Start, Center, End, SpaceBetween, etc.). |
| `CrossAxisAlignment` | `BwCrossAxisAlignment` | `Stretch` | Vertical alignment of children (Start, Center, End, Stretch, Baseline). |
| `Spacing` | `BwSpacing` | `Md` | Standard gap between items using theme scale. |
| `GutterX` | `int?` | `null` | Manual horizontal gap (Tailwind scale 0-96). Overrides `Spacing`. |
| `GutterY` | `int?` | `null` | Manual vertical gap (Tailwind scale 0-96). Overrides `Spacing`. |
| `Wrap` | `bool` | `true` | Whether items should wrap to the next line. |
| `Class` | `string?` | `null` | Custom CSS classes. |

## Enums

### BwMainAxisAlignment
- `Start`, `Center`, `End`, `SpaceBetween`, `SpaceAround`, `SpaceEvenly`

### BwCrossAxisAlignment
- `Start`, `Center`, `End`, `Stretch`, `Baseline`
