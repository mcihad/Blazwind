# Column

A flexible 12-column grid item that supports responsive widths and vertical stacking logic.

## Usage

### Responsive Grid
Specify different spans for different screen sizes. `Span` is the default (mobile) width.

```razor
@using Blazwind.Components.Layout

<BwRow>
    <BwColumn Span="12" Md="6" Lg="3">Responsive Box</BwColumn>
</BwRow>
```

### Stacking Logic
`BwColumn` also acts as a `flex-col` container. You can use it to stack elements vertically with spacing.

```razor
<BwColumn Spacing="BwSpacing.Md">
    <BwButton Text="Action 1" />
    <BwButton Text="Action 2" />
</BwColumn>
```

## Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Span` | `int?` | `12` | Default (mobile) width (1-12). |
| `Sm` | `int?` | `null` | Item width on small screens (640px+). |
| `Md` | `int?` | `null` | Item width on medium screens (768px+). |
| `Lg` | `int?` | `null` | Item width on large screens (1024px+). |
| `Xl` | `int?` | `null` | Item width on extra large screens (1280px+). |
| `Xxl` | `int?` | `null` | Item width on massive screens (1536px+). |
| `MainAxisAlignment` | `BwMainAxisAlignment` | `Start` | Vertical alignment when stacking children. |
| `CrossAxisAlignment` | `BwCrossAxisAlignment` | `Stretch` | Horizontal alignment when stacking children. |
| `Spacing` | `BwSpacing` | `Md` | Gap between stacked children. |
| `Class` | `string?` | `null` | Custom CSS classes. |
