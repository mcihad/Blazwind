# Flex & FlexItem

The `BwFlex` and `BwFlexItem` components provide a high-level wrapper around the CSS Flexbox system, allowing you to build professional layouts without writing manual CSS.

## BwFlex (Container)

The root flex container. Controls the arrangement, spacing, and alignment of its children.

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Direction` | `BwFlexDirection` | `Row` | The direction of the main axis (`Row`, `RowReverse`, `Column`, `ColumnReverse`). |
| `Wrap` | `BwFlexWrap` | `NoWrap` | Controls item wrapping behavior (`NoWrap`, `Wrap`, `WrapReverse`). |
| `JustifyContent` | `BwMainAxisAlignment` | `Start` | Alignment along the main axis (`Start`, `Center`, `End`, `SpaceBetween`, etc.). |
| `AlignItems` | `BwCrossAxisAlignment` | `Stretch` | Alignment along the cross axis (`Start`, `Center`, `End`, `Stretch`, `Baseline`). |
| `AlignContent` | `BwAlignContent?` | `null` | Alignment of multi-line content (only when `Wrap` is enabled). |
| `Gap` | `BwSpacing` | `None` | Uniform spacing between children using the theme scale. |
| `GapX` | `int?` | `null` | Horizontal gap override (Tailwind scale 0-96). |
| `GapY` | `int?` | `null` | Vertical gap override (Tailwind scale 0-96). |
| `Inline` | `bool` | `false` | If true, uses `inline-flex` instead of `flex`. |
| `Class` | `string?` | `null` | Custom CSS classes. |

### Usage

```razor
@using Blazwind.Components.Layout

@* Simple horizontal layout with spacing *@
<BwFlex Gap="BwSpacing.Md">
    <div class="p-4 bg-gray-100">Box 1</div>
    <div class="p-4 bg-gray-100">Box 2</div>
</BwFlex>

@* Vertical centered column *@
<BwFlex Direction="BwFlexDirection.Column" 
        AlignItems="BwCrossAxisAlignment.Center" 
        Gap="BwSpacing.Sm">
    <BwIcon Name="fa-rocket" />
    <span>Launching soon...</span>
</BwFlex>
```

---

## BwFlexItem (Child)

Provides granular control over a single item within a `BwFlex` container.

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Grow` | `int?` | `null` | Growth factor (0 = default, 1+ = fills space). |
| `Shrink` | `int?` | `null` | Shrink factor (0 = never shrink, 1+ = shrinks if needed). |
| `Basis` | `string?` | `null` | Initial size (`auto`, `0`, `full`, `1/4`, `200px`, `10rem`). |
| `AlignSelf` | `BwAlignSelf?` | `null` | Individual alignment override (`Start`, `Center`, `End`, `Stretch`). |
| `Order` | `int?` | `null` | Visual order (`-9999` for first, `9999` for last, or `1-12`). |
| `Class` | `string?` | `null` | Custom CSS classes. |

### Enums

#### BwAlignSelf
- `Auto`, `Start`, `Center`, `End`, `Stretch`, `Baseline`

### Advanced Sizing Examples

```razor
@* Holy Grail Sidebar Pattern *@
<BwFlex>
    <BwFlexItem Basis="250px" Shrink="0">
        Sidebar (Fixed width, won't shrink)
    </BwFlexItem>
    <BwFlexItem Grow="1">
        Main Content (Grows to fill remaining space)
    </BwFlexItem>
</BwFlex>

@* Changing visual order without moving DOM nodes *@
<BwFlex>
    <BwFlexItem Order="2">Item A (Visual 2nd)</BwFlexItem>
    <BwFlexItem Order="1">Item B (Visual 1st)</BwFlexItem>
</BwFlex>
```

## Real-World Examples

### Media Object
```razor
<BwFlex Gap="BwSpacing.Md" AlignItems="BwCrossAxisAlignment.Start">
    <div class="w-12 h-12 bg-blue-500 rounded-full shrink-0"></div>
    <BwFlexItem Grow="1">
        <h4 class="font-bold">John Doe</h4>
        <p class="text-sm text-gray-500">Software Engineer specialized in Blazor.</p>
    </BwFlexItem>
</BwFlex>
```

### Center Everything
Perfect for splash screens or hero sections.
```razor
<BwFlex JustifyContent="BwMainAxisAlignment.Center" 
        AlignItems="BwCrossAxisAlignment.Center" 
        Class="h-64 bg-slate-900 text-white">
    <span>I am perfectly centered!</span>
</BwFlex>
```
