# BwButton

The primary button component for user interaction, supporting various variants, colors, sizes, and icon positions.

## Examples

### Basic Usage
Standard buttons with different colors and sizes.

```razor
<BwButton Text="Primary" Color="BwColor.Primary" />
<BwButton Text="Success" Color="BwColor.Success" />
<BwButton Text="Danger" Color="BwColor.Danger" />
```

### Variants
Customize the visual style using the `Variant` parameter.

```razor
<BwButton Text="Filled" Variant="BwVariant.Filled" Color="BwColor.Primary" />
<BwButton Text="Outline" Variant="BwVariant.Outline" Color="BwColor.Primary" />
<BwButton Text="Soft" Variant="BwVariant.Soft" Color="BwColor.Primary" />
<BwButton Text="Ghost" Variant="BwVariant.Ghost" Color="BwColor.Primary" />
<BwButton Text="Link" Variant="BwVariant.Link" Color="BwColor.Primary" />
```

### Icons
Support for left, right, or icon-only configurations.

```razor
<BwButton Text="Save" Icon="fa-solid fa-save" />
<BwButton Text="Next" Icon="fa-solid fa-arrow-right" IconPosition="BwIconPosition.Right" />
<BwButton Icon="fa-solid fa-trash" Color="BwColor.Danger" IconPosition="BwIconPosition.Only" />
```

### States
Handle loading and disabled states efficiently.

```razor
<BwButton Text="Submit" IsLoading="true" />
<BwButton Text="Disabled" Disabled="true" />
```

### Badges
Display small notifications or counts on buttons.

```razor
<BwButton Text="Notifications" Color="BwColor.Secondary">
    <BadgeContent>
        <BwBadge Color="BwColor.Danger" IsPill="true" Size="BwSize.ExtraSmall">3</BwBadge>
    </BadgeContent>
</BwButton>
```

## API

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Text` | `string?` | `null` | The button label. |
| `ChildContent` | `RenderFragment?` | `null` | Custom content inside the button. |
| `BadgeContent` | `RenderFragment?` | `null` | Content to be displayed as a badge on the button. |
| `Variant` | `BwVariant` | `Filled` | Visual style (`Filled`, `Outline`, `Soft`, `Ghost`, `Link`). |
| `Color` | `BwColor` | `Primary` | The button's color theme. |
| `Size` | `BwSize` | `Medium` | Button size (`Small`, `Medium`, `Large`). |
| `Icon` | `string?` | `null` | CSS class for the icon (e.g., "fa-solid fa-save"). |
| `IconPosition` | `BwIconPosition` | `Left` | Icon placement (`Left`, `Right`, `Only`). |
| `Disabled` | `bool` | `false` | If `true`, prevents user interaction. |
| `IsLoading` | `bool` | `false` | Shows a loading spinner and disables interaction. |
| `HtmlType` | `string` | `"button"` | HTML `type` attribute (`button`, `submit`, `reset`). |
| `OnClick` | `EventCallback<MouseEventArgs>` | - | Triggered when the button is clicked. |
| `Class` | `string?` | `null` | Additional CSS classes. |
