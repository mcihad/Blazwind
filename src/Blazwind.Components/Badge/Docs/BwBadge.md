# BwBadge

A badge component used to highlight status, counts, or labels.

## Examples

### Soft (Default)
The most common style with a subtle background.

```razor
<BwBadge Color="BwColor.Primary">New</BwBadge>
<BwBadge Color="BwColor.Success">Completed</BwBadge>
<BwBadge Color="BwColor.Danger">Error</BwBadge>
```

### Variants
Visual styles are controlled via the `Variant` parameter.

```razor
<BwBadge Variant="BwVariant.Outline" Color="BwColor.Info">Outline</BwBadge>
<BwBadge Variant="BwVariant.Filled" Color="BwColor.Warning">Filled</BwBadge>
<BwBadge Variant="BwVariant.Ghost" Color="BwColor.Secondary">Ghost</BwBadge>
```

### Pill Shape
Use the `IsPill` parameter for fully rounded corners.

```razor
<BwBadge Variant="BwVariant.Filled" Color="BwColor.Primary" IsPill="true">99+</BwBadge>
```

### Icons and dots
Add icons or a status dot to the badge.

```razor
<BwBadge Color="BwColor.Info" Icon="fa-solid fa-circle-info" Text="Info" />
<BwBadge Color="BwColor.Success" ShowDot="true" Text="Online" />
<BwBadge Color="BwColor.Danger" ShowDot="true" /> @* Dot only *@
```

### Dismissible
Badges can be dismissed with a close button.

```razor
<BwBadge Color="BwColor.Primary" Dismissible="true" OnDismiss="HandleDismiss">
    Dismissible Tag
</BwBadge>
```

## API

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Text` | `string?` | `null` | The text content of the badge. |
| `ChildContent` | `RenderFragment?` | `null` | Custom content for the badge (can be used instead of or with `Text`). |
| `Color` | `BwColor` | `BwColor.Primary` | The color theme of the badge. |
| `Variant` | `BwVariant` | `BwVariant.Soft` | Visual style (`Soft`, `Outline`, `Filled`, `Ghost`). |
| `Size` | `BwSize` | `BwSize.Small` | Detailed size control (`ExtraSmall`, `Small`, `Medium`, `Large`). |
| `IsPill` | `bool` | `false` | If `true`, the badge will have fully rounded corners. |
| `ShowDot` | `bool` | `false` | If `true`, a status dot is displayed before the text/icon. |
| `Icon` | `string?` | `null` | CSS class for an icon to be displayed inside the badge. |
| `Dismissible` | `bool` | `false` | If `true`, displays a close button. |
| `OnDismiss` | `EventCallback` | - | Triggered when the dismiss button is clicked. |
| `Class` | `string?` | `null` | Additional CSS classes for the badge. |
