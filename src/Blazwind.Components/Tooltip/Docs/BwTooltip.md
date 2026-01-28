# Tooltip

A component that displays informative text when a user hovers over, focuses on, or clicks an element.

## Examples

### Basic Usage

```razor
<BwTooltip Text="This is a tooltip">
    <BwButton Text="Hover Me" />
</BwTooltip>
```

### Placements

Control where the tooltip appears using the `Placement` parameter.

```razor
<BwTooltip Text="Top" Placement="BwPlacement.Top"><BwButton Text="Top" /></BwTooltip>
<BwTooltip Text="Right" Placement="BwPlacement.Right"><BwButton Text="Right" /></BwTooltip>
<BwTooltip Text="Bottom" Placement="BwPlacement.Bottom"><BwButton Text="Bottom" /></BwTooltip>
<BwTooltip Text="Left" Placement="BwPlacement.Left"><BwButton Text="Left" /></BwTooltip>
```

### Colors

Tooltips support semantic colors.

```razor
<BwTooltip Text="Success!" Color="BwColor.Success">
    <BwButton Text="Success" Color="BwColor.Success" />
</BwTooltip>
```

### Triggers

By default, it triggers on `Hover`. You can change this to `Focus` or `Both`.

```razor
<BwTooltip Text="I appear on focus" Trigger="TooltipTrigger.Focus">
    <input class="border p-2" placeholder="Focus me..." />
</BwTooltip>
```

## API

### Parameters

| Parameter   | Type             | Default  | Description                               |
|:------------|:-----------------|:---------|:------------------------------------------|
| `Text`      | `string`         | `null`   | The content of the tooltip.               |
| `Icon`      | `string`         | `null`   | Optional icon to display before the text. |
| `Placement` | `BwPlacement`    | `Top`    | Position relative to the child element.   |
| `Color`     | `BwColor`        | `Dark`   | Color theme.                              |
| `Size`      | `BwSize`         | `Medium` | Text size.                                |
| `ShowArrow` | `bool`           | `true`   | Whether to show the pointer arrow.        |
| `Trigger`   | `TooltipTrigger` | `Hover`  | `Hover`, `Focus`, or `Both`.              |
| `ShowDelay` | `int`            | `100`    | Delay in ms before showing.               |
| `HideDelay` | `int`            | `0`      | Delay in ms before hiding.                |
| `Disabled`  | `bool`           | `false`  | Disables the tooltip.                     |
